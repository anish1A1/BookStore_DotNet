using backend.Data;
using backend.DTOs.Request;
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
    [Authorize(Roles = "Admin")]
    [HttpPost("create")]
    public async Task<ActionResult<Discount>> CreateDiscount([FromBody] DiscountRequestDTO discountDTO) {
        var book = await _context.Books.FirstOrDefaultAsync(b => b.BookId == discountDTO.BookId); 

        if (book == null && discountDTO.BookId != null)
    {
        return NotFound(new { Message = "Book not found for discount." });
    }

    var discount = new Discount
    {
        DiscountId = Guid.NewGuid(),
        BookId = discountDTO.BookId,
        Percentage = discountDTO.Percentage,
        StartDate = discountDTO.StartDate,
        EndDate = discountDTO.EndDate,
        IsOnSale = discountDTO.IsOnSale
    };
    _context.Discounts.Add(discount);
    await _context.SaveChangesAsync();

    if (book != null)
    {
        book.CurrentDiscount = discount;
        book.IsOnSale = discount.EndDate > DateTime.UtcNow;  //When the discount ends, the book is no longer on sale
        _context.Books.Update(book);
        await _context.SaveChangesAsync();
    }
    return CreatedAtAction(nameof(CreateDiscount), new {id = discount.DiscountId}, discount);

    }

    public async Task RemoveExpiredDiscounts()
{
    var expiredDiscounts = await _context.Discounts
        .Where(d => d.EndDate < DateTime.UtcNow)
        .ToListAsync();

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
}
    }
}
