using System.Security.Claims;
using backend.Data;
using backend.DTOs.Response;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("order")]
[ApiController]
[Authorize(Roles = "Member")]
public class OrderController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OrderController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<OrderDTO>> PlaceOrder()
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
            // - Finds the first cart associated with the given UserId.

        if (cart == null || !cart.CartItems.Any())
            return BadRequest(new { Message = "Cart is empty" });

        foreach (var item in cart.CartItems)
        {
            if (item.Book.Inventory == null || item.Book.Inventory.StockCount < item.Quantity)
                return BadRequest(new { Message = $"Not enough stock for book: {item.Book.BookTitle}" });
        }

        var order = new Order
        {
            OrderId = Guid.NewGuid(),
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            Status = "Pending",
            ClaimCode = Guid.NewGuid().ToString().Substring(0, 8),
            TotalAmount = cart.CartItems.Sum(ci => ci.Quantity * ci.UnitPrice),
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

        _context.Carts.Remove(cart);
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

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
                        TotalSales = oi.Book.TotalSales
                    },
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpPut("{id}/cancel")]
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
}