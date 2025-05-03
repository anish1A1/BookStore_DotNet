using backend.Data;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Model;
using backend.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly TokenServices _tokenService;

        public AuthController(ApplicationDbContext context, TokenServices tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDto)
        {
            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.UserName == registerDto.UserName))
            {
                return BadRequest("Username is already taken");
            }

            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.UserEmail == registerDto.UserEmail))
            {
                return BadRequest("Email is already registered");
            }

            // Create new user
            var user = new User
            {
                Id = Guid.NewGuid(),
                UserName = registerDto.UserName,
                UserEmail = registerDto.UserEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                MembershipId = Guid.NewGuid().ToString().Substring(0, 8),
                Role = await _context.Users.AnyAsync() ? "Member" : "Admin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Check if this is the first user, if so, make them an Admin
            if (!await _context.Users.AnyAsync())
            {
                user.Role = "Admin";
            }

            // Add user to database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            
            var token = _tokenService.GenerateToken(user);

            // Return user DTO with token
            return Ok(new
            {
                Token = token,
                User = new UserDTO
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    UserEmail = user.UserEmail,
                    Role = user.Role
                }
            });
        }


        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(LoginDTO loginDto)
        {
            // Find user by username
            var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == loginDto.UserName);

            // Check if user exists
            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid username or password");
            }

            // Generate JWT token
            var token = _tokenService.GenerateToken(user);

            // Return token and user information
            return Ok(new
            {
                Token = token,
                User = new UserDTO
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    UserEmail = user.UserEmail,
                    Role = user.Role
                }
            });
        }
    }
}
