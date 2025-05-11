using System.Security.Claims;
using backend.Data;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Model;
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

        [HttpPost("create")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<UserDTO>> CreateUser([FromBody] CreateUserDTO createUserDto)
        {
            if (createUserDto.Role != "Staff" && createUserDto.Role != "Member")
            {
                return BadRequest(new { Message = "Invalid role. Role must be 'Staff' or 'Member'." });
            }

            if (await _context.Users.AnyAsync(u => u.UserEmail == createUserDto.UserEmail))
            {
                return BadRequest(new { Message = "Email already exists." });
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                UserName = createUserDto.UserName,
                UserEmail = createUserDto.UserEmail,
                PhoneNumber = createUserDto.PhoneNumber,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password),
                Role = createUserDto.Role,
                ProfileImage = "", 
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userDto = new UserDTO
            {
                UserId = user.Id,
                UserName = user.UserName,
                UserEmail = user.UserEmail,
                PhoneNumber = user.PhoneNumber,
                ProfileImage = user.ProfileImage,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, userDto);
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
                PhoneNumber = u.PhoneNumber,
                ProfileImage = u.ProfileImage,
                Role = u.Role,
                CreatedAt = u.CreatedAt
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
                PhoneNumber = user.PhoneNumber,
                ProfileImage = user.ProfileImage,
                Role = user.Role,
                CreatedAt = user.CreatedAt
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
            user.PhoneNumber = userDto.PhoneNumber;
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
        
        
        [HttpPut("{id}/upload-image")]
        [Authorize]
        public async Task<IActionResult> UploadProfileImage(Guid id, IFormFile file)
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

            if (file == null || file.Length == 0)
            {
                return BadRequest(new { Message = "No file uploaded" });
            }

            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsPath, fileName);

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                user.ProfileImage = $"/uploads/{fileName}";
                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Profile image updated successfully", ProfileImage = user.ProfileImage });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error uploading image", Details = ex.Message });
            }
        }

        
        [HttpPut("{id}/password")]
        [Authorize]
        public async Task<IActionResult> UpdatePassword(Guid id, [FromBody] UpdatePasswordDTO passwordDto)
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

            if (!BCrypt.Net.BCrypt.Verify(passwordDto.CurrentPassword, user.PasswordHash))
            {
                return BadRequest(new { Message = "Current password is incorrect" });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(passwordDto.NewPassword);
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

        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            // Prevent deleting admin users
            if (user.Role == "Admin")
            {
                return BadRequest(new { Message = "Cannot delete an admin user." });
            }

            try
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error deleting user", Details = ex.Message });
            }
        }

        private bool UserExists(Guid id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }

    public class UpdatePasswordDTO
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
