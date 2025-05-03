using backend.Data;
using backend.DTOs.Response;
using backend.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("announcements")]
    [ApiController]
    public class AnnouncementController : ControllerBase
    {
        public readonly ApplicationDbContext _context;

        public AnnouncementController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AnnouncementResponseDTO>>> GetAnnouncements() {
            var announcements = await _context.Announcements.ToListAsync(); ;
            return Ok(announcements.Select(ann => new AnnouncementResponseDTO{
                AnnouncementId = ann.AnnouncementId,
                Title = ann.Title,
                Message = ann.Message,
                StartDate = ann.StartDate,
                EndDate = ann.EndDate
            }));
        }

        [HttpPost]
        public async Task<ActionResult<AnnouncementResponseDTO>> PostAnnouncement() {
            var newAnnouncement = new Announcement();
            _context.Announcements.Add(newAnnouncement);
            await _context.SaveChangesAsync();

            return Ok(new AnnouncementResponseDTO {
                AnnouncementId = newAnnouncement.AnnouncementId,
                Title = newAnnouncement.Title,
                Message = newAnnouncement.Message,
                StartDate = newAnnouncement.StartDate,
                EndDate = newAnnouncement.EndDate
            });
        }

        [HttpGet("latest")]
        public async Task<ActionResult<AnnouncementResponseDTO>> GetLatestAnnouncement() {
            var latestAnnouncement = await _context.Announcements
            .OrderByDescending(ann => ann.StartDate)
            .FirstOrDefaultAsync();

            if (latestAnnouncement == null) {
                return NotFound("No announcements found.");
            }
            return Ok(new AnnouncementResponseDTO{
                AnnouncementId = latestAnnouncement.AnnouncementId,
                Title = latestAnnouncement.Title,
                Message = latestAnnouncement.Message,
                StartDate = latestAnnouncement.StartDate,
                EndDate = latestAnnouncement.EndDate
            });
        }


    }
}
