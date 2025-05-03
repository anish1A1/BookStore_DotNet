using System;

namespace backend.DTOs.Response;

public class CartDTO
{
    public Guid CartId { get; set; }
    public Guid UserId { get; set; }
    public List<CartItemDTO> CartItems { get; set; } = new List<CartItemDTO>();
    public DateTime CreatedAt { get; set; }
}
