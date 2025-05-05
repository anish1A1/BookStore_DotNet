using System.Text;
using backend.Data;
using backend.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// For postgresql database

builder.Services.AddDbContext<ApplicationDbContext>(o =>
    o.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")))
    ;


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.ASCII.GetBytes(builder.Configuration["JwtSettings:Secret"] ?? "12783))1192@@o123***h*(%^%$2u912u82u332##!*(12ouze")
        ),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true
    };
});

//For Next JS frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});


// Configure authorization policies

builder.Services.AddAuthorization(options => {
    options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
    options.AddPolicy("RequireMemberRole", policy => policy.RequireRole("Member"));
    options.AddPolicy("RequireStaffRole", policy => policy.RequireRole("Staff"));
});


builder.Services.AddScoped<TokenServices>();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "uploads")),
    RequestPath = "/uploads"
});

app.UseCors("AllowNextJs"); //Next JS CORS policy

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
