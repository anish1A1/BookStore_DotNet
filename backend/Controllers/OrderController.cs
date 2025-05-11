using System.Security.Claims;
using backend.Data;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Model;
using backend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("order")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly EmailService _emailService;
    private readonly IHubContext<NotificationHub> _hubContext;
    
    public OrderController(ApplicationDbContext context,EmailService emailService, IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _emailService = emailService;
        _hubContext = hubContext;
    }

    private string GenerateClaimCode()
    {
        var random = new Random();
        string prefix = $"{(char)('A' + random.Next(0, 26))}{(char)('A' + random.Next(0, 26))}";
        string middle = random.Next(10000, 99999).ToString();
        string suffix = random.Next(1000, 9999).ToString();
        return $"{prefix}-{middle}-{suffix}";
    }

    [HttpPost]
    [Authorize(Roles = "Member")]
    public async Task<ActionResult<OrderDTO>> PlaceOrder([FromBody] PlaceOrderRequest request)
    {
        // In this post request cartItems should be provided by the frontend
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return BadRequest(new { Message = "User ID not found in claims" });
        var userId = Guid.Parse(userIdClaim);

        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Book)
            .ThenInclude(b => b.Inventory)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null || !cart.CartItems.Any())
            return BadRequest(new { Message = "Cart is empty" });

        foreach (var item in cart.CartItems)
        {
            if (item.Book.Inventory == null || item.Book.Inventory.StockCount < item.Quantity)
                return BadRequest(new { Message = $"Not enough stock for book: {item.Book.BookTitle}" });
        }

        if (request.TotalAmount <= 0)
            return BadRequest(new { Message = "Total amount must be greater than 0" });

        var order = new Order
        {
            OrderId = Guid.NewGuid(),
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            Status = "Pending",
            ClaimCode = GenerateClaimCode(),
            TotalAmount = request.TotalAmount,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var orderItems = cart.CartItems.Select(ci => new OrderItem
        {
            OrderItemId = Guid.NewGuid(),
            OrderId = order.OrderId,
            BookId = ci.BookId,
            Quantity = ci.Quantity,
            UnitPrice = ci.UnitPrice,
            CreatedAt = DateTime.UtcNow
        }).ToList();
        order.OrderItems = orderItems;

        foreach (var item in cart.CartItems)
        {
            if (item.Book.Inventory != null)
            {
                item.Book.Inventory.StockCount -= item.Quantity;
            }
            item.Book.TotalSales += item.Quantity;
            item.Book.UpdatedAt = DateTime.UtcNow;
            if (item.Book.Inventory != null)
            {
                item.Book.Inventory.LastUpdated = DateTime.UtcNow;
            }
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null || string.IsNullOrEmpty(user.UserEmail))
        {
            return BadRequest(new { Message = "User email not found" });
        }

        _context.Carts.Remove(cart);
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        await _emailService.SendOrderConfirmationAsync(
            user.UserEmail,
            order.ClaimCode,
            order.TotalAmount,
            order.OrderItems.Count
        );

        var orderDTO = new OrderDTO
        {
            OrderId = order.OrderId,
            UserId = order.UserId,
            OrderDate = order.OrderDate,
            Status = order.Status,
            ClaimCode = order.ClaimCode,
            DiscountAmount = order.DiscountAmount,
            TotalAmount = order.TotalAmount,
            OrderItems = order.OrderItems.Select(oi => new OrderItemDTO
            {
                OrderItemId = oi.OrderItemId,
                BookId = oi.BookId,
                Book = new BookDTO
                {
                    BookId = oi.Book.BookId,
                    ISBN = oi.Book.ISBN,
                    BookTitle = oi.Book.BookTitle,
                    BookDescription = oi.Book.BookDescription,
                    PublicationDate = oi.Book.PublicationDate,
                    BookLanguage = oi.Book.BookLanguage,
                    BookPrice = oi.Book.BookPrice,
                    StockCount = oi.Book.Inventory != null ? oi.Book.Inventory.StockCount : 0,
                    LibraryAvailable = oi.Book.LibraryAvailable,
                    AuthorName = oi.Book.AuthorName,
                    PublisherName = oi.Book.PublisherName,
                    GenreName = oi.Book.GenreName,
                    FormatName = oi.Book.FormatName,
                    Rating = oi.Book.Rating,
                    TotalSales = oi.Book.TotalSales
                },
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice
            }).ToList()
        };

        return CreatedAtAction(nameof(GetOrder), new { id = order.OrderId }, orderDTO);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Member")]
    public async Task<ActionResult<OrderDTO>> GetOrder(Guid id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return BadRequest(new { Message = "User ID not found in claims" });
        var userId = Guid.Parse(userIdClaim);

        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Book)
            .ThenInclude(b => b.Inventory)
            .FirstOrDefaultAsync(o => o.OrderId == id && o.UserId == userId);

        if (order == null) return NotFound(new { Message = "Order not found" });

        var orderDTO = new OrderDTO
        {
            OrderId = order.OrderId,
            UserId = order.UserId,
            OrderDate = order.OrderDate,
            Status = order.Status,
            ClaimCode = order.ClaimCode,
            DiscountAmount = order.DiscountAmount,
            TotalAmount = order.TotalAmount,
            OrderItems = order.OrderItems.Select(oi => new OrderItemDTO
            {
                OrderItemId = oi.OrderItemId,
                BookId = oi.BookId,
                Book = new BookDTO
                {
                    BookId = oi.Book.BookId,
                    ISBN = oi.Book.ISBN,
                    BookTitle = oi.Book.BookTitle,
                    BookDescription = oi.Book.BookDescription,
                    PublicationDate = oi.Book.PublicationDate,
                    BookLanguage = oi.Book.BookLanguage,
                    BookPrice = oi.Book.BookPrice,
                    StockCount = oi.Book.Inventory != null ? oi.Book.Inventory.StockCount : 0,
                    LibraryAvailable = oi.Book.LibraryAvailable,
                    AuthorName = oi.Book.AuthorName,
                    PublisherName = oi.Book.PublisherName,
                    GenreName = oi.Book.GenreName,
                    FormatName = oi.Book.FormatName,
                    Rating = oi.Book.Rating,
                    TotalSales = oi.Book.TotalSales
                },
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice
            }).ToList()
        };

        return Ok(orderDTO);
    }

    [HttpGet]
    [Authorize(Roles = "Member")]
    public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrders()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return BadRequest(new { Message = "User ID not found in claims" });
        var userId = Guid.Parse(userIdClaim);

        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Book)
            .ThenInclude(b => b.Inventory)
            .Select(o => new OrderDTO
            {
                OrderId = o.OrderId,
                UserId = o.UserId,
                OrderDate = o.OrderDate,
                Status = o.Status,
                ClaimCode = o.ClaimCode,
                DiscountAmount = o.DiscountAmount,
                TotalAmount = o.TotalAmount,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDTO
                {
                    OrderItemId = oi.OrderItemId,
                    BookId = oi.BookId,
                    Book = new BookDTO
                    {
                        BookId = oi.Book.BookId,
                        ISBN = oi.Book.ISBN,
                        BookTitle = oi.Book.BookTitle,
                        BookDescription = oi.Book.BookDescription,
                        PublicationDate = oi.Book.PublicationDate,
                        BookLanguage = oi.Book.BookLanguage,
                        BookPrice = oi.Book.BookPrice,
                        StockCount = oi.Book.Inventory != null ? oi.Book.Inventory.StockCount : 0,
                        LibraryAvailable = oi.Book.LibraryAvailable,
                        AuthorName = oi.Book.AuthorName,
                        PublisherName = oi.Book.PublisherName,
                        GenreName = oi.Book.GenreName,
                        FormatName = oi.Book.FormatName,
                        Rating = oi.Book.Rating,
                        TotalSales = oi.Book.TotalSales,
                        ImageUrl = oi.Book.ImageUrl
                    },
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpPut("{id}/cancel")]
    [Authorize(Roles = "Member")]
    public async Task<IActionResult> CancelOrder(Guid id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return BadRequest(new { Message = "User ID not found in claims" });
        var userId = Guid.Parse(userIdClaim);

        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Book)
            .ThenInclude(b => b.Inventory)
            .FirstOrDefaultAsync(o => o.OrderId == id && o.UserId == userId);

        if (order == null) return NotFound(new { Message = "Order not found" });
        if (order.Status != "Pending") return BadRequest(new { Message = "Only pending orders can be cancelled" });

        order.Status = "Cancelled";
        order.UpdatedAt = DateTime.UtcNow;
        order.ClaimCode = Guid.NewGuid().ToString();
        foreach (var item in order.OrderItems)
        {
            if (item.Book.Inventory != null)
            {
                item.Book.Inventory.StockCount += item.Quantity;
            }
            item.Book.TotalSales -= item.Quantity;
            item.Book.UpdatedAt = DateTime.UtcNow;
            if (item.Book.Inventory != null)
            {
                item.Book.Inventory.LastUpdated = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id}/fulfill")]
    [AllowAnonymous]
    public async Task<IActionResult> FulfillOrder(Guid id)
    {
        var staffIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(staffIdClaim)) return BadRequest(new { Message = "Staff ID not found in claims" });
        var staffId = Guid.Parse(staffIdClaim);
        
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Book)
            .FirstOrDefaultAsync(o => o.OrderId == id);

        if (order == null)
            return NotFound(new { Message = "Order not found" });

        if (order.Status != "Pending")
            return BadRequest(new { Message = "Only pending orders can be fulfilled" });

        order.Status = "Fulfilled";
        order.UpdatedAt = DateTime.UtcNow;
        
        order.User.OrderCount += 1;
        
        if (order.User.OrderCount > 10 ) 
        {
            order.User.OrderCount = 1;
        }

        var orderAction = new OrderAction
            {
                Id = Guid.NewGuid(),
                OrderId = order.OrderId,
                StaffId = staffId,
                ActionType = "Fulfilled",
                ActionDate = DateTime.UtcNow
            };
            _context.OrderActions.Add(orderAction);


        // Create and save notification
        var notification = new Notification
        {
            UserId = order.UserId,
            Message = $"Your order #{order.OrderId} has been fulfilled.",
            CreatedAt = order.UpdatedAt
        };
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();


        // Send real-time notification
        var group = $"user-{order.UserId}";
        await _hubContext.Clients.Group(group).SendAsync("OrderFulfilled", new
        {
            OrderId = order.OrderId,
            Message = notification.Message,
            FulfilledAt = notification.CreatedAt
        });

        await _hubContext.Clients.Group("admin").SendAsync("OrderFulfilled", new
        {
            OrderId = order.OrderId,
            Message = notification.Message,
            FulfilledAt = notification.CreatedAt
        });
            return Ok(new { Message = "Order fulfilled successfully" });
        }


    [HttpPut("staff/{id}/cancel")]
    [AllowAnonymous]
    public async Task<IActionResult> CancelOrderAsStaff(Guid id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return BadRequest(new { Message = "User ID not found in claims" });
        var staffId = Guid.Parse(userIdClaim);

        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Book)
            .ThenInclude(b => b.Inventory)
            .FirstOrDefaultAsync(o => o.OrderId == id);

        if (order == null) return NotFound(new { Message = "Order not found" });
        if (order.Status != "Pending") return BadRequest(new { Message = "Only pending orders can be cancelled" });

        order.Status = "Cancelled";
        order.UpdatedAt = DateTime.UtcNow;
        
        foreach (var item in order.OrderItems)
        {
            if (item.Book.Inventory != null)
            {
                item.Book.Inventory.StockCount += item.Quantity;
            }
            item.Book.TotalSales -= item.Quantity;
            item.Book.UpdatedAt = DateTime.UtcNow;
            if (item.Book.Inventory != null)
            {
                item.Book.Inventory.LastUpdated = DateTime.UtcNow;
            }
        }

        var orderAction = new OrderAction
        {
            Id = Guid.NewGuid(),
            OrderId = order.OrderId,
            StaffId = staffId,
            ActionType = "Cancelled",
            ActionDate = DateTime.UtcNow
        };
        _context.OrderActions.Add(orderAction); 

        // Create a notification for the user
        var notification = new Notification
        {
            UserId = order.UserId,
            Message = $"Your order #{order.OrderId} has been cancelled by staff.",
            CreatedAt = order.UpdatedAt
        };
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        // Notify the user via SignalR
        var group = $"user-{order.UserId}";
        await _hubContext.Clients.Group(group).SendAsync("OrderCancelled", new
        {
            OrderId = order.OrderId,
            Message = notification.Message,
            CancelledAt = notification.CreatedAt
        });

        await _hubContext.Clients.Group("admin").SendAsync("OrderCancelled", new
        {
            OrderId = order.OrderId,
            Message = notification.Message,
            CancelledAt = notification.CreatedAt
        });

        return NoContent();
    }

    [HttpGet("staff/history")]
    [Authorize(Roles = "Staff")]
    public async Task<ActionResult<List<OrderDTO>>> GetStaffOrderHistory()
    {
        var staffIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(staffIdClaim)) return BadRequest(new { Message = "Staff ID not found in claims" });
        var staffId = Guid.Parse(staffIdClaim);

        var orderActions = await _context.OrderActions
            .Where(oa => oa.StaffId == staffId)
            .Include(oa => oa.Order)
            .ThenInclude(o => o.OrderItems)
            .ThenInclude(oi => oi.Book)
            .Include(oa => oa.Order)
            .ThenInclude(o => o.User)
            .ToListAsync();

        var orderDTOs = orderActions.Select(oa => new OrderDTO
        {
            OrderId = oa.Order.OrderId,
            UserId = oa.Order.UserId,
            OrderDate = oa.Order.OrderDate,
            Status = oa.ActionType, // Use the action type as the status
            ClaimCode = oa.Order.ClaimCode,
            DiscountAmount = oa.Order.DiscountAmount,
            TotalAmount = oa.Order.TotalAmount,
            User = new UserDTO
            {
                UserName = oa.Order.User.UserName,
                UserEmail = oa.Order.User.UserEmail
            },
            OrderItems = oa.Order.OrderItems.Select(oi => new OrderItemDTO
            {
                OrderItemId = oi.OrderItemId,
                BookId = oi.BookId,
                Book = new BookDTO
                {
                    BookId = oi.Book.BookId,
                    ISBN = oi.Book.ISBN,
                    BookTitle = oi.Book.BookTitle,
                    BookDescription = oi.Book.BookDescription,
                    PublicationDate = oi.Book.PublicationDate,
                    BookLanguage = oi.Book.BookLanguage,
                    BookPrice = oi.Book.BookPrice,
                    StockCount = oi.Book.Inventory != null ? oi.Book.Inventory.StockCount : 0,
                    LibraryAvailable = oi.Book.LibraryAvailable,
                    AuthorName = oi.Book.AuthorName,
                    PublisherName = oi.Book.PublisherName,
                    GenreName = oi.Book.GenreName,
                    FormatName = oi.Book.FormatName,
                    Rating = oi.Book.Rating,
                    TotalSales = oi.Book.TotalSales
                },
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice
            }).ToList()
        }).ToList();

        return Ok(orderDTOs);
    }


    [HttpGet("notifications")]
    [AllowAnonymous]
    public async Task<IActionResult> GetUserNotifications()
    {
        var userIdClaim = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value
                        ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            Console.WriteLine("User ID claim not found in token");
            return Unauthorized(new { Message = "User ID claim not found in token" });
        }

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            Console.WriteLine($"Invalid user ID in token: {userIdClaim}");
            return Unauthorized(new { Message = "Invalid user ID in token" });
        }

        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new
            {
                n.Id,
                n.Message,
                n.IsRead,
                n.CreatedAt
            })
            .ToListAsync();

        return Ok(notifications);
    }


    [HttpPut("notification/{id}/read")]
    [AllowAnonymous]
    public async Task<IActionResult> MarkNotificationAsRead(int id)
    {
        Console.WriteLine($"Processing request for notification ID: {id}");
        var userIdClaim = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value
                        ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Console.WriteLine($"User claims: {string.Join(", ", User.Claims.Select(c => $"{c.Type}: {c.Value}"))}");
        if (string.IsNullOrEmpty(userIdClaim))
        {
            Console.WriteLine("User ID claim not found in token");
            return Unauthorized(new { Message = "User ID claim not found in token" });
        }

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            Console.WriteLine($"Invalid user ID in token: {userIdClaim}");
            return Unauthorized(new { Message = "Invalid user ID in token" });
        }

        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
        if (notification == null) return NotFound(new { Message = "Notification not found" });

        notification.IsRead = true;
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Notification marked as read" });
    }


    [HttpGet("claim/{claimCode}")]
    [AllowAnonymous]
    public async Task<ActionResult<OrderDTO>> GetOrderByClaimCode(string claimCode)
    {
        Console.WriteLine("User Claims:");
        foreach (var claim in User.Claims)
        {
            Console.WriteLine($"Claim Type: {claim.Type}, Value: {claim.Value}");
        }
        Console.WriteLine($"Has Staff Role: {User.IsInRole("Staff")}");

        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Book)
            .ThenInclude(b => b.Inventory)
            .FirstOrDefaultAsync(o => o.ClaimCode == claimCode);

        if (order == null) return NotFound(new { Message = "Invalid claim code" });

        var orderDTO = new OrderDTO
        {
            OrderId = order.OrderId,
            UserId = order.UserId,
            OrderDate = order.OrderDate,
            Status = order.Status,
            ClaimCode = order.ClaimCode,
            DiscountAmount = order.DiscountAmount,
            TotalAmount = order.TotalAmount,
            OrderItems = order.OrderItems.Select(oi => new OrderItemDTO
            {
                OrderItemId = oi.OrderItemId,
                BookId = oi.BookId,
                Book = new BookDTO
                {
                    BookId = oi.Book.BookId,
                    ISBN = oi.Book.ISBN,
                    BookTitle = oi.Book.BookTitle,
                    BookDescription = oi.Book.BookDescription,
                    PublicationDate = oi.Book.PublicationDate,
                    BookLanguage = oi.Book.BookLanguage,
                    BookPrice = oi.Book.BookPrice,
                    StockCount = oi.Book.Inventory != null ? oi.Book.Inventory.StockCount : 0,
                    LibraryAvailable = oi.Book.LibraryAvailable,
                    AuthorName = oi.Book.AuthorName,
                    PublisherName = oi.Book.PublisherName,
                    GenreName = oi.Book.GenreName,
                    FormatName = oi.Book.FormatName,
                    Rating = oi.Book.Rating,
                    TotalSales = oi.Book.TotalSales
                },
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice
            }).ToList(),
            User = order.User != null ? new UserDTO
            {
                UserId = order.User.Id,
                UserName = order.User.UserName,
                UserEmail = order.User.UserEmail
            } : null
        };

        return Ok(orderDTO);
    }
}