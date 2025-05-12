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

            string body = $"Thank you for your order!\n\nClaim Code: {claimCode}\n\nTotal: Rs.{total}\nItems: {itemCount} books\n\n" +
                          $"Please provide this code to staff at the BookLux Store, Putalisadak, Kathmandu to collect your books.\n\n" +
                          $"Pickup Date: Tomorrow, 10:00 AM - 05:00 PM\nHeld for 3 days from pickup.";

            try
            {
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
            catch (SmtpException ex)
            {
                Console.WriteLine($"SMTP error while sending email to {to}: {ex.Message}");
                throw new InvalidOperationException($"Failed to send email: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error while sending email to {to}: {ex.Message}");
                throw new InvalidOperationException($"Unexpected error while sending email: {ex.Message}", ex);
            }

        }
    }
}