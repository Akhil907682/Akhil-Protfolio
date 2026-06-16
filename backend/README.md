# Portfolio Backend API - Akhil Singh

A robust, production-ready backend for a professional portfolio website built with **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, **JWT**, and **MVC Architecture**.

---

## Technical Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT) & Bcryptjs
- **Storage Integration**: Cloudinary API (with automatic local filesystem storage fallback)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Express Rate Limit, Mongo Sanitize

---

## Features

1. **Admin Authentication**: Secure JWT login and protected endpoints.
2. **Project CRUD**: Create, read, update, delete project items with automatic image uploads.
3. **Skills CRUD**: Manage professional skills with level categories and percentages.
4. **Education & Certifications CRUD**: Track degree credentials and professional certificates.
5. **Contact Messages API**: Secure message ingestion from forms with IP rate-limiting.
6. **Resume Management**: Secure uploads, dynamic active status tracking, and download redirections.
7. **Dashboard Statistics**: Aggregates visitor page views, unread messages, projects, and skills counts.

---

## Folder Structure

```
backend/
├── scripts/
│   └── seedAdmin.js       # Administrative seeding script
├── src/
│   ├── config/
│   │   ├── db.js          # MongoDB database connection configuration
│   │   └── cloudinary.js  # Multer and Cloudinary config
│   ├── controllers/       # Route request & business logic handlers
│   ├── middleware/        # Security, auth, & centralized error controllers
│   ├── models/            # Mongoose schemas & data representations
│   ├── routes/            # REST API route declarations
│   ├── validations/       # Request validation rules using express-validator
│   ├── utils/             # Express operational wrappers
│   └── app.js             # Express application assembly
├── server.js              # Entrypoint server execution script
├── .env                   # Environment variables
├── .gitignore             # Git ignored patterns
└── package.json           # Application dependencies and execution scripts
```

---

## Environment Variables Configuration

Create a `.env` file in the root of the `backend/` directory with the following variables:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<db-name>

# JWT Authentication
JWT_SECRET=your_super_long_custom_jwt_secret_key
JWT_EXPIRE=24h

# Cloudinary (Optional - Fallback to local files under backend/uploads/ if empty)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Initial Seed Credentials
SEED_ADMIN_NAME="Akhil Singh"
SEED_ADMIN_EMAIL=akhils88815@gmail.com
SEED_ADMIN_PASSWORD=akhils9076_admin
```

---

## Installation & Execution

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Seed Administrative User**:
   Before logging in, seed the default administrator account from `.env`:
   ```bash
   npm run seed:admin
   ```

4. **Run Server in Development Mode**:
   ```bash
   npm run dev
   ```

5. **Run Server in Production Mode**:
   ```bash
   npm start
   ```

---

## REST API Specification

All API requests should be prefixed with `/api`. Protected routes require a valid JWT token sent in the headers as: `Authorization: Bearer <JWT_TOKEN>`.

### 1. Authentication

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Login as administrator, returns JWT token | Public |
| `GET` | `/auth/me` | Fetch active logged-in administrator details | Admin |

**Login Body (`POST /api/auth/login`)**:
```json
{
  "email": "akhils88815@gmail.com",
  "password": "akhils9076_admin"
}
```

---

### 2. Dashboard Analytics

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard/stats` | Retrieve counting stats (visitors, projects, messages) | Admin |

**Response Format**:
```json
{
  "success": true,
  "stats": {
    "totalVisitors": 42,
    "totalMessages": 15,
    "unreadMessages": 3,
    "totalProjects": 8,
    "totalSkills": 12,
    "totalEducation": 2,
    "totalCertifications": 5
  },
  "recentMessages": [ ... ]
}
```

---

### 3. Projects API

