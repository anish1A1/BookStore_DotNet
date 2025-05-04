using System;

namespace backend.Model;

public class Order
{
    public Guid OrderId { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Pending";
    public string ClaimCode { get; set; } = string.Empty;
    public decimal DiscountAmount { get; set; } = 0;
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public bool IsClaimedByUser { get; set; } = false;
    public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public List<Review> Reviews { get; set; } = new List<Review>();
    public List<Broadcast> Broadcasts { get; set; } = new List<Broadcast>();
}
