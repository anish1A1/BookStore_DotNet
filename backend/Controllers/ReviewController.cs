using System.Security.Claims;
using backend.Data;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("review")]
[ApiController]
[Authorize(Roles = "Member")]
public class ReviewController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReviewController(ApplicationDbContext context)
    {
        _context = context;
    }

    [AllowAnonymous]
    [HttpGet("book/{bookId}")]
    public async Task<ActionResult<IEnumerable<ReviewDTO>>> GetReviewsForBook(Guid bookId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.BookId == bookId)
            .Include(r => r.User)
            .Select(r => new ReviewDTO
            {
                ReviewId = r.ReviewId,
                UserId = r.UserId,
                BookId = r.BookId,
                OrderId = r.OrderId,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt,
                UserName = r.User.UserName
            })
            .ToListAsync();

        return Ok(reviews);
    }


    [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<ReviewDTO>>> GetMyReviews()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return BadRequest(new { Message = "User ID not found in claims" });

            var userId = Guid.Parse(userIdClaim);

            var reviews = await _context.Reviews
                .Where(r => r.UserId == userId)
                .Select(r => new ReviewDTO
                {
                    ReviewId = r.ReviewId,
                    UserId = r.UserId,
                    BookId = r.BookId,
                    OrderId = r.OrderId,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(reviews);
        }


    [HttpPost]
    public async Task<ActionResult<ReviewDTO>> CreateReview(CreateReviewDTO createReviewDTO)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return BadRequest(new { Message = "User ID not found in claims" });
        var userId = Guid.Parse(userIdClaim);

        if (createReviewDTO.Rating < 0 || createReviewDTO.Rating > 5)
            return BadRequest(new { Message = "Rating must be between 0 and 5" });

        var book = await _context.Books.FindAsync(createReviewDTO.BookId);
        if (book == null) return NotFound(new { Message = "Book not found" });

        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.OrderId == createReviewDTO.OrderId && o.UserId == userId);
        if (order == null) return NotFound(new { Message = "Order not found" });

        if (!order.OrderItems.Any(oi => oi.BookId == createReviewDTO.BookId))
            return BadRequest(new { Message = "Book not purchased in this order" });

        var existingReview = await _context.Reviews
            .FirstOrDefaultAsync(r => r.UserId == userId && r.BookId == createReviewDTO.BookId && r.OrderId == createReviewDTO.OrderId);
        if (existingReview != null)
            return BadRequest(new { Message = "You have already reviewed this book for this order" });

        var review = new Review
        {
            ReviewId = Guid.NewGuid(),
            UserId = userId,
            BookId = createReviewDTO.BookId,
            OrderId = createReviewDTO.OrderId,
            Rating = createReviewDTO.Rating,
            Comment = createReviewDTO.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reviews.Add(review);

        var bookReviews = await _context.Reviews
            .Where(r => r.BookId == createReviewDTO.BookId)
            .ToListAsync();
        book.Rating = bookReviews.Any() ? bookReviews.Average(r => r.Rating) : null;
        book.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var reviewDTO = new ReviewDTO
        {
            ReviewId = review.ReviewId,
            UserId = review.UserId,
            BookId = review.BookId,
            OrderId = review.OrderId,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };

        return CreatedAtAction(nameof(GetReviewsForBook), new { bookId = review.BookId }, reviewDTO);
    }
}