| Method | Endpoint | Description | Authentication | Content-Type |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/projects` | Retrieve all projects sorted by display order | Public | Application/JSON |
| `GET` | `/projects/:id` | Fetch details of a single project | Public | Application/JSON |
| `POST` | `/projects` | Create a new project item | Admin | Multipart/Form-Data |
| `PUT` | `/projects/:id` | Update project details and/or image | Admin | Multipart/Form-Data |
| `DELETE` | `/projects/:id` | Remove a project and purge its uploaded file | Admin | Application/JSON |

**Multipart Request Fields (`POST / PUT /api/projects`)**:
- `title` (String): e.g. `"Personal Portfolio Website"`
- `description` (String): e.g. `"Production ready backend..."`
- `technologies` (JSON Array or Comma-separated string): e.g. `["React", "Node", "MongoDB"]` or `"React, Node, MongoDB"`
- `githubLink` (String, Optional): valid URL
- `liveLink` (String, Optional): valid URL
- `featured` (Boolean, Optional): `true` or `false`
- `order` (Number, Optional): display rank `0`, `1`, etc.
- `image` (File binary): Attached image file

---

### 4. Technical Skills API

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `GET` | `/skills` | Retrieve all technical skills categorized | Public |
| `GET` | `/skills/:id` | Fetch details of a single skill | Public |
| `POST` | `/skills` | Add a new technical skill | Admin |
| `PUT` | `/skills/:id` | Update skill proficiency or category | Admin |
| `DELETE` | `/skills/:id` | Delete a skill entry | Admin |

**Request Body (`POST / PUT /api/skills`)**:
```json
{
  "name": "Node.js",
  "category": "Backend",
  "level": "Expert",
  "percentage": 92,
  "icon": "FaNodeJs"
}
```

---

### 5. Education History API

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `GET` | `/education` | Get academic background timeline | Public |
| `GET` | `/education/:id` | Fetch details of a single education entry | Public |
| `POST` | `/education` | Add education timeline record | Admin |
| `PUT` | `/education/:id` | Update education record details | Admin |
| `DELETE` | `/education/:id` | Delete education history record | Admin |

**Request Body (`POST / PUT /api/education`)**:
```json
{
  "institution": "State University",
  "degree": "Bachelor of Technology",
  "fieldOfStudy": "Computer Science",
  "startDate": "2022-08-01",
  "endDate": "2026-05-30",
  "current": false,
  "description": "Graduated with honors, focusing on software engineering."
}
```

---

### 6. Certifications API

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `GET` | `/certifications` | Retrieve all professional certifications | Public |
| `GET` | `/certifications/:id` | Fetch a single certification's details | Public |
| `POST` | `/certifications` | Log a new professional certification | Admin |
| `PUT` | `/certifications/:id` | Edit details of a certification record | Admin |
| `DELETE` | `/certifications/:id` | Delete a certification record | Admin |

**Request Body (`POST / PUT /api/certifications`)**:
```json
{
  "name": "AWS Certified Solutions Architect",
  "issuingOrganization": "Amazon Web Services",
  "issueDate": "2025-06-15",
  "expirationDate": "2028-06-15",
  "credentialId": "AWS-ASA-12345",
  "credentialUrl": "https://aws.amazon.com/verification"
}
```

---

### 7. Contact Form Messages API

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `POST` | `/contacts` | Submit contact form inquiry (rate-limited by IP) | Public |
| `GET` | `/contacts` | Retrieve all incoming contact submissions | Admin |
| `PATCH` | `/contacts/:id` | Mark inquiry message as `unread`, `read`, or `archived` | Admin |
| `DELETE` | `/contacts/:id` | Delete inquiry message record | Admin |

**Request Body (`POST /api/contacts`)**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Collab Opportunity",
  "message": "Hi Akhil, I would love to collaborate with you on a React project."
}
```

---

### 8. Resume PDF Management API

| Method | Endpoint | Description | Content-Type | Authentication |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/resume` | Fetch active resume URL/metadata | Application/JSON | Public |
| `GET` | `/resume/download` | Initiates direct PDF download / redirection | Binary / Redirect | Public |
| `POST` | `/resume/upload` | Upload and activate new resume PDF file | Multipart/Form-Data | Admin |

**Multipart Request Field (`POST /api/resume/upload`)**:
- `resume` (File binary): PDF file upload.

---

## Security Practices Implemented

1. **Data Security**: Secure HTTP headers served via `helmet` guard against MIME sniffing, clickjacking, and XSS attacks.
2. **CORS Control**: Access is restricted strictly to permitted domain boundaries.
3. **API Rate Limiting**: Limit client abuse using `express-rate-limit`. The contact submission endpoint has strict limits (5 submissions per 15 minutes per IP) to prevent spam.
4. **NoSQL Query Injection Prevention**: Inputs are sanitized by `express-mongo-sanitize` to purge MongoDB query operators (like `$gt`, `$ne`).
5. **Input Sanitization**: Strong schema assertions using `express-validator` block malformed objects before reaching database adapters.
6. **Password Encryption**: Administrator credentials are encrypted using one-way cryptographic hashing (`bcryptjs`).
7. **JWT Protocol**: Secure authorization tokens sign administrator profiles without local cookie exposure.
