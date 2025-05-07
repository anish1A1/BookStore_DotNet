using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading;
using System.Threading.Tasks;
using backend.Data;
using Microsoft.EntityFrameworkCore;

public class DiscountCleanupService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public DiscountCleanupService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                var expiredDiscounts = await dbContext.Discounts
                    .Where(d => d.EndDate < DateTime.UtcNow)
                    .ToListAsync();

                if (expiredDiscounts.Any())
                {
                    foreach (var discount in expiredDiscounts)
                    {
                        var book = await dbContext.Books.FirstOrDefaultAsync(b => b.BookId == discount.BookId);
                        if (book != null)
                        {
                            book.IsOnSale = false;
                            book.CurrentDiscount = null;
                        }

                        dbContext.Discounts.Remove(discount);
                    }

                    await dbContext.SaveChangesAsync();
                    Console.WriteLine($"Removed {expiredDiscounts.Count} expired discounts.");
                }
            }

            await Task.Delay(TimeSpan.FromHours(12), stoppingToken); // ✅ Runs every 12 hours
        }
    }
}