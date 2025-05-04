using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<Inventory> Inventories { get; set; }
    public DbSet<Wishlist> Wishlists { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Broadcast> Broadcasts { get; set; }
    public DbSet<Announcement> Announcements { get; set; }
    
    public DbSet<Discount> Discounts { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Wishlist>()
            .HasKey(w => new { w.UserId, w.BookId });

        modelBuilder.Entity<Wishlist>()
            .HasOne(w => w.User)
            .WithMany(u => u.Wishlists)
            .HasForeignKey(w => w.UserId);

        modelBuilder.Entity<Wishlist>()
            .HasOne(w => w.Book)
            .WithMany(b => b.Wishlists)
            .HasForeignKey(w => w.BookId);

        modelBuilder.Entity<Cart>()
            .HasOne(c => c.User)
            .WithMany(u => u.Carts)
            .HasForeignKey(c => c.UserId);

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Cart)
            .WithMany(c => c.CartItems)
            .HasForeignKey(ci => ci.CartId);

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Book)
            .WithMany(b => b.CartItems)
            .HasForeignKey(ci => ci.BookId);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.OrderItems)
            .HasForeignKey(oi => oi.OrderId);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Book)
            .WithMany(b => b.OrderItems)
            .HasForeignKey(oi => oi.BookId);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Book)
            .WithMany(b => b.Reviews)
            .HasForeignKey(r => r.BookId);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Order)
            .WithMany(o => o.Reviews)
            .HasForeignKey(r => r.OrderId);

        modelBuilder.Entity<Broadcast>()
            .HasOne(b => b.Order)
            .WithMany(o => o.Broadcasts)
            .HasForeignKey(b => b.OrderId);

        modelBuilder.Entity<Inventory>()
            .HasOne(i => i.Book)
            .WithOne(b => b.Inventory)
            .HasForeignKey<Inventory>(i => i.BookId);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.UserEmail)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.UserName)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.MembershipId)
            .IsUnique();

        modelBuilder.Entity<Book>()
            .HasIndex(b => b.ISBN)
            .IsUnique();

        modelBuilder.Entity<Review>()
            .Property(r => r.Rating)
            .HasPrecision(3, 1);

            modelBuilder.Entity<Discount>()
            .HasOne(d => d.Book)
            .WithMany(b => b.Discounts)
            .HasForeignKey(d=> d.BookId)
            .OnDelete(DeleteBehavior.Cascade);   // Automatically remove discounts when book is deleted

    }
}
