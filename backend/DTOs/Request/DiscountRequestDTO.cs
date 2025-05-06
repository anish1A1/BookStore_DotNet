using System;

namespace backend.DTOs.Request;

public class DiscountRequestDTO
{
    public Guid? BookId { get; set; }
    public decimal Percentage { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsOnSale { get; set; }
}
