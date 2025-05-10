using System;

namespace backend.DTOs.Response;

public class ReviewDTO
{
    public Guid ReviewId { get; set; }
    public Guid UserId { get; set; }
    public Guid BookId { get; set; }
    public Guid OrderId { get; set; }
    public decimal Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? UserName { get; set; }
}
