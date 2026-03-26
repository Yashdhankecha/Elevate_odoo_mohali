# 🚀 Elevate :  Comprehensive Placement Management Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.0-purple?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-orange?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express-4.18+-black?style=for-the-badge&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.3+-cyan?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS" />
</div>

---

## 📹 Demo

🎥 **[Watch Demo Video](https://drive.google.com/drive/folders/1JtYBU8BUwuodFChIFrsziQ1qcTMgCsY_?usp=sharing)**

---

## 🎯 What is Elevate?

**Elevate** is a full-stack placement management platform built for engineering colleges. It digitises and streamlines the entire campus placement lifecycle — from student profile creation and internship applications to on-campus drive scheduling, interview tracking, and real-time analytics.

The platform unifies **three distinct portals** under one roof:

| Portal | Who uses it |
|--------|-------------|
| 🎓 Student | Browse jobs/internships, apply, track applications, practise coding |
| 🏢 Company | Post jobs, review applications, schedule interviews |
| 🧑‍🏫 TPO | Manage drives, verify students, generate placement reports |

---

## 🔥 Problem It Solves

Traditional placement processes at colleges suffer from:

- **Fragmented communication** — emails, spreadsheets, and phone calls between TPOs, students, and companies
- **No real-time status tracking** — students have no visibility into their application progress
- **Manual resume shortlisting** — zero tooling for companies to filter candidates efficiently
- **Zero coding practise integration** — students must use external platforms with no placement context
- **Lack of analytics** — TPOs cannot generate branch-wise placement reports instantly

**Elevate** replaces all of the above with a unified, role-aware web platform featuring live dashboards, AI-powered chat support, integrated code execution, and automated PDF/Excel reporting.

---

## ✨ Core Features

### 🔐 Authentication & Security
- Role-based registration for Students, Companies, and TPOs
- **Email OTP Verification** via Nodemailer (Gmail SMTP)
- **Google OAuth 2.0** sign-in integration
- **JWT** authentication with HTTP-only cookies
- Forgot password / reset password flow
- TPO institute-scoped access control middleware

### 👨‍🎓 Student Portal
- Complete academic profile — CGPA, branch, skills, projects, certifications
- Browse on-campus & off-campus jobs / internships
- One-click applications with real-time status tracking (Applied → Shortlisted → Interview → Offered/Rejected)
- **Resume Builder** — export to PDF via `@react-pdf/renderer`
- **Practice Hub** — solve LeetCode-style problems in-browser with live code execution powered by **Judge0 CE** (via RapidAPI)
- Application history with stipend and package details

### 🏢 Company Portal
- Post, edit, and delete job/internship listings
- Review and shortlist student applications
- Schedule interviews with per-candidate status management
- Analytics dashboard — applications received, shortlist ratios, hiring funnel

### 🧑‍🏫 TPO Portal
- Manage on-campus drive lifecycle (create → eligible students → applications → results)
- Institute-filtered student list with verification and approval
- Create and manage internship offers visible to students
- **AI-powered Career Chatbot** — answers student queries using **Groq (Llama 3)** LLM
- Branch-wise and year-wise placement analytics with **Recharts** visualisations
- Export placement reports to **PDF** and **Excel (XLSX)**

### 🤖 AI Career Chatbot
- Powered by **Groq SDK** (`groq-sdk`) with the `llama3-70b-8192` model
- Answers career, placement, and resume-related questions with context streamed from the server

### 💻 Coding Practice Hub (Judge0 Integration)
- Fetches real LeetCode problems via a **server-side LeetCode GraphQL proxy** (CORS bypass)
- Submits code for execution via **Judge0 CE API** (RapidAPI)
- Supports multiple languages — Python, JavaScript, C++, Java, and more
- Automatic test-harness engine parses LeetCode-style function signatures, wraps user code, and validates output against expected results

### 📊 Analytics & Reporting
- Live dashboards for all three roles
- Branch-wise and company-wise placement statistics
- PDF and Excel (XLSX) export from the frontend

---

## 🛠️ Technology Stack

### Frontend (`client/`)

| Library | Version | Purpose |
|---------|---------|---------|
| **React** | `^18.2.0` | Core UI framework |
| **Vite** | `^5.0.0` | Build tool & dev server |
| **React Router DOM** | `^6.20.1` | Client-side routing |
| **TailwindCSS** | `^3.3.6` | Utility-first styling |
| **Axios** | `^1.6.2` | HTTP client |
| **Recharts** | `^2.7.2` | Data visualisation charts |
| **React Hot Toast** | `^2.4.1` | Toast notifications |
| **React Icons** | `^4.12.0` | Icon library |
| **Lucide React** | `^0.292.0` | Additional icon set |
| **@react-pdf/renderer** | `^4.3.2` | PDF generation in-browser |
| **react-to-pdf** | `^3.2.1` | HTML-to-PDF export |
| **xlsx** | `^0.18.5` | Excel file generation |
| **react-markdown** | `^10.1.0` | Render markdown (chatbot responses) |
| **remark-gfm** | `^4.0.1` | GitHub Flavored Markdown |

### Backend (`server/`)

| Library | Version | Purpose |
|---------|---------|---------|
| **Express** | `^4.18.2` | REST API framework |
| **Mongoose** | `^8.0.3` | MongoDB ODM |
| **jsonwebtoken** | `^9.0.2` | JWT auth tokens |
| **bcryptjs** | `^2.4.3` | Password hashing |
| **Nodemailer** | `^8.0.1` | Email OTP & notifications |
| **Multer** | `^2.1.1` | File / resume upload handling |
| **Cloudinary** | `^2.9.0` | Cloud image & file storage |
| **groq-sdk** | `^0.30.0` | Groq AI (Llama 3) LLM API |
| **Axios** | `^1.11.0` | Server-side HTTP proxy (LeetCode) |
| **express-validator** | `^7.0.1` | Input validation middleware |
| **cors** | `^2.8.5` | Cross-origin resource sharing |
| **cookie-parser** | `^1.4.6` | HTTP cookie middleware |
| **dotenv** | `^16.3.1` | Environment variable management |
| **nodemon** | `^3.0.2` | Dev auto-restart |

---

## 🌐 Third-Party APIs & External Services

| Service | Used for |
|---------|----------|
| **MongoDB Atlas** | Hosted cloud database |
| **Groq API** (`api.groq.com`) | LLM-powered AI career chatbot (Llama 3 70B) |
| **Judge0 CE** (via RapidAPI) | Remote code execution for the Practice Hub |
| **LeetCode GraphQL API** (`leetcode.com/graphql`) | Fetching real coding problems & test cases (proxied server-side) |
| **Cloudinary** | Resume/document/image cloud storage & CDN |
| **Gmail SMTP** (via Nodemailer) | OTP emails, password reset, notifications |
| **Google OAuth 2.0** | Social login for students and TPOs |

---

## 📁 Project Structure

```
Elevate_odoo_mohali/
├── client/                          # React + Vite Frontend
│   ├── src/
│   │   ├── components/              # Shared UI components (Navbar, PrivateRoute, etc.)
│   │   ├── contexts/                # AuthContext, NotificationContext
│   │   ├── pages/
│   │   │   ├── student/             # Student dashboard, profile, practice hub
│   │   │   ├── company/             # Company dashboard & job management
│   │   │   ├── tpo/                 # TPO dashboard, drives, analytics
│   │   │   └── superadmin/          # Super-admin panel
│   │   ├── services/
│   │   │   ├── judge0Api.jsx        # Judge0 code execution client
│   │   │   ├── studentApi.js        # Student REST API helpers
│   │   │   ├── companyApi.js        # Company REST API helpers
│   │   │   └── tpoApi.js            # TPO REST API helpers
│   │   └── utils/                   # Utility helpers
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Node.js + Express Backend
│   ├── models/                      # Mongoose schemas (User, JobPosting, Application …)
│   ├── routes/
│   │   ├── auth.js                  # Register, login, OTP, OAuth
│   │   ├── student.js               # Student profile & applications
│   │   ├── company.js               # Company jobs & interviews
│   │   ├── tpo.js                   # TPO drives, students, analytics
│   │   ├── practice.js              # LeetCode GraphQL proxy
│   │   ├── chat.js                  # Groq AI chatbot endpoint
│   │   ├── notifications.js         # Notification system
│   │   ├── user.js                  # Shared user routes (Cloudinary upload)
│   │   ├── admin.js                 # Admin management
│   │   └── superadmin.js            # Super-admin routes
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification middleware
│   │   └── tpoInstituteAccess.js    # TPO institute-scoped access control
│   ├── utils/
│   │   └── emailService.js          # Nodemailer helper
│   ├── server.js                    # Entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher
- A **MongoDB Atlas** cluster (or local MongoDB)
- RapidAPI key for **Judge0 CE**
- **Groq** API key
- **Cloudinary** account
- **Gmail** app password for email

### 1 — Clone & Install

```bash
git clone <repository-url>
cd Elevate_odoo_mohali

# Install root + client + server dependencies
npm run install:all
```

### 2 — Environment Setup

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/elevate_odoo_mohali

# Auth
JWT_SECRET=your-very-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com

# Frontend
CLIENT_URL=http://localhost:3000

# Groq AI
GROQ_API_KEY=your-groq-api-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Create `client/.env`:

```env
VITE_JUDGE0_API_KEY=your-rapidapi-key
VITE_X_RAPID_API_HOST=judge0-ce.p.rapidapi.com
```

### 3 — Run in Development

```bash
# Start both frontend and backend concurrently
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 🔐 API Endpoints (Summary)

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/verify-otp` | Verify email OTP |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/logout` | Logout |
| `POST` | `/api/auth/forgot-password` | Initiate password reset |
| `POST` | `/api/auth/reset-password` | Reset password |
| `GET`  | `/api/auth/me` | Get current user |

### Student
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/PUT` | `/api/student/profile` | Get / update profile |
| `GET` | `/api/student/jobs` | Browse job listings |
| `POST` | `/api/student/jobs/:id/apply` | Apply for a job |
| `GET` | `/api/student/applications` | Track own applications |
| `GET` | `/api/student/internship-offers` | Browse internship offers |

### Company
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/POST` | `/api/company/jobs` | List / create jobs |
| `PUT/DELETE` | `/api/company/jobs/:id` | Update / delete a job |
| `GET` | `/api/company/applications` | View job applications |
| `GET` | `/api/company/interviews` | Manage interviews |

### TPO
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tpo/students` | List institute students |
| `GET/POST/PUT/DELETE` | `/api/tpo/internship-offers` | Manage internship offers |
| `GET` | `/api/tpo/dashboard/stats` | Analytics data |

### Practice & AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/practice/leetcode` | LeetCode GraphQL proxy |
| `POST` | `/api/chat` | Groq AI career chatbot |

---

## 🔒 Security Features

- **JWT** tokens stored in HTTP-only cookies
- **Bcrypt** password hashing (10 rounds)
- **Email OTP** verification before account activation
- **Google OAuth 2.0** for social logins
- **Institute-scoped access control** for TPOs (middleware enforces college-level data isolation)
- **express-validator** on all mutation endpoints
- **CORS** restricted to the configured client URL
