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
