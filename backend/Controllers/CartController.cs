using System.Security.Claims;
using backend.Data;
using backend.DTOs.Response;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("/cart")]
[ApiController]
[Authorize(Roles = "Member")]
public class CartController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CartController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CartItemDTO>>> GetCart()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized(new { Message = "User ID not found in claims" });
        var userId = Guid.Parse(userIdClaim);
    
        var cart = await _context.Carts
            .Where(c => c.UserId == userId)
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Book)
            .ThenInclude(b => b.Inventory)
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Book)
            .ThenInclude(b => b.Discounts)
            .SelectMany(c => c.CartItems)
            .Select(ci => new CartItemDTO
            {
                CartItemId = ci.CartItemId,
                BookId = ci.BookId,
                Book = new BookDTO
                {
                    BookId = ci.Book.BookId,
                    ISBN = ci.Book.ISBN,
                    BookTitle = ci.Book.BookTitle,
                    BookDescription = ci.Book.BookDescription,
                    PublicationDate = ci.Book.PublicationDate,
                    BookLanguage = ci.Book.BookLanguage,
                    BookPrice = ci.Book.BookPrice,
                    StockCount = ci.Book.Inventory != null ? ci.Book.Inventory.StockCount : 0,
                    LibraryAvailable = ci.Book.LibraryAvailable,
                    AuthorName = ci.Book.AuthorName,
                    PublisherName = ci.Book.PublisherName,
                    GenreName = ci.Book.GenreName,
                    FormatName = ci.Book.FormatName,
                    Rating = ci.Book.Rating,
                    TotalSales = ci.Book.TotalSales,
                    ImageUrl = ci.Book.ImageUrl ?? "",
                    DiscountedPrice = ci.Book.Discounts.Count != 0 
                        ? ci.Book.BookPrice * (1 - ci.Book.Discounts.OrderByDescending(d => d.StartDate).First().Percentage / 100) 
                        : ci.Book.BookPrice,
                    DiscountPercentage = ci.Book.Discounts.Count != 0 
                        ? ci.Book.Discounts.OrderByDescending(d => d.StartDate).First().Percentage 
                        : 0,
                    IsOnSale = ci.Book.IsOnSale
                },
                Quantity = ci.Quantity,
                UnitPrice = ci.UnitPrice
            })
            .ToListAsync();

        return Ok(cart);
    }


    [HttpGet("whole-data")]
    public async Task<ActionResult<CartDTO>> GetCartsWholeData()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized(new { Message = "User ID not found in claims" });

        var userId = Guid.Parse(userIdClaim);

        // Getting OrderCount directly from the Users table
        var orderCount = await _context.Users
            .Where(u => u.Id == userId)
            .Select(u => u.OrderCount)
            .FirstOrDefaultAsync();

        var cart = await _context.Carts
            .Where(c => c.UserId == userId)
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Book)
                .ThenInclude(b => b.Inventory)
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Book)
                .ThenInclude(b => b.Discounts)
            .Select(c => new CartDTO
            {
                CartId = c.CartId,
                UserId = c.UserId,
                CreatedAt = c.CreatedAt,
                OrderCount = orderCount, //  Attached OrderCount to the response
                CartItems = c.CartItems.Select(ci => new CartItemDTO
                {
                    CartItemId = ci.CartItemId,
                    BookId = ci.BookId,
                    Quantity = ci.Quantity,
                    UnitPrice = ci.UnitPrice,
                    Book = new BookDTO
                    {
                        BookId = ci.Book.BookId,
                        ISBN = ci.Book.ISBN,
                        BookTitle = ci.Book.BookTitle,
                        BookDescription = ci.Book.BookDescription,
                        PublicationDate = ci.Book.PublicationDate,
                        BookLanguage = ci.Book.BookLanguage,
                        BookPrice = ci.Book.BookPrice,
                        StockCount = ci.Book.Inventory != null ? ci.Book.Inventory.StockCount : 0,
                        LibraryAvailable = ci.Book.LibraryAvailable,
                        AuthorName = ci.Book.AuthorName,
                        PublisherName = ci.Book.PublisherName,
                        GenreName = ci.Book.GenreName,
                        FormatName = ci.Book.FormatName,
                        Rating = ci.Book.Rating,
                        TotalSales = ci.Book.TotalSales,
                        ImageUrl = ci.Book.ImageUrl ?? "",
                        DiscountedPrice = ci.Book.Discounts.Count != 0 
                        ? ci.Book.BookPrice * (1 - ci.Book.Discounts.OrderByDescending(d => d.StartDate).First().Percentage / 100) 
                        : ci.Book.BookPrice,
                    DiscountPercentage = ci.Book.Discounts.Count != 0 
                        ? ci.Book.Discounts.OrderByDescending(d => d.StartDate).First().Percentage 
                        : 0,
                    IsOnSale = ci.Book.IsOnSale
                    }
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (cart == null) return NotFound(new { Message = "Cart not found" });

        return Ok(cart);
    }

    [HttpPost("{bookId}")]

    public async Task<IActionResult> AddToCart(Guid bookId, [FromBody] AddToCartRequest request)
    {
        if (request.Quantity <= 0) return BadRequest(new { Message = "Quantity must be greater than 0" });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return BadRequest(new { Message = "User ID not found in claims" });
        var userId = Guid.Parse(userIdClaim);

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var book = await _context.Books
                .Include(b => b.Inventory)
                .FirstOrDefaultAsync(b => b.BookId == bookId);
            if (book == null) return NotFound(new { Message = "Book not found" });

            if (book.Inventory == null || book.Inventory.StockCount < request.Quantity)
                return BadRequest(new { Message = "Not enough stock available" });

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Book)
                .ThenInclude(b => b.Inventory)
                .FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null)
            {
                cart = new Cart { CartId = Guid.NewGuid(), UserId = userId, CreatedAt = DateTime.UtcNow };
                _context.Carts.Add(cart);
            }

            var existingCartItem = cart.CartItems.FirstOrDefault(ci => ci.BookId == bookId);
            if (existingCartItem != null)
            {
                existingCartItem.Quantity += request.Quantity;
                if (existingCartItem.Quantity > book.Inventory.StockCount)
                    return BadRequest(new { Message = "Not enough stock available" });
            }
            else
            {
                var cartItem = new CartItem
                {
                    CartItemId = Guid.NewGuid(),
                    CartId = cart.CartId,
                    BookId = bookId,
                    Book = book,
                    Quantity = request.Quantity,
                    UnitPrice = book.BookPrice
                };
                cart.CartItems.Add(cartItem);
                _context.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return Ok(new { Message = "Book added to cart" });
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public class AddToCartRequest
    {
        public int Quantity { get; set; }
    }

    [HttpPut("{bookId}")]
    public async Task<IActionResult> UpdateCartItem(Guid bookId, [FromBody] UpdateCartItemRequest request)
    {
        Console.WriteLine($"Received PUT request for bookId: {bookId}, quantity: {request.Quantity}");

        if (request.Quantity <= 0)
        {
            Console.WriteLine("Validation failed: Quantity must be greater than 0");
            return BadRequest(new { Message = "Quantity must be greater than 0" });
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            Console.WriteLine("Validation failed: User ID not found in claims");
            return BadRequest(new { Message = "User ID not found in claims" });
        }
        var userId = Guid.Parse(userIdClaim);
        Console.WriteLine($"User ID: {userId}");

        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Book)
            .ThenInclude(b => b.Inventory)
            .FirstOrDefaultAsync(c => c.UserId == userId);
        if (cart == null)
        {
            Console.WriteLine("Cart not found for user");
            return NotFound(new { Message = "Cart not found" });
        }

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.BookId == bookId);
        if (cartItem == null)
        {
            Console.WriteLine($"Cart item not found for bookId: {bookId}");
            return NotFound(new { Message = "Book not found in your cart" });
        }

        Console.WriteLine($"Current stock count: {cartItem.Book.Inventory?.StockCount ?? 0}");
        if (cartItem.Book.Inventory == null || cartItem.Book.Inventory.StockCount < request.Quantity)
        {
            Console.WriteLine("Validation failed: Not enough stock available");
            return BadRequest(new { Message = "Not enough stock available" });
        }

        cartItem.Quantity = request.Quantity;
        try
        {
            await _context.SaveChangesAsync();
            Console.WriteLine("Quantity updated successfully");
        }
        catch (DbUpdateException ex)
        {
            Console.WriteLine($"DbUpdateException: {ex.InnerException?.Message ?? ex.Message}");
            return StatusCode(500, new { Message = "Failed to update quantity due to a database error" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception: {ex.Message}");
            return StatusCode(500, new { Message = "Failed to update quantity due to an unexpected error" });
        }

        return Ok(new { Message = "Cart updated" });
    }

    public class UpdateCartItemRequest
    {
        public int Quantity { get; set; }
    }

    [HttpDelete("{bookId}")]
    public async Task<IActionResult> RemoveFromCart(Guid bookId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return BadRequest(new { Message = "User ID not found in claims" });
        var userId = Guid.Parse(userIdClaim);

        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);
        if (cart == null) return NotFound(new { Message = "Cart not found" });

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.BookId == bookId);
        if (cartItem == null) return NotFound(new { Message = "Book not found in your cart" });

        cart.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Book removed from cart" });
    }
}