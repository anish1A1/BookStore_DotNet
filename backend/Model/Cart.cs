using System;

namespace backend.Model;

public class Cart
{
    public Guid CartId { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<CartItem> CartItems { get; set; } = new List<CartItem>();
}