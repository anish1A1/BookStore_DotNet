using System;

namespace backend.DTOs.Response;

public class BookDTO
{
    public Guid BookId { get; set; }
    public string ISBN { get; set; } = string.Empty;
    public string BookTitle { get; set; } = string.Empty;
    public string BookDescription { get; set; } = string.Empty;
    public DateTime PublicationDate { get; set; }
    public string BookLanguage { get; set; } = string.Empty;
    public decimal BookPrice { get; set; }
    public int StockCount { get; set; }
    public bool LibraryAvailable { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string PublisherName { get; set; } = string.Empty;
    public string GenreName { get; set; } = string.Empty;
    public string FormatName { get; set; } = string.Empty;
    public decimal? Rating { get; set; }
    public int TotalSales { get; set; }
    public decimal DiscountedPrice {get; set;}
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsExclusive { get; set; } = false;
    public bool IsAwardWinner { get; set; } = false;
    public bool IsOnSale { get; set; }
    public decimal? DiscountPercentage { get; set; }
    public DateTime? SaleEndDate { get; set; }
}
