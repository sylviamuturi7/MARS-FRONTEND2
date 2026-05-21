# MARS Frontend

A React-based web application for the **Mac-Address Attendance & Registration System**. This frontend provides an administrative interface for monitoring student attendance through device MAC address registration and tracking.

## Overview

MARS allows educational institutions to track student attendance by registering devices (laptops, phones, tablets) with their MAC addresses. When a registered device connects to the campus network, the system automatically records the attendance. The frontend provides dashboards for viewing attendance statistics, managing departments, generating reports, and overseeing registered students and devices.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.6 | UI library for building component-based interfaces |
| Vite | 8.0.12 | Fast build tool and development server |
| React Router | 7.15.1 | Client-side routing for SPA navigation |
| Tailwind CSS | 4.3.0 | Utility-first CSS framework for styling |
| Axios | 1.16.1 | HTTP client for API requests |
| Lucide React | 1.16.0 | Icon library for modern SVG icons |
| clsx & tailwind-merge | 3.x | Conditional CSS class name utilities |

## Running the Application

### You must have:

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Backend API running at `http://127.0.0.1:5001`

### Installation

```bash
# Navigate to the Frontend directory
cd Frontend

#Install all dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.



## Project Structure

```
Frontend/
├── public/                
│   └── favicon.png
├── src/
│   ├── api/                    # API layer
│   │   ├── client.js               # Axios instance with JWT interceptor
│   │   ├── index.js                # Duplicate axios config (TODO: remove)
│   │   └── services.js             # Organized API endpoints
│   ├── components/                 # Reusable UI components
│   │   ├── Layout.jsx               # Page wrapper with background
│   │   ├── Navbar.jsx              # Navigation bar with links
│   │   └── TestConnection.jsx      # Backend connectivity tester
│   ├── context/                    # React Context state management
│   │   ├── AuthContext.jsx         # Authentication provider
│   │   └── UserContext.jsx         # User data provider
│   ├── Pages/                      # Route-level components
│   │   ├── Dashboard.jsx           # Main dashboard with live stats
│   │   ├── Departments.jsx         # Department CRUD operations
│   │   ├── Login.jsx               # Authentication page
│   │   ├── Register.jsx            # New user registration
│   │   ├── Reports.jsx             # Report generation interface
│   │   ├── Students.jsx            # Student/device management
│   │   ├── StudentProfile.jsx      # Individual student view
│   │   ├── TeacherProfile.jsx      # Faculty profile page
│   │   └── TeacherDashboard.jsx    # Alternative dashboard
│   ├── App.jsx             # Root component with routes
│   └── main.jsx            # React entry point
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
└── package.json            # Project dependencies
```

## Pages & Features

### Login (`/login`)
- User authentication with email and password
- JWT token stored in localStorage via AuthContext
- Form validation and error handling
- Links to registration page

### Register (`/register`)
- Faculty account creation
- Fields: first name, last name, institutional email, password
- Redirects to login on success

### Dashboard (`/`)
- **Attendance Statistics**: Shows total registered, present today, absent today
- **Live Attendance Feed**: Polling-based updates every 5 seconds
- Displays student name, MAC address, timestamp, and status
- Auto-refreshes without manual reload

### Departments (`/departments`)
- View all academic departments in a card grid
- Add new departments with name, code, and description
- Data persisted to backend API
- Success/error feedback

### Reports (`/reports`)
- Generate attendance reports by department
- Report types: Departmental Summary, Weekly Analysis, Monthly Audit
- Download reports as CSV files
- View historical report list with average attendance percentages

### Students (`/students`)
- List and search registered students
- Create new student records with MAC addresses
- Edit and delete existing records
- Filters by name/email search

## API Layer

The API layer in `src/api/` handles all backend communication:

### `client.js`
- Creates an Axios instance with baseURL `http://127.0.0.1:5001`
- Adds JWT token from localStorage to all requests automatically
- Standard JSON content-type headers

### `services.js`
Exports organized service objects:
- `authService`: `register()`, `login()`
- `studentService`: `getAll()`, `create()`, `update()`, `delete()`
- `deptService`: `getAll()`


## State Management

### AuthContext
Provides authentication state throughout the app:
- `token`: JWT access token from localStorage
- `user`: User object from localStorage  
- `login()`: Store token and user data
- `logout()`: Clear all auth data
- `fetchWithAuth()`: Helper for authenticated fetch requests

### UserContext
Simple user state provider (partially overlaps with AuthContext):
- `user`: Current user object
- `setUser()`: Update user data

## Routing

Routes are defined in `App.jsx`:
- `/login` - Public, redirects to `/` if already logged in
- `/register` - Public page
- `/` - Protected, redirects to `/login` if not authenticated
- `/departments` - Protected
- `/reports` - Protected
- `/students` - Protected

## Backend API Requirements

The frontend expects a REST API at `http://127.0.0.1:5001` with these endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/login` | Authenticate user, returns token |
| POST | `/auth/register` | Create new faculty account |
| GET | `/students` | List all students |
| POST | `/students` | Create student record |
| PUT | `/students/:id` | Update student |
| DELETE | `/students/:id` | Delete student |
| GET | `/departments` | List departments |
| POST | `/departments` | Create department |
| GET | `/attendance/stats` | Dashboard statistics |
| GET | `/attendance/live` | Live attendance feed |
| GET | `/reports` | List all reports |
| POST | `/reports/generate` | Generate new report |
| GET | `/reports/:id/export` | Download CSV |

## Environment Variables

No `.env` file currently exists. The API URL is hardcoded in `src/api/client.js`. Consider moving to environment variables for:
- API base URL
- Development/production configuration