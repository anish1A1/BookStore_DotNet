using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Model;

public class Discount
{
    public Guid DiscountId { get; set; }
    //Nullable Foreign Key for Book (If null, it's a general discount)
    public Guid? BookId { get; set; }
    [ForeignKey("BookId")]
    public Book? Book { get; set; }
    public decimal Percentage { get; set; }
    [Column(TypeName = "timestamp with time zone")]
    public DateTime StartDate { get; set; }
    [Column(TypeName = "timestamp with time zone")]
    public DateTime EndDate { get; set; }
    public bool IsOnSale { get; set; }
}
