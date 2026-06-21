# Features Guide & Architecture Breakdown

This document provides a detailed, module-by-module explanation of how every single feature inside the TechNova platform functions, both from a UI/UX perspective and from the backend database architectural perspective.

---

## 1. Authentication & Role-Based Access Control (RBAC)
The platform uses JSON Web Tokens (JWT) for secure authentication and a robust Role-Based Access Control system.

- **How it works (Backend):** The `User` model references a `Role` collection. A user can be a `client`, `admin`, `super_admin`, or `staff`. The `authMiddleware.js` contains a `protect` function (to verify JWTs) and an `authorize('admin')` function to restrict routes.
- **How it works (Frontend):** Redux Toolkit (`authSlice.js`) holds the user state. Route guards (`AdminRoute.jsx`, `PartnerRoute.jsx`) wrap sensitive routes. If a non-admin tries to visit `/admin`, they are redirected to their respective dashboard.
- **SSO**: Google OAuth is integrated via Passport.js, allowing 1-click logins that automatically link to existing email accounts.

---

## 2. Dynamic Service Catalog
Admins can dynamically create, edit, and organize the services sold on the platform without touching the code.

- **Categories:** Services are grouped into Categories (e.g., "Web Development", "Marketing"). Categories can have icons and descriptions.
- **Services:** A service has a title, description, pricing tiers (Basic, Standard, Premium), delivery time, and feature lists.
- **UI:** The public `/services` page fetches these dynamically. Users can search and filter services based on categories.

---

## 3. Purchasing, Ordering & Finance
When a client purchases a service, a complex financial workflow initiates.

- **Checkout Flow:** Users select a tier and hit "Purchase". This creates an `Order` in the database with status `pending`.
- **Payment Gateway:** Razorpay is integrated for secure checkouts. Upon successful payment, a webhook (or frontend callback) marks the `Order` as `paid` and generates a corresponding `Project`.
- **Invoices:** An `Invoice` PDF is automatically generated upon payment, which the client can download from their dashboard.

---

## 4. Real-time Project Collaboration space
Once a service is paid for, a "Project" acts as the central hub for the client and the agency to collaborate.

- **Status Tracking:** Projects move through statuses (`planning`, `in_progress`, `review`, `completed`).
- **File Sharing (Attachments):** Clients and teams can upload files (images, docs) to the project. Files are hosted on Cloudinary.
- **Design Feedback Annotations:** Clients can click anywhere on an uploaded image to drop an "Annotation" (a comment pin). This coordinates X/Y positioning so the team knows exactly what pixel the client is talking about.
- **Internal Notes:** Admins can leave private notes on a project that the client cannot see.

---

## 5. Escrow & Milestone Contracts
For large enterprise clients, standard upfront payments aren't enough.

- **Contracts:** Admins can draft custom contracts with multiple Milestones (e.g., 25% Upfront, 50% Beta, 25% Launch).
- **Escrow Vault:** When a client pays a milestone, the money enters "Escrow". It is legally held in the platform until the client formally "Approves" the milestone deliverable, at which point the funds are released to the agency's balance.

---

## 6. Video Consultations & AI Summaries
The platform integrates video calling and Artificial Intelligence to streamline communication.

- **Booking a Call:** Clients can book a consultation via the `BookConsultation` interface. This generates a persistent Jitsi Meet video link (e.g., `meet.jit.si/TechNova-...`).
- **AI Meeting Summarizer:** After a meeting, admins can upload the audio recording (or a text transcript) to the Project Meetings tab. The backend sends this to the **OpenAI API (GPT-4)**, which analyzes the conversation and automatically generates:
  1. An Executive Summary
  2. Bulleted Action Items
  3. Key Decisions Made
  This saves hours of manual note-taking.

---

## 7. Multi-Vendor Marketplace (Partner Network)
Perhaps the most complex architectural feature. The platform allows the agency to outsource overflow work to verified external freelancers and partner agencies.

- **Application Pipeline:** Freelancers apply at `/partners/apply`. Admins review applications at `/admin/partners` and approve them, granting them "Verified Partner" status.
- **AI Matching Engine:** When an Admin looks at an unassigned Project, they can toggle to the "Partner Network" tab and click "Match Partners". The backend sends the project requirements and the skills of all verified partners to OpenAI. The AI returns a **Match Score (0-100%)** and reasoning for who the best fit is.
- **Isolated Partner Portal:** Partners have their own dedicated UI (`/partner-portal`). They only see the specific projects assigned to them. They have zero access to the admin CRM or client financial data.
- **Automated Commissions:** When a partner finishes a project (marked `completed`), the system calculates their cut based on their `commissionRate` (default 20%) and generates a `CommissionLedger` entry. Partners can track their pending and paid payouts via their portal.

---

## 8. SEO & Marketing Growth Engine
Built to ensure the platform generates inbound leads.

- **Industry Landing Pages:** Admins can dynamically generate highly-targeted landing pages (e.g., "Healthcare IT Solutions", "Real Estate Web Design"). These pages have unique SEO metadata and automatically pull in relevant portfolio case studies to increase conversion rates.
- **Referral Program:** Existing clients can generate a unique referral link. If a new user signs up via this link and makes a purchase, the system automatically credits the referrer's account with $50 in platform credit.
- **Dynamic Portfolios & Blogs:** A built-in CMS allows admins to post blogs and case studies to drive organic traffic.

---

## 9. Internship & Careers Management
The agency can recruit directly through the platform.

- **Admin Job Board:** Admins can post Internships or Full-Time Jobs.
- **Public Careers Page:** Students and professionals can browse active listings and submit applications along with their resume URLs and Cover Letters.
- **Applicant Tracking System (ATS):** Admins can review applicants and move them through stages (`Pending Review`, `Interviewing`, `Selected`, `Rejected`) directly from the Admin Dashboard.
