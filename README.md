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
├── Frontend/                 # React + Vite Application
│   ├── public/               # Static assets
│   ├── src/                  # Application source code
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/              # Utility functions and axios config
│   │   ├── pages/            # Page components (Dashboards, Login, etc.)
│   │   ├── App.jsx           # Main application component & routes
│   │   └── main.jsx          # Entry point
│   ├── Dockerfile            # Docker image configuration for frontend
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
├── Backend/                  # Node.js + Express API
│   ├── config/               # Database configuration (db.js)
│   ├── controllers/          # Route controllers (auth, leave, reimbursement)
│   ├── middleware/           # Custom middleware (auth, error, role)
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routes
│   ├── Dockerfile            # Docker image configuration for backend
│   ├── server.js             # Entry point
│   └── package.json          # Backend dependencies
├── AWS_DEPLOYMENT_GUIDE.md   # Detailed guide for AWS deployment
├── docker-compose.yml        # Docker Compose configuration for multi-container setup
├── Jenkinsfile               # Jenkins CI/CD Pipeline configuration
└── README.md                 # Project overview
```

## System Workflow
1. **Authentication:** Users register/login. The system assigns roles (`Admin`, `Manager`, `Employee`) and provisions JWT tokens.
2. **Employee Flow:** Employees access their dashboard to view their status, apply for leaves, and submit reimbursements (with receipt uploads).
3. **Manager Flow:** Managers view their team's pending requests. They can approve or reject leaves and reimbursements for their team members.
4. **Admin Flow:** Admins have full system access. They can manage all users, oversee all leaves, and handle all reimbursement requests across the entire organization.

## API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /check-email` - Verify if email exists and its role
- `POST /register` - Register a new user
- `POST /login` - Authenticate user & get token
- `GET /me` - Get current user profile
- `GET /users`, `PUT /users/:id`, `DELETE /users/:id` - Admin user management

### Leaves (`/api/leaves`)
- `POST /` - Apply for leave
- `GET /my`, `GET /pending`, `GET /` - Fetch user's leaves, pending leaves, or all leaves
- `PUT /:id/approve`, `PUT /:id/reject`, `DELETE /:id` - Update leave status

### Reimbursements (`/api/reimbursements`)
- `POST /` - Submit a reimbursement (multipart/form-data)
- `GET /my`, `GET /pending`, `GET /` - Fetch user's reimbursements, pending ones, or all
- `PUT /:id/approve`, `PUT /:id/reject`, `DELETE /:id` - Update reimbursement status

## Features
- **Role-Based Access Control**: Separate flows and capabilities for Admin, Manager, and Employee roles.
- **Leave Management**: Employees can apply for leaves, and managers/admins can approve or reject them.
- **Reimbursement Tracking**: Complete workflow for submitting and approving expense reimbursements.
- **Theming**: Dark and Light mode support across the entire interface.
- **Interactive Dashboards**: Data visualization and quick actions tailored to each user role.

## CI/CD Pipeline & Deployment

The application is fully containerized using **Docker** and managed by a **Jenkins CI/CD Pipeline**, deployed on an **AWS EC2** instance.

### Docker Configuration
- **Backend**: Containerized using a custom Dockerfile, exposed on port 5000. Uses a named volume `backend_uploads` for persistent storage of uploaded files (e.g., reimbursement receipts).
- **Frontend**: Containerized using a custom Dockerfile, exposed on port 5173.

The multi-container setup is orchestrated using `docker-compose.yml`.

### Jenkins Pipeline (`Jenkinsfile`)
The CI/CD pipeline automates the entire deployment process:
1. **Checkout**: Automatically pulls the latest code from the GitHub repository using SCM webhook triggers.
2. **Build and Deploy**: 
   - Securely injects production environment variables using Jenkins Credentials (`backend-env-file`) into `Backend/.env`.
   - Creates the `Frontend/.env` dynamically with the production API base URL.
   - Rebuilds and restarts the Docker containers in detached mode using `docker compose up -d --build`.
3. **Verify Deployment**: Validates the deployment by checking the running Docker containers.

### Live Access
- **Application URL:** [http://13.48.56.48:5173](http://13.48.56.48:5173)
- **API Base URL:** [http://13.48.56.48:5000](http://13.48.56.48:5000)


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
