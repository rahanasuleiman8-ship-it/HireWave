# HireWave 🌊

A full-stack job board application built with **.NET 8 Web API** and **React**, inspired by Indeed. Employers can post jobs and manage applicants. Job seekers can browse, search, and apply — with email notifications at every step.

> Built as a portfolio project to demonstrate full-stack .NET development skills.

🌐 **Live Demo:** https://hire-wave-ten.vercel.app

---

## Screenshots

### Homepage
![Homepage](docs/screenshots/homepage.png)

### Job Listings
![Job Listings](docs/screenshots/jobs.png)

### Job Detail & Apply
![Job Detail](docs/screenshots/job-detail.png)

### Employer Dashboard
![Employer Dashboard](docs/screenshots/dashboard.png)

---

## Tech Stack

**Backend**
- .NET 8 Web API
- ASP.NET Core Identity (role-based: Employer / Job Seeker)
- JWT Bearer Authentication
- Entity Framework Core 8
- PostgreSQL 16
- MailKit (email notifications via Mailpit in development)

**Frontend**
- React 18 (Vite)
- React Router v6
- Axios
- Tailwind CSS v4

**Infrastructure**
- Docker & Docker Compose (PostgreSQL + Mailpit)

---

## Features

- **Role-based auth** — separate flows for Employers and Job Seekers
- **JWT authentication** — secure, stateless API
- **Job listings** — employers can create, edit, and deactivate listings
- **Job search** — filter by keyword, location, job type, and salary
- **Pagination** — paginated job results
- **Applications** — job seekers can apply with a cover letter and optional CV upload
- **Email notifications** — confirmation emails on apply, and status update emails to applicants
- **Employer dashboard** — view all applicants per job, update application status (Applied → Reviewing → Interview → Offered → Rejected)

---

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Clone the repo
```bash
git clone https://github.com/rahanasuleiman8-ship-it/HireWave.git
cd HireWave
```

### 2. Start the database and mail server
```bash
docker compose up -d
```

This starts:
- PostgreSQL on port `5433`
- Mailpit (local email) on port `1025` (UI at http://localhost:8025)

### 3. Configure the API

Copy the example config and fill in your values:
```bash
cp src/HireWave.API/appsettings.example.json src/HireWave.API/appsettings.json
```

`appsettings.json` is gitignored — never commit secrets.

### 4. Run database migrations
```bash
cd src/HireWave.API
dotnet ef database update
```

### 5. Start the API
```bash
dotnet run
```

API runs at: http://localhost:5264  
Swagger UI: http://localhost:5264/swagger

### 6. Start the frontend
```bash
cd ../hirewave-client
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Project Structure
```
HireWave/
├── src/
│   ├── HireWave.API/               # .NET 8 Web API
│   │   ├── Controllers/            # Auth, Jobs, Applications
│   │   ├── Data/                   # AppDbContext (EF Core)
│   │   ├── DTOs/                   # Request/response models
│   │   ├── Models/                 # Domain entities + enums
│   │   ├── Services/               # JwtService, EmailService
│   │   └── wwwroot/uploads/cvs/    # CV file storage
│   └── hirewave-client/            # React frontend (Vite)
│       └── src/
│           ├── api/                # Axios client
│           ├── context/            # Auth context
│           ├── pages/              # All page components
│           └── components/         # Navbar
└── docker-compose.yml
```

---

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |

### Jobs
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/jobs` | Public |
| GET | `/api/jobs/search` | Public |
| GET | `/api/jobs/{id}` | Public |
| GET | `/api/jobs/mine` | Employer |
| POST | `/api/jobs` | Employer |
| PUT | `/api/jobs/{id}` | Employer |
| DELETE | `/api/jobs/{id}` | Employer |

### Applications
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/applications` | Job Seeker |
| GET | `/api/applications/mine` | Job Seeker |
| GET | `/api/applications/job/{jobId}` | Employer |
| PUT | `/api/applications/{id}/status` | Employer |

---

## Environment Variables

The API reads from `appsettings.json` (gitignored). Use `appsettings.example.json` as a template:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5433;Database=hirewavedb;Username=hirewave;Password=yourpassword"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-min-32-characters-long",
    "Issuer": "HireWave",
    "Audience": "HireWaveUsers",
    "ExpiryHours": 24
  },
  "EmailSettings": {
    "SmtpHost": "localhost",
    "SmtpPort": 1025,
    "FromEmail": "noreply@hirewave.com",
    "FromName": "HireWave"
  }
}
```

---

## Author

Built by **Rahana** — aspiring .NET developer based in the UK.

- GitHub: [@rahanasuleiman8-ship-it](https://github.com/rahanasuleiman8-ship-it)

---

## Licence

MIT
