using System;

namespace backend.Model;

public class Inventory
{
    public Guid Id { get; set; }
    public Guid BookId { get; set; }
    public Book Book { get; set; } = null!;
    public int StockCount { get; set; }
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}
