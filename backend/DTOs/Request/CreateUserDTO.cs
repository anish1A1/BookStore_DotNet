using System;

namespace backend.DTOs.Request;

public class CreateUserDTO
{
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = "Member";
}