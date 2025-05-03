using System.Security.Claims;
using backend.Data;
using backend.DTOs.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [HttpGet("getallusers")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();

            // Mappiung users to UserDTO
            var userDtos = users.Select(u => new UserDTO
            {
                UserId = u.Id,
                UserName = u.UserName,
                UserEmail = u.UserEmail,
                Role = u.Role
            }).ToList();

            return Ok(userDtos);
        }

        [HttpGet("getuserbyid/{id}")]
        [Authorize]
        public async Task<ActionResult<UserDTO>> GetUser(Guid id)
        {
            // Get the current user's ID and role from the token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if(userIdClaim == null) return Unauthorized("Invalid!! Token is missing");

            var currentUserId = Guid.Parse(userIdClaim.Value);

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Check if the user is requesting their own data or is an Admin
            if (id != currentUserId && userRole != "Admin")
            {
                return Forbid();
            }

            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            // Mapping user to UserDTO
            var userDto = new UserDTO
            {
                UserId = user.Id,
                UserName = user.UserName,
                UserEmail = user.UserEmail,
                Role = user.Role
            };

            return userDto;
        }

        [HttpPut("updaterole/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> UpdateUserRole(Guid id, [FromBody] string role)
        {
            if (role != "Admin" && role != "Member" && role != "Staff")
            {
                return BadRequest("Invalid role. Role must be 'Admin' or 'Staff' or 'Member'.");
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new{ Message = "User not found" });
            }

            user.Role = role;
            user.UpdatedAt = DateTime.UtcNow;

            // Saving changes to database
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound(new{ Message = "User not found" });
                }
                else
                {
                    throw;
                }
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "An error occurred while updating the user role", Details = ex.Message });
            }

            return NoContent();
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UserDTO userDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized(new { Message = "Invalid token or user ID missing" });
            var currentUserId = Guid.Parse(userIdClaim);
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (id != currentUserId && userRole != "Admin")
            {
                return Forbid();
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            user.UserName = userDto.UserName;
            user.UserEmail = userDto.UserEmail;
            user.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound(new { Message = "User not found" });
                }
                throw;
            }

            return NoContent();
        }

        // Helper method to check if a user exists
        private bool UserExists(Guid id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
