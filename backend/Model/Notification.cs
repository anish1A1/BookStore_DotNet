using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Model;

public class Notification
{
    [Key]
    public int Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; } 

    [Required]
    public string Message { get; set; } =string.Empty;

    public bool IsRead { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
