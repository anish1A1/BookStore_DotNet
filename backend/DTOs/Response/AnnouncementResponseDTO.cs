using System;

namespace backend.DTOs.Response;

public class AnnouncementResponseDTO
{   

    public Guid AnnouncementId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; } = true;
    public string Status { get; set; } = string.Empty;
}
