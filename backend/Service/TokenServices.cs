using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Model;
using Microsoft.IdentityModel.Tokens;

namespace backend.Service;

public class TokenServices
{
    private readonly IConfiguration _configuration;

    public TokenServices(IConfiguration configuration)
    {
            _configuration = configuration;         
    }

    public string GenerateToken(User user)
    {
        var secret = _configuration["JwtSetting:SecretKey"] ?? "12783))1192@@o123***h*(%^%$2u912u82u332##!*(12ouze";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.UserEmail),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

}
