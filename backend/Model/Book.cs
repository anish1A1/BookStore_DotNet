using System;

namespace backend.Model;

public class Book
{
    public Guid BookId { get; set; }
    public string ISBN { get; set; } = string.Empty;
    public string BookTitle { get; set; } = string.Empty;
    public string BookDescription { get; set; } = string.Empty;
    public DateTime PublicationDate { get; set; }
    public string BookLanguage { get; set; } = string.Empty;
    public decimal BookPrice { get; set; }
    public bool LibraryAvailable { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string PublisherName { get; set; } = string.Empty;
    public string GenreName { get; set; } = string.Empty;
    public string FormatName { get; set; } = string.Empty;
    public decimal? Rating { get; set; }
    public int TotalSales { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public bool IsExclusive { get; set; } = false;
    public bool IsAwardWinner { get; set; } = false;

    public Inventory? Inventory { get; set; }
    public List<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    public List<CartItem> CartItems { get; set; } = new List<CartItem>();    
    public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public List<Review> Reviews { get; set; } = new List<Review>();

    public List<Discount> Discounts { get; set; } = new List<Discount>();
}
