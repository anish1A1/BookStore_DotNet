using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace backend.Service
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendOrderConfirmationAsync(string to, string claimCode, decimal total, int itemCount)
        {
            var smtp = _config.GetSection("Smtp");
            string host = smtp["Host"] ?? throw new InvalidOperationException("SMTP Host is not configured.");
            int port = int.Parse(smtp["Port"] ?? throw new InvalidOperationException("SMTP Port is not configured."));
            string user = smtp["Username"] ?? throw new InvalidOperationException("SMTP Username is not configured.");
            string password = smtp["Password"] ?? throw new InvalidOperationException("SMTP Password is not configured.");

            string body = $"Thank you for your order!\n\nClaim Code: {claimCode}\n\nTotal: ${total}\nItems: {itemCount} books\n\nPlease provide this code to staff at the store to collect your books.";

            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(user, password),
                EnableSsl = true
            };
            using var message = new MailMessage(user, to)
            {
                Subject = "Your Book Order – Claim Code",
                Body = body,
                IsBodyHtml = false
            };

            await client.SendMailAsync(message);
            Console.WriteLine($"Email sent to {to}: Claim Code - {claimCode}");
        }
    }
}