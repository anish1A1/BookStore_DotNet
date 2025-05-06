using System;

namespace backend.DTOs.Response;

public class DiscountResponseDTO
{
    public Guid DiscountId {get; set;}
    public Guid? BookId { get; set; }
    public decimal Percentage { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsOnSale { get; set; }
}
