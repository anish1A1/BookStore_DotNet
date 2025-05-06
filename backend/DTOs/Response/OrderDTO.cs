using System;

namespace backend.DTOs.Response;

public class OrderDTO
{
    public Guid OrderId { get; set; }
    public Guid UserId { get; set; }
    public DateTime OrderDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string ClaimCode { get; set; } = string.Empty;
    public decimal DiscountAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public List<OrderItemDTO> OrderItems { get; set; } = new List<OrderItemDTO>();
    public UserDTO? User { get; set; }
}
