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

        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDto)
        {
            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
            {
                return BadRequest("Username is already taken");
            }

            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest("Email is already registered");
            }

            // Create new user
            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password)
            };

            // Check if this is the first user, if so, make them an Admin
            if (!await _context.Users.AnyAsync())
            {
                user.Role = "Admin";
            }

            // Add user to database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Return user DTO with token
            return new UserDTO
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            };
        }

        private ActionResult<UserDTO> BadRequest(string v)
        {
            throw new NotImplementedException();
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(LoginDTO loginDto)
        {
            // Find user by username
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == loginDto.Username);

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
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role
                }
            });
        }
    }
}
