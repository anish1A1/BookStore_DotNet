using System.Security.Claims;
using backend.Data;
using backend.DTOs.Response;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("wishlist")]
[ApiController]
[Authorize(Roles = "Member")]
public class WishlistController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public WishlistController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: /wishlist
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookDTO>>> GetWishlist()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return BadRequest(new { Message = "User identifier is missing" });
        var userId = Guid.Parse(userIdClaim);

        var wishlist = await _context.Wishlists
            .Where(w => w.UserId == userId)
            .Include(w => w.Book)
            .ThenInclude(b => b.Inventory)
            .Select(w => new BookDTO
            {
                BookId = w.Book.BookId,
                ISBN = w.Book.ISBN,
                BookTitle = w.Book.BookTitle,
                BookDescription = w.Book.BookDescription,
                PublicationDate = w.Book.PublicationDate,
                BookLanguage = w.Book.BookLanguage,
                BookPrice = w.Book.BookPrice,
                StockCount = w.Book.Inventory != null ? w.Book.Inventory.StockCount : 0,
                LibraryAvailable = w.Book.LibraryAvailable,
                AuthorName = w.Book.AuthorName,
                PublisherName = w.Book.PublisherName,
                GenreName = w.Book.GenreName,
                FormatName = w.Book.FormatName,
                Rating = w.Book.Rating,
                TotalSales = w.Book.TotalSales,
                ImageUrl = w.Book.ImageUrl
            })
            .ToListAsync();

        return Ok(wishlist);
    }

    // POST: /wishlist/{bookId}
    [HttpPost("{bookId}")]
    public async Task<IActionResult> AddToWishlist(Guid bookId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return BadRequest(new { Message = "User identifier is missing" });
        var userId = Guid.Parse(userIdClaim);

        var book = await _context.Books.FindAsync(bookId);
        if (book == null) return NotFound(new { Message = "Book not found" });

        if (await _context.Wishlists.AnyAsync(w => w.UserId == userId && w.BookId == bookId))
            return BadRequest(new { Message = "Book is already in your wishlist" });

        var wishlistItem = new Wishlist { UserId = userId, BookId = bookId, CreatedAt = DateTime.UtcNow };
        _context.Wishlists.Add(wishlistItem);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Book added to wishlist" });
    }


    // DELETE: /wishlist/{bookId}
    [HttpDelete("{bookId}")]
    public async Task<IActionResult> RemoveFromWishlist(Guid bookId)
    {
{
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return BadRequest(new { Message = "User identifier is missing" });
        var userId = Guid.Parse(userIdClaim);

        var wishlistItem = await _context.Wishlists
            .FirstOrDefaultAsync(w => w.UserId == userId && w.BookId == bookId);
        if (wishlistItem == null) return NotFound(new { Message = "Book not found in your wishlist" });

        _context.Wishlists.Remove(wishlistItem);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Book removed from wishlist" });
    }
    }
}
