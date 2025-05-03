using System;

namespace backend.Model;

public class Discount
{
    public Guid DiscountId { get; set; }
    //Nullable Foreign Key for Book (If null, it's a general discount)
    public Guid? BookId { get; set; }
    public Book? Book { get; set; }
    public decimal Percentage { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsOnSale { get; set; }
}
