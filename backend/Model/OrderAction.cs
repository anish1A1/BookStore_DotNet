namespace backend.Model;

public class OrderAction
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public Guid StaffId { get; set; }
    public string ActionType { get; set; } = string.Empty; // "Fulfilled" or "Cancelled"
    public DateTime ActionDate { get; set; }
    public Order Order { get; set; } = null!;
    public User Staff { get; set; } = null!;
}