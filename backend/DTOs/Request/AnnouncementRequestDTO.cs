using System;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Request;

public class AnnouncementRequestDTO
{
    [Required]
    public string Title { get; set; } = string.Empty;
    [Required]
    public string Message { get; set; } = string.Empty;
    [Required]
    public DateTime StartDate { get; set; }
    [Required]
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; } = true;
}
