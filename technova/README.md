# Tarkko Solutions 🚀

A modern, full-stack, enterprise-grade Technology Services Marketplace and Agency Platform. Tarkko bridges the gap between clients and technical solutions by offering services ranging from Custom Software Development to AI integration and Cloud Architecture.

## 🌟 Key Features

### 🧑‍💻 For Clients
- **Service Browsing & Purchasing**: Browse 16+ curated service categories (Web Dev, Mobile Apps, AI/ML, Cloud, Marketing, etc.).
- **AI-Powered Scoping (Nova Assistant)**: An intelligent chatbot powered by OpenAI to help estimate project costs and requirements interactively.
- **Project Dashboard**: A dedicated portal to track active projects, payments, tasks, and file deliveries in real time.
- **Support Tickets**: A fully functional ticketing system for raising technical queries and tracking their resolutions.
- **Careers & Internships**: Users can browse and apply for jobs and internships posted by Tarkko.

### 🛡️ For Administrators
- **Unified Admin Dashboard**: Track overall KPIs, revenue, active projects, and user registrations through dynamic charts.
- **Order & Project Management**: Move user orders through various stages (Scoping, In Progress, Review, Completed) and assign tasks.
- **Service & Portfolio Management**: Dynamically add new services, update pricing, and showcase successful case studies in the Portfolio.
- **Lead CRM**: A centralized CRM to manage inbound leads, track statuses, and send automated email responses.
- **User Management**: Control roles (Admin, Client, Team) and manage permissions.

### ⚡ Technical Highlights
- **Real-Time Updates**: Instant notifications across the app utilizing Socket.io.
- **Secure Authentication**: JWT-based authentication combined with Google OAuth integration (Passport.js).
- **Payment Processing**: Seamless integration with Razorpay for handling service checkouts and custom milestone payments.
- **Responsive UI/UX**: Built with React, Tailwind CSS, and Framer Motion for a stunning, glassmorphic, mobile-first design.
- **File Management**: Cloudinary integration for handling profile pictures, portfolio assets, and project file uploads.

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework**: React 18 + Vite
- **State Management**: Redux Toolkit (RTK)
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Routing**: React Router DOM v6
- **Forms & Validation**: React Hook Form, Yup
- **Charts**: Recharts
- **Drag-and-Drop**: @hello-pangea/dnd

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: Passport.js, JSON Web Tokens (JWT), bcryptjs
- **Real-Time Communication**: Socket.io
- **Emails**: Nodemailer, Resend
- **File Storage**: Cloudinary, Multer
- **AI Integration**: OpenAI API
- **Payments**: Razorpay
- **Security**: Helmet, Express Rate Limit, CORS

---

## 🚀 Quick Start Guide

### Prerequisites
Before running the application, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (local instance or MongoDB Atlas URI)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd technova
```

### 2. Backend Setup
```bash
# Navigate to the server directory
cd server

# Install backend dependencies
npm install

# Configure Environment Variables
cp .env.example .env
```
Open the `.env` file and fill in the necessary keys (MongoDB URI, JWT Secret, Cloudinary credentials, Razorpay keys, OpenAI API key, etc.).

```bash
# Seed the database with initial categories, services, and roles
npm run seed

# Start the development server (runs on http://localhost:5000 by default)
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
# Navigate to the client directory
cd client

# Install frontend dependencies
npm install

# Configure Environment Variables
# Create a .env file based on .env.example if required, setting VITE_API_URL to the backend URL.

# Start the frontend development server
npm run dev
```
The application should now be running locally at `http://localhost:5173`.

---

## 📂 Project Structure

```
technova/
├── client/                 # React Frontend
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Reusable UI components (Layout, Modals, Forms)
│       ├── data/           # Hardcoded datasets and placeholder data
│       ├── hooks/          # Custom React hooks (Socket, Auth, UI state)
│       ├── pages/          # Route-based views
│       │   ├── admin/      # Admin dashboard pages
│       │   ├── auth/       # Login, Register, Forgot Password
│       │   ├── public/     # Homepage, Services, Portfolio, Blog, Contact
│       │   └── user/       # Client dashboard pages
│       ├── redux/          # Redux slices and store configuration
│       ├── routes/         # Protected and Admin route wrappers
│       ├── services/       # Axios API client services
│       └── App.jsx         # Main application entry point
│
├── server/                 # Express.js Backend
│   ├── config/             # DB connection, Cloudinary setup, Passport config
│   ├── controllers/        # Route logic and request handlers
│   ├── middleware/         # Auth, Error handling, Upload middleware
│   ├── models/             # Mongoose schemas (User, Project, Service, Ticket...)
│   ├── routes/             # Express API routes definition
│   ├── seeds/              # Database seeding scripts
│   ├── services/           # External service logic (OpenAI, Email)
│   ├── socket/             # Socket.io event handlers
│   └── server.js           # Backend entry point
│
└── README.md               # You are here!
```

---

## 🔒 Default Credentials
After running the seed script (`npm run seed`), the following accounts will be created for testing purposes:

- **Admin Account**: 
  - Email: `admin@tarkko.com`
  - Password: `password123`
- **Test Client Account**:
  - Email: `client@tarkko.com`
  - Password: `password123`

---

## 📝 License
This project is proprietary and confidential. Unauthorized copying, distribution, or modification of this repository is strictly prohibited. 
&copy; Tarkko Solutions. All rights reserved.
