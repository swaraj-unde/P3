# CampBoard

A modern project management and team collaboration backend built with Node.js, Express.js, and MongoDB. CampBoard provides secure authentication, role-based access control, project management, task tracking, subtasks, notes, file attachments, and team collaboration features through a scalable RESTful API.

---

## 🚀 Features

### Authentication & Authorization

* User registration with email verification
* Secure JWT authentication
* Access & refresh token mechanism
* Forgot password & password reset
* Change password functionality
* Role-based access control (RBAC)
* Secure logout support

### Project Management

* Create, update, and delete projects
* View project details
* List all accessible projects
* Track project members
* Project-level permissions

### Team Management

* Invite members via email
* Assign project roles
* Update member permissions
* Remove members from projects

### Task Management

* Create and assign tasks
* Update task status
* Delete tasks
* Upload multiple task attachments
* Track task progress

### Subtask Management

* Create subtasks
* Update completion status
* Delete subtasks
* Member-level completion tracking

### Notes Management

* Create project notes
* View project documentation
* Update notes
* Delete notes

### System Monitoring

* Health check endpoint
* API status monitoring

---

# 🛠 Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt
* Nodemailer
* Multer
* Express Validator

## Development Tools

* Nodemon
* Prettier
* ESLint

---

# 📁 Project Structure

```bash
src
│
├── controllers
│   ├── auth.controller.js
│   ├── project.controller.js
│   ├── task.controller.js
│   ├── note.controller.js
│   └── healthcheck.controller.js
│
├── models
│   ├── user.model.js
│   ├── project.model.js
│   ├── projectMember.model.js
│   ├── task.model.js
│   ├── subtask.model.js
│   └── note.model.js
│
├── routes
│   ├── auth.routes.js
│   ├── project.routes.js
│   ├── task.routes.js
│   ├── note.routes.js
│   └── healthcheck.routes.js
│
├── middlewares
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   ├── upload.middleware.js
│   └── validation.middleware.js
│
├── validators
│
├── utils
│
├── db
│
├── app.js
└── index.js
```

---

# ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd campboard
```

### Install Dependencies

```bash
npm install
```

### Create Environment Variables

```bash
cp .env.example .env
```

---

# 🔑 Environment Variables

```env
# Server
PORT=8000
NODE_ENV=development
CORS_ORIGIN=*

# Database
MONGODB_URI=mongodb://localhost:27017/campboard

# JWT
ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d

# Email
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_password

# URLs
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:8000
```

---

# ▶️ Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

Server will start on:

```bash
http://localhost:8000
```

---

# 🌐 API Endpoints

## Base URL

```bash
/api/v1
```

---

## Authentication Routes

| Method | Endpoint                        | Description               |
| ------ | ------------------------------- | ------------------------- |
| POST   | /auth/register                  | Register user             |
| POST   | /auth/login                     | Login user                |
| POST   | /auth/logout                    | Logout user               |
| GET    | /auth/current-user              | Get current user          |
| POST   | /auth/change-password           | Change password           |
| POST   | /auth/refresh-token             | Refresh access token      |
| GET    | /auth/verify-email/:token       | Verify email              |
| POST   | /auth/forgot-password           | Forgot password           |
| POST   | /auth/reset-password/:token     | Reset password            |
| POST   | /auth/resend-email-verification | Resend verification email |

---

## Project Routes

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| GET    | /projects            | Get user projects |
| POST   | /projects            | Create project    |
| GET    | /projects/:projectId | Get project       |
| PUT    | /projects/:projectId | Update project    |
| DELETE | /projects/:projectId | Delete project    |

---

## Member Routes

| Method | Endpoint                             |
| ------ | ------------------------------------ |
| GET    | /projects/:projectId/members         |
| POST   | /projects/:projectId/members         |
| PUT    | /projects/:projectId/members/:userId |
| DELETE | /projects/:projectId/members/:userId |

---

## Task Routes

| Method | Endpoint                    |
| ------ | --------------------------- |
| GET    | /tasks/:projectId           |
| POST   | /tasks/:projectId           |
| GET    | /tasks/:projectId/t/:taskId |
| PUT    | /tasks/:projectId/t/:taskId |
| DELETE | /tasks/:projectId/t/:taskId |

---

## Subtask Routes

| Method | Endpoint                             |
| ------ | ------------------------------------ |
| POST   | /tasks/:projectId/t/:taskId/subtasks |
| PUT    | /tasks/:projectId/st/:subTaskId      |
| DELETE | /tasks/:projectId/st/:subTaskId      |

---

## Note Routes

| Method | Endpoint                    |
| ------ | --------------------------- |
| GET    | /notes/:projectId           |
| POST   | /notes/:projectId           |
| GET    | /notes/:projectId/n/:noteId |
| PUT    | /notes/:projectId/n/:noteId |
| DELETE | /notes/:projectId/n/:noteId |

---

## Health Check

| Method | Endpoint     |
| ------ | ------------ |
| GET    | /healthcheck |

---

# 🔒 Role-Based Access Control

| Feature               | Admin | Project Admin | Member |
| --------------------- | ----- | ------------- | ------ |
| Create Project        | ✅     | ❌             | ❌      |
| Update Project        | ✅     | ❌             | ❌      |
| Delete Project        | ✅     | ❌             | ❌      |
| Manage Members        | ✅     | ❌             | ❌      |
| Create Tasks          | ✅     | ✅             | ❌      |
| Update Tasks          | ✅     | ✅             | ❌      |
| Delete Tasks          | ✅     | ✅             | ❌      |
| View Tasks            | ✅     | ✅             | ✅      |
| Create Subtasks       | ✅     | ✅             | ❌      |
| Delete Subtasks       | ✅     | ✅             | ❌      |
| Update Subtask Status | ✅     | ✅             | ✅      |
| Create Notes          | ✅     | ❌             | ❌      |
| Update Notes          | ✅     | ❌             | ❌      |
| Delete Notes          | ✅     | ❌             | ❌      |
| View Notes            | ✅     | ✅             | ✅      |

---

# 🗄 Database Models

## User

```js
{
  fullName,
  email,
  password,
  avatar,
  isEmailVerified,
  refreshToken
}
```

## Project

```js
{
  name,
  description,
  createdBy
}
```

## ProjectMember

```js
{
  project,
  user,
  role
}
```

## Task

```js
{
  title,
  description,
  status,
  assignedTo,
  attachments,
  project
}
```

## Subtask

```js
{
  title,
  completed,
  task
}
```

## Note

```js
{
  content,
  project,
  createdBy
}
```

---

# 📂 File Uploads

CampBoard supports multiple file attachments on tasks.

Supported metadata:

* File URL
* Original file name
* MIME type
* File size

Uploads are handled using Multer middleware.

---

# 🛡 Security Features

* JWT Authentication
* Refresh Token Rotation
* Password Hashing with Bcrypt
* Email Verification
* Password Reset Tokens
* Request Validation
* Role-Based Authorization
* Secure File Upload Handling
* CORS Protection

---

# ❌ Error Handling

Standardized API responses:

```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

HTTP Status Codes:

* 400 Bad Request
* 401 Unauthorized
* 403 Forbidden
* 404 Not Found
* 500 Internal Server Error

---

# 🔮 Future Enhancements

* Real-time notifications using Socket.IO
* Kanban board support
* Activity logs
* Project analytics dashboard
* Advanced task filtering
* Due dates and reminders
* Team chat integration
* API rate limiting
* Two-factor authentication (2FA)

---

# 👨‍💻 Author

**Swaraj Unde**

---
