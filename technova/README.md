# Tarkko / TechNova - Enterprise Technology Services Platform

Welcome to the ultimate all-in-one technology services marketplace, agency dashboard, and multi-vendor partner network. This platform allows clients to purchase services, collaborate on projects in real-time, and allows admins to manage internal teams or outsource work automatically via an AI-driven matching engine.

For a deep dive into how every single feature works, please refer to the [FEATURES_GUIDE.md](./FEATURES_GUIDE.md).

## 🚀 Tech Stack

**Frontend:**
- React (Vite)
- TailwindCSS (Styling)
- Redux Toolkit (State Management)
- Framer Motion (Animations)
- React Router DOM (Routing)
- Razorpay (Payments UI)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database)
- JSON Web Tokens (Authentication)
- OpenAI API (AI Meeting Summaries & Partner Matching)
- Cloudinary / Multer (File Uploads)
- Nodemailer / Resend (Email Automation)

---

## ⚙️ Installation & Local Setup

### 1. Clone & Install Dependencies
Since this is a decoupled mono-repo structure, you need to install dependencies in both the `client` and `server` directories.

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Environment Variables
Create a `.env` file inside the `server/` directory and populate it with the following keys:

```env
# Server Config
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/technova

# Authentication
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
COOKIE_EXPIRE=30

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Features
OPENAI_API_KEY=sk-your-openai-key

# Payments (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Emails (Resend)
RESEND_API_KEY=re_your_resend_key
EMAIL_FROM=noreply@yourdomain.com
```

### 3. Run the Development Servers
Open two separate terminal windows.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

---

## 🌍 Production Deployment (Render)

If deploying the entire platform as a single **Web Service** on Render, use the following configuration:

- **Root Directory:** `.` *(leave blank)*
- **Build Command:** 
  ```bash
  cd server && npm install && cd ../client && npm install && npm run build
  ```
- **Start Command:** 
  ```bash
  cd server && npm start
  ```
- Make sure to set `NODE_ENV=production` in your Render Environment Variables. This tells the Express server to serve the compiled React static files from `client/dist`.

---

## 📂 Project Structure

```text
technova/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Modals, etc.)
│   │   ├── pages/          # Full route pages divided by role (admin, user, public, partner)
│   │   ├── redux/          # Redux slices (auth, services, orders)
│   │   ├── routes/         # Protected route guards (AdminRoute, PartnerRoute)
│   │   └── services/       # Axios API interceptors
│   └── package.json
│
├── server/                 # Express Backend
│   ├── config/             # DB & Passport config
│   ├── controllers/        # Business logic for all routes
│   ├── middleware/         # Auth, Roles, Uploads, Rate Limiting
│   ├── models/             # Mongoose Schemas (User, Project, Partner, etc.)
│   ├── routes/             # Express routing definitions
│   ├── services/           # External API integrations (OpenAI, Resend)
│   └── app.js              # Express app initialization
│
├── README.md               # You are here
└── FEATURES_GUIDE.md       # Detailed explanation of all features
```
