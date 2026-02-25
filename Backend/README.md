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
