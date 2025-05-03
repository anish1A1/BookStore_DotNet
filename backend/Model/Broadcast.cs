using System;

namespace backend.Model;

public class Broadcast
{
    public Guid BroadcastId { get; set; }
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
