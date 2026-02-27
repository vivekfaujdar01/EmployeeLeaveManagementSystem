# Employee Management System - Backend

## Overview
This is the backend HTTP API for the Employee Management System. It handles all business logic, database interactions, authentication, and authorization for the application.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File Uploads**: Multer
- **Error Handling**: express-async-errors

## Folder Structure
```text
Backend/
├── config/           # Database setup and configurations
├── controllers/      # Route logic (auth, leaves, reimbursements)
├── middleware/       # Express middlewares (JWT auth validation, role authorization, error handling)
├── models/           # Mongoose schemas representing MongoDB collections
├── routes/           # Express router definitions mapping endpoints to controllers
├── uploads/          # Locally stored images/receipts for reimbursements
└── server.js         # Express app entry point
```

## Core Workflow
1. **Database Connection:** Connects to MongoDB via Mongoose before starting the app.
2. **Authentication:** Uses bcryptjs for password hashing and issues JWTs for state management.
3. **Role Validation:** Middleware restricts specific routes (`authorize('admin', 'manager')`).
4. **File Uploads:** Intercepts `multipart/form-data` with Multer to save receipt images to `/uploads`.

## API Endpoints

### Auth Routes (`/api/auth`)
- `POST /check-email` - Check if an email has admin privileges
- `POST /register` - Create a new user
- `POST /login` - Authenticate and return JWT
- `GET /me` - Get logged-in user details
- `GET /users` - (Admin) Get all users
- `PUT /users/:id` - (Admin) Update user role/info
- `DELETE /users/:id` - (Admin) Delete a user

### Leave Routes (`/api/leaves`)
- `POST /` - Apply for a new leave
- `GET /my` - Get current user's leave history
- `GET /pending` - (Manager/Admin) Get pending leaves
- `GET /` - (Admin) Get all leaves
- `PUT /:id/approve` - (Manager/Admin) Approve a leave
- `PUT /:id/reject` - (Manager/Admin) Reject a leave
- `DELETE /:id` - Cancel/Delete a leave

### Reimbursement Routes (`/api/reimbursements`)
- `POST /` - Submit reimbursement (Uploads `billImage`)
- `GET /my` - Get current user's submitted reimbursements
- `GET /pending` - (Manager/Admin) Get pending reimbursements
- `GET /` - (Admin) Get all reimbursements
- `PUT /:id/approve` - (Manager/Admin) Approve reimbursement
- `PUT /:id/reject` - (Manager/Admin) Reject reimbursement
- `DELETE /:id` - Delete reimbursement

## Key Features
- **RESTful API**: Clean and structured endpoints for managing users, leaves, and reimbursements.
- **JWT Authentication**: Secure stateless session management.
- **Role-Based Middleware**: Route protection based on `Admin`, `Manager`, and `Employee` roles.
- **Robust Validation**: Enforced schemas and data integrity checks.
- **File Handling**: Support for uploading and serving documents/receipts (via Multer).

## Initial Setup

### Prerequisites
- Node.js installed on your machine.
- A running MongoDB instance (local or Atlas cluster).

### Environment Variables
Create a `.env` file in the root of the `Backend` directory containing necessary configuration such as:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Further configurations (e.g., file upload destinations)
```

### Installation
1. Navigate to this directory (`/Backend`).
2. Install the required dependencies:
   ```bash
   npm install
   ```

## Running the Server

### Development Mode
To start the server with nodemon (which automatically restarts upon file changes):
```bash
npm run dev
```

### Production Mode
To start the standard Node server:
```bash
npm start
```
