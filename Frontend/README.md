# Employee Management System - Frontend

## Overview
This is the frontend application for the Employee Management System. It provides a responsive, modern, and interactive user interface for employees, managers, and administrators to interact with the system.

## Tech Stack
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Charts/Data Visualization**: Recharts
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## Folder Structure
```text
Frontend/
├── public/           # Static files not processed by Webpack/Vite
├── src/
│   ├── components/   # Reusable UI components (buttons, modals, layout parts)
│   ├── lib/          # Utilities and Axios instance configurations
│   ├── pages/        # Main route views (AdminDashboard, EmployeeDashboard, etc.)
│   ├── App.jsx       # Routing setup (React Router)
│   └── main.jsx      # React entry point and context providers
└── vite.config.js    # Vite bundling and development server setup
```

## User Workflow
1. **Login/Registration:** Users authenticate. The frontend receives a JWT and role mapping, redirecting them to their respective dashboard (`/employee-dashboard`, `/manager-dashboard`, or `/admin-dashboard`).
2. **Employee:** From their dashboard, employees can quickly see leave summaries, apply for new leaves, add reimbursement requests (with bill images), and view request statuses.
3. **Manager:** Managers have access to additional views showing pending requests from their specific team members, allowing quick approve/reject actions.
4. **Admin:** Admins get a comprehensive view of all system users, all leaves, and all reimbursements, with full rights to delete users or overturn statuses.

## API Integration Points
The Frontend consumes the backend REST API:
- **Authentication:** Maps to `/api/auth/*` (Login, Register, Role checks, User CRUD for Admins).
- **Leaves:** Maps to `/api/leaves/*` (Applying, fetching specific/all leaves, approving/rejecting).
- **Reimbursements:** Maps to `/api/reimbursements/*` (Submitting multipart form data, fetching, approving/rejecting).

## Key Features
- **Role-Specific Dashboards**: Tailored views for `Admin`, `Manager`, and `Employee` roles.
- **Responsive Design**: fully functional across mobile, tablet, and desktop devices.
- **Dark Mode**: Built-in theme toggling for enhanced accessibility and visual preference.
- **Secure Authentication UI**: Login and registration forms with proper validation and role routing.

## Development Setup

### Installation
1. Ensure you have Node.js installed.
2. Navigate to this directory (`/Frontend`).
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Application
To start the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will typically be available at `http://localhost:5173`.

### Building for Production
To create an optimized production build:
```bash
npm run build
```
The output will be placed in the `dist/` directory.

### Linting
To check for code quality and style issues:
```bash
npm run lint
```
