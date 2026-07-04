# Human Resource Management System (HRMS)

A web-based Human Resource Management System that digitizes and streamlines core HR operations — employee onboarding, profile management, attendance tracking, leave management, payroll visibility, and approval workflows for Admins and Employees.

## 1. Purpose

Every workday, perfectly aligned.

The HRMS is designed to replace manual, paper-based, or spreadsheet-driven HR processes with a single digital platform where employees can manage their own attendance, leave, and profile information, while HR/Admin staff can oversee and approve requests across the organization.

## 2. Scope

The system provides:

- Secure authentication (Sign Up / Sign In) with role-based access
- Role-based access control (Admin/HR vs Employee)
- Employee profile management (personal details, job details, salary, documents)
- Attendance tracking with daily/weekly views and check-in/check-out
- Leave and time-off management with an approval workflow
- Read-only payroll visibility for employees, full control for Admin/HR

## 3. Definitions & Abbreviations

| Term | Meaning |
|---|---|
| Admin / HR Officer | User with management and approval privileges |
| Employee | Regular user with limited, self-service access |
| Time-Off | Paid leave, sick leave, unpaid leave, etc. |

## 4. User Roles

| Role | Description |
|---|---|
| **Admin / HR Officer** | Manages employees, approves leave & attendance, views and edits payroll details |
| **Employee** | Views personal profile, attendance, applies for leave, views salary details (read-only) |

## 5. Tech Stack

### Frontend
- **React (Vite)** — component-based UI
- **React Router** — client-side routing between pages
- **Axios** — API communication
- **react-datepicker** — calendar-based date range selection for leave requests
- **qrcode.react** — QR code generation for attendance check-in/check-out
- Plain CSS (design tokens via CSS variables) for styling

### Backend
- **Node.js + Express** — REST API server
- **Prisma ORM** — database schema modeling and queries
- **PostgreSQL** — relational database
- **JWT** — authentication/session tokens
- **bcrypt** — password hashing
- Email verification service (e.g. Nodemailer/SendGrid) for account verification

### Development/Testing Tools
- **json-server** — used during frontend development to simulate the backend API before integration

## 6. Features

### 6.1 Authentication & Authorization
- Sign up with Employee ID, Email, Password, and Role (Employee/HR)
- Password validation rules enforced on signup
- Email verification required before account activation
- Sign in with email and password, with error handling for invalid credentials
- Successful login redirects to the appropriate dashboard based on role

### 6.2 Dashboard

**Employee Dashboard**
- Quick-access cards: Profile, Attendance, Leave Requests, Logout
- Recent activity feed showing latest attendance/leave updates

**Admin/HR Dashboard**
- Employee list with search/filter
- Attendance records overview across all employees
- Leave request approvals queue
- Ability to switch between employee views

### 6.3 Employee Profile Management
- **View:** personal details, job details, salary structure, documents, profile picture
- **Edit:** employees can edit limited fields (address, phone, profile picture); Admin can edit all employee details

### 6.4 Attendance Management
- Daily and weekly attendance views
- Check-in / check-out functionality
- Status types: Present, Absent, Half-day, Leave
- Employees view only their own attendance; Admin/HR views attendance of all employees

### 6.5 Leave & Time-Off Management
- Employees apply for leave by selecting leave type (Paid, Sick, Unpaid), choosing a date range via calendar, and adding remarks
- Leave request statuses: Pending, Approved, Rejected
- Admin/HR can view all requests, approve or reject them, and add comments
- Changes reflect immediately in the employee's records

### 6.6 Payroll/Salary Management
- Employees: read-only payroll view
- Admin: view payroll of all employees, update salary structure, ensure payroll accuracy

## 7. Project Structure

```
HR-management-system/
├── frontend/
│   ├── src/
│   │   ├── pages/          # SignIn, SignUp, EmployeeDashboard, AdminDashboard, Profile, Attendance, Leave
│   │   ├── api.js          # Centralized API client (Axios instance)
│   │   ├── App.jsx         # Route definitions
│   │   └── index.css       # Global design tokens and base styles
│   ├── db.json             # Mock database used during frontend-only development (json-server)
│   └── package.json
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma   # Database schema (Users, Profiles, Attendance, LeaveRequests, Payroll)
│   ├── index.js             # Express server entry point
│   ├── routes/              # API route handlers (auth, users, attendance, leave, payroll)
│   ├── .env                 # Environment variables (DATABASE_URL, JWT_SECRET, etc.)
│   └── package.json
│
└── README.md
```

## 8. Database Schema (Overview)

| Table | Description |
|---|---|
| `users` | Login credentials, employee ID, role, email verification status |
| `profiles` | Personal details, job title, address, phone, photo |
| `attendance` | Daily attendance records, check-in/check-out timestamps, status |
| `leaveRequests` | Leave applications with type, date range, status, remarks |
| `payroll` | Salary structure, deductions, net salary per employee |

Each of `profiles`, `attendance`, `leaveRequests`, and `payroll` relates back to `users` via a `userId` foreign key.

## 9. Getting Started

### Prerequisites
- Node.js (LTS version)
- npm
- PostgreSQL database (or a hosted instance, e.g. Supabase)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:
```
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<database>"
JWT_SECRET="your-secret-key"
```

Push the schema to your database:
```bash
npx prisma db push
```

Start the backend server:
```bash
node index.js
```
The API runs at `http://localhost:5000` by default.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
The app runs at `http://localhost:5173` by default.

### Frontend-only Development (no backend required)

For UI development without a live backend, the frontend can run against a mock API using `json-server`:

```bash
npm install -g json-server
json-server --watch db.json --port 3001
```

Point `frontend/src/api.js` to `http://localhost:3001`. Switching to the real backend later only requires updating the base URL and aligning request/response shapes with the actual API contract.

## 10. Roles & Permissions Summary

| Action | Employee | Admin/HR |
|---|:---:|:---:|
| View own profile | ✅ | ✅ |
| Edit own contact info | ✅ | ✅ |
| Edit any employee's full details | ❌ | ✅ |
| Check in / check out | ✅ | ✅ |
| View own attendance | ✅ | ✅ |
| View all employees' attendance | ❌ | ✅ |
| Apply for leave | ✅ | ✅ |
| Approve/reject leave requests | ❌ | ✅ |
| View own payroll (read-only) | ✅ | ✅ |
| Edit payroll/salary structure | ❌ | ✅ |

## 11. Future Enhancements

- Camera-based QR code scanning for attendance (currently QR is generated for display; scanning integration is a planned enhancement)
- Automated Absent/Leave status marking via scheduled backend jobs
- Admin-managed job title/department assignment during onboarding
- Document upload and storage for employee records
- Email notifications for leave approval/rejection

## 12. Reference

Original system design/wireframes: [Excalidraw board](https://link.excalidraw.com/l/65VNwvy7c4X/58RLEJ4oOwh)