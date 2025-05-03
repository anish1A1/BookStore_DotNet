using System;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Request;

public class LoginDTO
    {
        [Required]
        public string UserName { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }