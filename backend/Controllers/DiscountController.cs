using backend.Data;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("discount")]
    [ApiController]
    public class DiscountController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

    public DiscountController(ApplicationDbContext context)
    {
        _context = context;
    }
    [HttpPost("create")]
    public async Task<IActionResult> CreateDiscount([FromBody] DiscountRequestDTO discountDTO)
    {
        if (discountDTO.Percentage <= 0 || discountDTO.Percentage > 100)
            return BadRequest(new { Message = "Discount percentage must be between 1 and 100." });

        if (discountDTO.StartDate >= discountDTO.EndDate)
            return BadRequest(new { Message = "End date must be after start date." });

        var book = await _context.Books.Include(b => b.Discounts)
            .FirstOrDefaultAsync(b => b.BookId == discountDTO.BookId);

        if (book == null && discountDTO.BookId != null)
            return NotFound(new { Message = "Book not found for discount." });

        var existingDiscount = book?.Discounts
            .FirstOrDefault(d => d.EndDate >= DateTime.UtcNow);

        if (existingDiscount != null)
            return BadRequest(new { Message = "An active discount already exists for this book." });

        var discount = new Discount
        {
            DiscountId = Guid.NewGuid(),
            BookId = discountDTO.BookId,
            Percentage = discountDTO.Percentage,
            StartDate = DateTime.SpecifyKind(discountDTO.StartDate, DateTimeKind.Utc),
            EndDate = DateTime.SpecifyKind(discountDTO.EndDate, DateTimeKind.Utc),
            IsOnSale = discountDTO.IsOnSale
        };

        _context.Discounts.Add(discount);
        await _context.SaveChangesAsync();

        if (book != null)
        {
            book.CurrentDiscount = discount;
            book.IsOnSale = discount.EndDate > DateTime.UtcNow;
            _context.Books.Update(book);
            await _context.SaveChangesAsync();
        }

        return CreatedAtAction(nameof(GetAllDiscounts), new { id = discount.DiscountId }, new DiscountResponseDTO
        {
            DiscountId = discount.DiscountId,
            BookId = discount.BookId,
            Percentage = discount.Percentage,
            StartDate = discount.StartDate,
            EndDate = discount.EndDate,
            IsOnSale = discount.IsOnSale
        });
    }


    [Authorize(Roles = "Admin")]
        [HttpGet("books/no-discounts")]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetAvailableBooks()
        {
            var books = await _context.Books
                .Where(b => !b.Discounts.Any(d => d.EndDate >= DateTime.UtcNow)) 
                .OrderBy(b => b.BookTitle)
                .Select(b => new BookDTO
                {
                    BookId = b.BookId,
                    BookTitle = b.BookTitle
                })
                .ToListAsync();

            return Ok(books);
        }

    [Authorize(Roles = "Admin")]
    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<DiscountResponseDTO>>> GetAllDiscounts()
    {
        var discounts = await _context.Discounts
            .Include(d => d.Book) 
            .OrderByDescending(d => d.StartDate)
            .Select(d => new DiscountResponseDTO
            {
                DiscountId = d.DiscountId,
                BookId = d.BookId,
                BookName = d.Book != null ? d.Book.BookTitle : "General Discount",
                Percentage = d.Percentage,
                StartDate = d.StartDate,
                EndDate = d.EndDate,
                IsOnSale = d.IsOnSale
            })
            .ToListAsync();

        return Ok(discounts);
    }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveDiscount(Guid id)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount == null)
            {
                return NotFound(new { Message = "Discount not found." });
            }

            var book = await _context.Books.FirstOrDefaultAsync(b => b.BookId == discount.BookId);
            if (book != null)
            {
                book.IsOnSale = false;
                book.CurrentDiscount = null;
                _context.Books.Update(book);
            }

            _context.Discounts.Remove(discount);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Discount removed successfully." });
        }

    public async Task RemoveExpiredDiscounts()
{
    var expiredDiscounts = await _context.Discounts
        .Where(d => d.EndDate < DateTime.UtcNow)
        .ToListAsync();

    if (!expiredDiscounts.Any()) return; 

    foreach (var discount in expiredDiscounts)
    {
        var book = await _context.Books.FirstOrDefaultAsync(b => b.BookId == discount.BookId);
        if (book != null)
        {
            book.IsOnSale = false;
            book.CurrentDiscount = null;
        }

        _context.Discounts.Remove(discount);
    }

    await _context.SaveChangesAsync();
     Console.WriteLine($"Removed {expiredDiscounts.Count} expired discounts.");
    }
    }
}
