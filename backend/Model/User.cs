using System;
using System.ComponentModel.DataAnnotations;
namespace backend.Model;

public class User
{
        [Key]
        public Guid Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "Member"; // Default role is Member. First regsitration is admin(I assumed only one admin. Need to ask kushal sir)

}
