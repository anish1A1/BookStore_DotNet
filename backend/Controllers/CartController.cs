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
                    TotalSales = ci.Book.TotalSales
                },
                Quantity = ci.Quantity,
                UnitPrice = ci.UnitPrice
            })
            .ToListAsync();

        return Ok(cart);
    }

    [HttpPost("{bookId}")]
    public async Task<IActionResult> AddToCart(Guid bookId, [FromQuery] int quantity = 1)
    {
        if (quantity <= 0) return BadRequest(new { Message = "Quantity must be greater than 0" });

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

            if (book.Inventory == null || book.Inventory.StockCount < quantity)
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
                existingCartItem.Quantity += quantity;
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
                    Quantity = quantity,
                    UnitPrice = book.BookPrice
                };
                cart.CartItems.Add(cartItem);
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

    [HttpPut("{bookId}")]
    public async Task<IActionResult> UpdateCartItem(Guid bookId, [FromQuery] int quantity)
    {
        if (quantity <= 0) return BadRequest(new { Message = "Quantity must be greater than 0" });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return BadRequest(new { Message = "User ID not found in claims" });
        var userId = Guid.Parse(userIdClaim);

        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Book)
            .ThenInclude(b => b.Inventory)
            .FirstOrDefaultAsync(c => c.UserId == userId);
        if (cart == null) return NotFound(new { Message = "Cart not found" });

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.BookId == bookId);
        if (cartItem == null) return NotFound(new { Message = "Book not found in your cart" });

        if (cartItem.Book.Inventory == null || cartItem.Book.Inventory.StockCount < quantity)
            return BadRequest(new { Message = "Not enough stock available" });

        cartItem.Quantity = quantity;
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Cart updated" });
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