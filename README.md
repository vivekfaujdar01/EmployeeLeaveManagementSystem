# Employee Management System

## Overview
The Employee Management System is a comprehensive full-stack application designed to streamline internal company operations, including employee tracking, leave management, and reimbursement requests. It features role-based access control with distinct dashboards for Admins, Managers, and Employees.

## Architecture
This project is structured as a monorepo containing decoupled Frontend and Backend applications:
- **Frontend**: A modern React application built with Vite and styled using Tailwind CSS v4.
- **Backend**: A robust RESTful API built with Node.js, Express, and MongoDB.

## Project Structure
```text
Management/
├── Frontend/       # React + Vite application
├── Backend/        # Node.js + Express API
└── README.md       # Project overview
```

## Features
- **Role-Based Access Control**: Separate flows and capabilities for Admin, Manager, and Employee roles.
- **Leave Management**: Employees can apply for leaves, and managers/admins can approve or reject them.
- **Reimbursement Tracking**: Complete workflow for submitting and approving expense reimbursements.
- **Theming**: Dark and Light mode support across the entire interface.
- **Interactive Dashboards**: Data visualization and quick actions tailored to each user role.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB running locally or a MongoDB Atlas connection string

### Installation & Setup
1. **Clone the repository** (if applicable) or navigate to the project directory.
2. **Setup Backend**:
   - Navigate to the `Backend` directory: `cd Backend`
   - Install dependencies: `npm install`
   - Create a `.env` file based on the environment requirements (PORT, MONGO_URI, JWT_SECRET, etc.)
   - Start the development server: `npm run dev`
3. **Setup Frontend**:
   - Open a new terminal and navigate to the `Frontend` directory: `cd Frontend`
   - Install dependencies: `npm install`
   - Start the development server: `npm run dev`

### Usage
- Once both servers are running, open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).
- You can register a new account or log in with existing credentials to access the system.

## License
MIT License
