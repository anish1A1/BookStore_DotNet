using System;

namespace backend.DTOs.Request;

public class CreateReviewDTO
{
    public Guid BookId { get; set; }
    public Guid OrderId { get; set; }
    public decimal Rating { get; set; }
    public string? Comment { get; set; }
}
