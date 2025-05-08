using backend.Data;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
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

        private string ComputeStatus(Announcement ann, DateTime currentDate)
        {
            if (!ann.IsActive) return "Draft";
            if (currentDate < ann.StartDate) return "Scheduled";
            if (currentDate >= ann.StartDate && currentDate <= ann.EndDate) return "Active";
            return "Ended";
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<AnnouncementResponseDTO>>> GetAnnouncements()
        {
            var currentDate = DateTime.UtcNow;
            var announcements = await _context.Announcements.ToListAsync();
            return Ok(announcements.Select(ann => new AnnouncementResponseDTO
            {
                AnnouncementId = ann.AnnouncementId,
                Title = ann.Title,
                Message = ann.Message,
                StartDate = ann.StartDate,
                EndDate = ann.EndDate,
                IsActive = ann.IsActive,
                Status = ComputeStatus(ann, currentDate)
            }));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AnnouncementResponseDTO>> GetAnnouncement(Guid id)
        {
            var currentDate = DateTime.UtcNow;
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null)
            {
                return NotFound("Announcement not found.");
            }
            return Ok(new AnnouncementResponseDTO
            {
                AnnouncementId = announcement.AnnouncementId,
                Title = announcement.Title,
                Message = announcement.Message,
                StartDate = announcement.StartDate,
                EndDate = announcement.EndDate,
                IsActive = announcement.IsActive,
                Status = ComputeStatus(announcement, currentDate)
            });
        }

        [HttpGet("latest")]
        [AllowAnonymous]
        public async Task<ActionResult<AnnouncementResponseDTO>> GetLatestAnnouncement()
        {
            var currentDate = DateTime.UtcNow;
            var latestAnnouncement = await _context.Announcements
                .Where(ann => ann.IsActive && currentDate >= ann.StartDate && currentDate <= ann.EndDate)
                .OrderByDescending(ann => ann.StartDate)
                .FirstOrDefaultAsync();

            if (latestAnnouncement == null)
            {
                return NotFound("No active announcements found.");
            }
            return Ok(new AnnouncementResponseDTO
            {
                AnnouncementId = latestAnnouncement.AnnouncementId,
                Title = latestAnnouncement.Title,
                Message = latestAnnouncement.Message,
                StartDate = latestAnnouncement.StartDate,
                EndDate = latestAnnouncement.EndDate,
                IsActive = latestAnnouncement.IsActive,
                Status = ComputeStatus(latestAnnouncement, currentDate)
            });
        }


        [HttpGet("public")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<AnnouncementResponseDTO>>> GetPublicAnnouncements()
        {
            var currentDate = DateTime.UtcNow;
            var announcements = await _context.Announcements
                .Where(ann => ann.IsActive) // Exclude drafts
                .ToListAsync();
            return Ok(announcements.Select(ann => new AnnouncementResponseDTO
            {
                AnnouncementId = ann.AnnouncementId,
                Title = ann.Title,
                Message = ann.Message,
                StartDate = ann.StartDate,
                EndDate = ann.EndDate,
                IsActive = ann.IsActive,
                Status = ComputeStatus(ann, currentDate)
            }));
        }
        

       [HttpPost]
       [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AnnouncementResponseDTO>> PostAnnouncement([FromBody] AnnouncementRequestDTO request)
        {
            if (request.EndDate < request.StartDate)
            {
                return BadRequest("End date must be after start date.");
            }

            var newAnnouncement = new Announcement
            {
                AnnouncementId = Guid.NewGuid(),
                Title = request.Title,
                Message = request.Message,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                IsActive = request.IsActive
            };

            _context.Announcements.Add(newAnnouncement);
            await _context.SaveChangesAsync();

            var currentDate = DateTime.UtcNow;
            return CreatedAtAction(nameof(GetAnnouncement), new { id = newAnnouncement.AnnouncementId }, new AnnouncementResponseDTO
            {
                AnnouncementId = newAnnouncement.AnnouncementId,
                Title = newAnnouncement.Title,
                Message = newAnnouncement.Message,
                StartDate = newAnnouncement.StartDate,
                EndDate = newAnnouncement.EndDate,
                IsActive = newAnnouncement.IsActive,
                Status = ComputeStatus(newAnnouncement, currentDate)
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAnnouncement(Guid id, [FromBody] AnnouncementRequestDTO request)
        {
            if (request.EndDate < request.StartDate)
            {
                return BadRequest("End date must be after start date.");
            }

            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null)
            {
                return NotFound("Announcement not found.");
            }

            announcement.Title = request.Title;
            announcement.Message = request.Message;
            announcement.StartDate = request.StartDate;
            announcement.EndDate = request.EndDate;
            announcement.IsActive = request.IsActive;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}/toggle-active")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleActive(Guid id)
        {
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null)
            {
                return NotFound("Announcement not found.");
            }

            announcement.IsActive = !announcement.IsActive;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAnnouncement(Guid id)
        {
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null)
            {
                return NotFound("Announcement not found.");
            }

            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync();
            return NoContent();
        }


    }
}
