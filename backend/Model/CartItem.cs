using System;

namespace backend.Model;

public class CartItem
{
    public Guid CartItemId { get; set; }
    public Guid CartId { get; set; }
    public Cart Cart { get; set; } = null!;
    public Guid BookId { get; set; }
    public Book Book { get; set; } = null!;
    public int Quantity { get; set; } = 1;
    public decimal UnitPrice { get; set; }
}