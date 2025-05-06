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
    [Route("book")]
    [ApiController]
    public class BookController : ControllerBase
    {
    private readonly ApplicationDbContext _context;

    public BookController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult> GetBooks(
        int page = 1,
        int pageSize = 10,
        string? search = null,
        string? sort = null,
        string? genreName = null,
        string? authorName = null,
        string? publisherName = null,
        string? formatName = null,
        string? bookLanguage = null,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        decimal? minRating = null,
        bool? inStock = null,
        bool? libraryAvailable = null,
        bool? exclusive = null,
        bool? awardWinner = null)
    {
        var query = _context.Books
            .Include(b => b.Inventory)
            .Include(b => b.Discounts.Where(d => d.EndDate > DateTime.UtcNow))  //adding discounts too
            .AsQueryable();

//For filtering purposes

        if (!string.IsNullOrEmpty(search))
        {
            search = search.ToLower();
            query = query.Where(b => b.BookTitle.ToLower().Contains(search) ||
                                     b.AuthorName.ToLower().Contains(search) ||
                                     b.ISBN.ToLower().Contains(search) ||
                                     b.BookDescription.ToLower().Contains(search));
        }


        if (!string.IsNullOrEmpty(genreName))
            {
                query = query.Where(b => b.GenreName.Contains(genreName));
            }
            if (!string.IsNullOrEmpty(authorName))
            {
                query = query.Where(b => b.AuthorName.Contains(authorName));
            }
            if (!string.IsNullOrEmpty(publisherName))
            {
                query = query.Where(b => b.PublisherName.Contains(publisherName));
            }
        if (!string.IsNullOrEmpty(formatName)) query = query.Where(b => b.FormatName == formatName);
        if (!string.IsNullOrEmpty(bookLanguage)) query = query.Where(b => b.BookLanguage == bookLanguage);
        if (minPrice.HasValue) query = query.Where(b => b.BookPrice >= minPrice.Value);
        if (maxPrice.HasValue) query = query.Where(b => b.BookPrice <= maxPrice.Value);
        if (minRating.HasValue) query = query.Where(b => b.Rating >= minRating.Value);
        if (inStock.HasValue && inStock.Value) query = query.Where(b => b.Inventory != null && b.Inventory.StockCount > 0);
        if (libraryAvailable.HasValue) query = query.Where(b => b.LibraryAvailable == libraryAvailable.Value);
        
        if (exclusive.HasValue && exclusive.Value) query = query.Where(b => b.IsExclusive == exclusive.Value);
        if (awardWinner.HasValue && awardWinner.Value) query = query.Where(b => b.IsAwardWinner == awardWinner.Value);

        if (!string.IsNullOrEmpty(sort))
        {
            switch (sort.ToLower())
            {
                case "title":
                    query = query.OrderBy(b => b.BookTitle);
                    break;
                case "author":
                    query = query.OrderBy(b => b.AuthorName);
                    break;
                case "price":
                    query = query.OrderBy(b => b.BookPrice);
                    break;
                case "publicationdate":
                    query = query.OrderBy(b => b.PublicationDate);
                    break;
                case "popularity": 
                    query = query.OrderByDescending(b => b.TotalSales); 
                    break;
                default:
                    query = query.OrderBy(b => b.CreatedAt);
                    break;
            }
        }
        else
        {
            query = query.OrderBy(b => b.CreatedAt);
        }

// For pagination features
        var totalItems = await query.CountAsync();

        
        var books = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(b => new BookDTO
            {
                BookId = b.BookId,
                ISBN = b.ISBN,
                BookTitle = b.BookTitle,
                BookDescription = b.BookDescription,
                PublicationDate = b.PublicationDate,
                BookLanguage = b.BookLanguage,
                BookPrice = b.BookPrice,
                DiscountedPrice = b.Discounts.Any() ? b.BookPrice * (1- b.Discounts.OrderByDescending(d => d.StartDate).First().Percentage / 100) : b.BookPrice,

                StockCount = b.Inventory != null ? b.Inventory.StockCount : 0,
                LibraryAvailable = b.LibraryAvailable,
                AuthorName = b.AuthorName,

                PublisherName = b.PublisherName,
                GenreName = b.GenreName,
                FormatName = b.FormatName,
                Rating = b.Rating,
                TotalSales = b.TotalSales,
                IsAwardWinner = b.IsAwardWinner,
                IsExclusive = b.IsExclusive,
                ImageUrl = b.ImageUrl ?? ""
            })
            .ToListAsync();
        return Ok(new
        {
            TotalItems = totalItems,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
            Books = books
        });
    }


    
    // GET: /book/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<BookDTO>> GetBook(Guid id)
    {
        var book = await _context.Books
            .Include(b => b.Inventory)
            .Select(b => new BookDTO
            {
                BookId = b.BookId,
                ISBN = b.ISBN,
                BookTitle = b.BookTitle,
                BookDescription = b.BookDescription,
                PublicationDate = b.PublicationDate,
                BookLanguage = b.BookLanguage,
                BookPrice = b.BookPrice,
                StockCount = b.Inventory != null ? b.Inventory.StockCount : 0,
                LibraryAvailable = b.LibraryAvailable,
                AuthorName = b.AuthorName,
                PublisherName = b.PublisherName,
                GenreName = b.GenreName,
                FormatName = b.FormatName,
                Rating = b.Rating,
                TotalSales = b.TotalSales,
                IsAwardWinner = b.IsAwardWinner,
                IsExclusive = b.IsExclusive,
                ImageUrl = b.ImageUrl ?? ""
            })
            .FirstOrDefaultAsync(b => b.BookId == id);

        if (book == null)
        {
            return NotFound(new { Message = "Book not found" });
        }

        return Ok(book);
    }

    // POST: /book
   [Authorize(Roles = "Admin")]
    [HttpPost("create")]
    public async Task<ActionResult<BookDTO>> CreateBook([FromForm] CreateBookDTO createBookDTO, IFormFile imageFile)
    {
        var existingBook = await _context.Books.FirstOrDefaultAsync(b => b.ISBN == createBookDTO.ISBN);
        if (existingBook != null)
        {
            return BadRequest(new { Message = "A book with this ISBN already exists." });
        }


    
    var book = new Book
    {
        BookId = Guid.NewGuid(),
        ISBN = createBookDTO.ISBN,
        BookTitle = createBookDTO.BookTitle,
        BookDescription = createBookDTO.BookDescription,
        PublicationDate = DateTime.SpecifyKind(createBookDTO.PublicationDate, DateTimeKind.Utc),
        BookLanguage = createBookDTO.BookLanguage,
        BookPrice = createBookDTO.BookPrice,
        LibraryAvailable = createBookDTO.LibraryAvailable,
        AuthorName = createBookDTO.AuthorName,
        PublisherName = createBookDTO.PublisherName,
        GenreName = createBookDTO.GenreName,
        FormatName = createBookDTO.FormatName,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
        IsAwardWinner = createBookDTO.IsAwardWinner,
        IsExclusive = createBookDTO.IsExclusive,
        ImageUrl = string.Empty
    };

    //  Handling Image Upload Properly
    if (imageFile != null && imageFile.Length > 0)
    {
        Console.WriteLine($"Received image file: {imageFile.FileName}, Length: {imageFile.Length}");
        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
        if (!Directory.Exists(uploadsPath))
        {
            Directory.CreateDirectory(uploadsPath);
        }

        var fileName = $"{Guid.NewGuid()}_{imageFile.FileName}";
        var filePath = Path.Combine(uploadsPath, fileName);
        Console.WriteLine($"Saving to: {filePath}");

        try
        {
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }
            book.ImageUrl = $"/uploads/{fileName}"; // Store relative path
            Console.WriteLine($"Image saved with URL: {book.ImageUrl}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving image: {ex.Message}");
            return StatusCode(500, new { Message = "Error saving image" });
        }
    }
    else
    {
        Console.WriteLine("No image file received.");
    }

    var inventory = new Inventory
    {
        Id = Guid.NewGuid(),
        BookId = book.BookId,
        Book = book,
        StockCount = createBookDTO.InitialStockCount,
        LastUpdated = DateTime.UtcNow
    };

    book.Inventory = inventory;

    _context.Books.Add(book);
    await _context.SaveChangesAsync();

    var bookDTO = new BookDTO
    {
        BookId = book.BookId,
        ISBN = book.ISBN,
        BookTitle = book.BookTitle,
        BookDescription = book.BookDescription,
        PublicationDate = book.PublicationDate,
        BookLanguage = book.BookLanguage,
        BookPrice = book.BookPrice,
        StockCount = book.Inventory.StockCount,
        LibraryAvailable = book.LibraryAvailable,
        AuthorName = book.AuthorName,
        PublisherName = book.PublisherName,
        GenreName = book.GenreName,
        FormatName = book.FormatName,
        Rating = book.Rating,
        TotalSales = book.TotalSales,
        IsAwardWinner = book.IsAwardWinner,
        IsExclusive = book.IsExclusive,
        ImageUrl = book.ImageUrl // ✅ Send Image URL in response
    };

    return CreatedAtAction(nameof(GetBook), new { id = book.BookId }, bookDTO);
}

    // PUT: book/{id}
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(Guid id, UpdateBookDTO updateBookDTO)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
        {
            return NotFound(new { Message = "Book not found" });
        }

        book.ISBN = updateBookDTO.ISBN;
        book.BookTitle = updateBookDTO.BookTitle;
        book.BookDescription = updateBookDTO.BookDescription;
        book.PublicationDate = DateTime.SpecifyKind(updateBookDTO.PublicationDate, DateTimeKind.Utc);
        book.BookLanguage = updateBookDTO.BookLanguage;
        book.BookPrice = updateBookDTO.BookPrice;
        book.LibraryAvailable = updateBookDTO.LibraryAvailable;
        book.AuthorName = updateBookDTO.AuthorName;
        book.PublisherName = updateBookDTO.PublisherName;
        book.GenreName = updateBookDTO.GenreName;
        book.FormatName = updateBookDTO.FormatName;
        book.IsAwardWinner = updateBookDTO.IsAwardWinner;
        book.IsExclusive = updateBookDTO.IsExclusive;
        book.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: /book/{id}
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(Guid id)
    {
        var book = await _context.Books
            .Include(b => b.Inventory)
            .FirstOrDefaultAsync(b => b.BookId == id);

        if (book == null) return NotFound(new { Message = "Book not found" });

        if (book.Inventory != null) _context.Inventories.Remove(book.Inventory);
        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PUT: book/{id}/inventory
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/inventory")]
    public async Task<IActionResult> UpdateInventory(Guid id, UpdateInventoryDTO updateInventoryDTO)
    {
        var inventory = await _context.Inventories
            .FirstOrDefaultAsync(i => i.BookId == id);

        if (inventory == null)
        {
            return NotFound(new { Message = "Inventory not found for this book" });
        }

        inventory.StockCount = updateInventoryDTO.StockCount;
        inventory.LastUpdated = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    }
}
