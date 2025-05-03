using System;
using System.ComponentModel.DataAnnotations;
namespace backend.Model;

public class User
{
        [Key]
        public Guid Id { get; set; }

        [Required]
        [StringLength(50)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string UserEmail { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public string? MembershipId { get; set; }

        [Required]
        public string Role { get; set; } = "Member"; // Default role is Member. First regsitration is admin(I assumed only one admin. Need to ask kushal sir)
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public List<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
        public List<Cart> Carts { get; set; } = new List<Cart>();
        public List<Order> Orders { get; set; } = new List<Order>();
        public List<Review> Reviews { get; set; } = new List<Review>();

}
