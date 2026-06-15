# TechNova Solutions

Full-stack Technology Services Marketplace & Agency Platform built on the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm

### Server Setup
```bash
cd technova/server
cp .env.example .env    # Edit .env with your values
npm install
npm run seed            # Seed categories, roles, and sample services
npm run dev             # Starts on http://localhost:5000
```

### Client Setup
```bash
cd technova/client
npm install
npm run dev             # Starts on http://localhost:5173
```

## Project Structure
```
technova/
├── client/          # React frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages (public, auth, user, admin)
│   │   ├── redux/        # Redux Toolkit store & slices
│   │   ├── services/     # API client (Axios)
│   │   └── routes/       # Route guards
│   └── ...
├── server/          # Express.js backend
│   ├── config/      # DB, Cloudinary, Passport configs
│   ├── models/      # 15 Mongoose models
│   ├── controllers/ # Request handlers
│   ├── routes/      # API route definitions
│   ├── middleware/   # Auth, error, upload middleware
│   ├── seeds/       # Database seed scripts
│   └── ...
└── README.md
```

## Tech Stack
- **Frontend**: React 18, Redux Toolkit, Tailwind CSS, Framer Motion, React Router
- **Backend**: Node.js, Express.js, JWT, Passport.js, Socket.io, Multer
- **Database**: MongoDB (Mongoose), Redis (optional)
- **Services**: Cloudinary, Razorpay/Stripe, OpenAI, SendGrid
