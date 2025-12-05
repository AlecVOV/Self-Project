# Recruitment Website For HR

A job portal website designed for HR recruitment purposes, allowing companies to post job vacancies and candidates to submit applications (Expression of Interest - EOI).

> 📚 This project was developed as part of coursework at **Swinburne University of Technology** by Group SOS04 - "PHP Suffer".

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| PHP | Server-side scripting & form processing |
| MySQL/MariaDB | Database management |
| HTML5 & CSS3 | Page structure & styling |
| Font Awesome | Icons |
| Google Fonts | Typography (Rubik, Poppins, Open Sans) |
| BCrypt | Password hashing |

## ✨ Features

### For Job Seekers
- Browse available job listings
- Submit job applications (EOI)
- Track application status by EOI number
- Create and manage user accounts

### For HR Administrators
- Post and manage job vacancies
- View and filter all applications
- Update application status (New → Current → Final)
- Delete records by job reference

### Security Features
- Password hashing with BCrypt
- Login attempt limiting (brute-force protection)
- Prepared statements (SQL injection prevention)
- Role-based access control (user/admin)

## 📁 Project Structure

```
Recruitment Website For HR/
├── index.php              # Home page
├── config.php             # Database connection
├── settings.php           # Database credentials
│
├── Authentication
│   ├── login.php          # User login
│   ├── register.php       # User registration
│   └── logout.php         # Logout handler
│
├── Job Management
│   ├── jobs.php           # Job listings
│   ├── add_jobs.php       # Add new jobs (admin)
│   ├── apply.php          # Application form
│   └── processEOI.php     # Form processing
│
├── User Management
│   ├── dashboard.php      # User dashboard
│   ├── manage.php         # HR management (admin)
│   └── update_profile.php # Profile updates
│
├── Include Files
│   ├── header.inc         # HTML head
│   ├── menu.inc           # Navigation
│   └── footer.inc         # Footer
│
├── styles/
│   └── style.css          # Main stylesheet
│
├── images/                # Website images
├── lib/
│   └── password.php       # Password library
└── uploaded_img/          # User profile images
```

## 🗄️ Database Tables

| Table | Description |
|-------|-------------|
| `user_form` | User accounts (id, name, email, password, image, privileges) |
| `jobs` | Job postings (title, reference, description, salary, etc.) |
| `EOI` | Applications (EOINUM, status, job reference, applicant details) |

## 👥 Team Members

- **Huỳnh Nguyễn Quốc Bảo** - Team Leader
- **Lê Hoàng Triết Thông** - Team Member
- **Tống Đức Từ Tâm** - Team Member

## 📄 License

This project was created for educational purposes at Swinburne University of Technology.
