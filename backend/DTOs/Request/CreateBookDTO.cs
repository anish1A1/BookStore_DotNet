using System;

namespace backend.DTOs.Request;

public class CreateBookDTO
{
    public string ISBN { get; set; } = string.Empty;
    public string BookTitle { get; set; } = string.Empty;
    public string BookDescription { get; set; } = string.Empty;
    public DateTime PublicationDate { get; set; }
    public string BookLanguage { get; set; } = string.Empty;
    public decimal BookPrice { get; set; }
    public int InitialStockCount { get; set; }
    public bool LibraryAvailable { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string PublisherName { get; set; } = string.Empty;
    public string GenreName { get; set; } = string.Empty;
    public string FormatName { get; set; } = string.Empty;
}
