---

## BookStore Management System

A **Full-Stack Online Bookstore** built as a team project using **.NET 8 Web API**, **Next.js**, **PostgreSQL**, **Tailwind CSS**, **Shadcn UI**, and **Axios**. This project was developed as part of the **CS6004NT Application Development** module at Itahari International College, in collaboration with London Metropolitan University.

---

## Project Overview

This system expands a private book library store’s operations into a **full-fledged online retail platform**. It offers:

* A rich, searchable & filterable **book catalogue**
* Member accounts with personalized features
* Secure order management
* Staff fulfilment workflows
* Dynamic admin control over catalogue, inventory & promotions.

---

## 🎯 Core Features

### User Features

* 🔍 Browse a **paginated catalogue** of books.
* 📖 View **detailed book pages** with images, descriptions, and metadata.
* 🗂️ Filter books by **author, genre, language, price, ratings, publisher, format**.
* 🔎 Search by **title, ISBN, description**.
* 📈 Sort by **title, publication date, price, popularity**.
* 📝 Register as a **member**.
* 📌 **Bookmark books** (whitelist).
* 🛒 Add books to **cart**.
* 📦 Place **cancellable orders**.
* 📬 Receive **order confirmation with claim code** via email.
* 🛍️ Claim orders **in-store pickup** with membership ID & claim code.
* ⭐ Leave **reviews & ratings** for purchased books.

### Discounts & Rewards

* 🏷️ **5% discount** on orders of **5+ books**.
* 🎉 **10% stackable discount** after every **10 successful orders**.

### Admin & Staff

* 📚 **CRUD operations** on books and manage **inventory**.
* 🏷️ Add **timed discounts**, mark books **On Sale**, control **discount periods**.
* 🗞️ Publish **banner announcements** for deals & new arrivals.
* 👥 Staff portal to **process orders** using claim codes.
* 📡 Broadcast successful orders with real-time status.

---

## ⚙️ Technology Stack

| Layer                | Tech                                     |
| -------------------- | ---------------------------------------- |
| **Frontend**         | Next.js (React), Shadcn UI, Tailwind CSS |
| **Backend**          | .NET 8 Web API                           |
| **Database**         | PostgreSQL                               |
| **HTTP Client**      | Axios                                    |
| **State Management** | React Context API                        |
| **Version Control**  | Git & GitHub                             |
| **Authentication**   | JWT & Claims                             |
| **Deployment**       | Ready for local & cloud deployment       |

---

##  Database Design

* ERD designed to manage:

  * Books & Inventory
  * Members & Staff
  * Orders, Cart Items, Discounts
  * Reviews & Ratings

---

##  API Highlights

A robust RESTful API with endpoints for:

* `GET /books` - List & filter books
* `GET /books/{id}` - Book details
* `POST /auth/register` - Register member
* `POST /auth/login` - Login & get JWT
* `POST /cart` - Add to cart
* `PUT /cart/{bookId}` - Update cart quantity
* `DELETE /cart/{bookId}` - Remove from cart
* `POST /orders` - Place order
* `POST /reviews` - Add review
* `GET /admin/books` - Admin book management
* `POST /admin/discounts` - Add discounts
  and many more...
---

##  Key Architectural Practices

* ✅ **Clean Architecture & Separation of Concerns (SoC)**
* ✅ **Dependency Injection (DI)**
* ✅ **Error handling** & **validation**
* ✅ **Version control** with clear commits & branching
* ✅ **Secure authentication** with JWT
* ✅ **Responsive UI** with Shadcn + Tailwind CSS

---


## Contributors

> Developed by:
>
> * Anish Jaiswal, James Shrestha, Pramesh Katwal
> * Roles included: Frontend development, Backend API, Database design, UI/UX, Deployment.

---

## 📝 How to Run Locally

```bash
# Clone repository
git clone https://github.com/anish1A1/BookStore_DotNet.git
cd BookStore_DotNet

# Backend (API)
cd backend
dotnet build
dotnet ef database update
dotnet run

# Frontend (Next.js)
cd frontend
npm install
npm run dev
```

**Environment:**

* Create a `.env` file for database connection strings, JWT secrets, and email config.

---

##  Deliverables

✔️ Fully functional project as per coursework requirements
✔️ Completed features, tests, documentation, and code quality
✔️ Submission includes PDF report, zipped repository, deployed preview (if any).

---

##  License

This project is for educational use only.

---

##  Acknowledgements

Thanks to **Itahari International College**, **London Metropolitan University**, and our module leader **Mr. Kushal Tamang / Mr. Bikram Poudel** for guidance and support.

---

