using System;

namespace backend.DTOs.Response;

public class OrderItemDTO
{
    public Guid OrderItemId { get; set; }
    public Guid BookId { get; set; }
    public BookDTO Book { get; set; } = null!;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}
