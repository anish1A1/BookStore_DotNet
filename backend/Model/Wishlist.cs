using System;

namespace backend.Model;

public class Wishlist
{
    public Guid WishlistId { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid BookId { get; set; }
    public Book Book { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}
