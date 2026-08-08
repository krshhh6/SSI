# 🔧 SAM Wheels — Bosch Authorized Service Centre

<p align="center">
  <img src="./local_pbwheels.png" alt="SAM Wheels Logo" width="120"/>
</p>

<p align="center">
  A full-stack, production-grade web application for <strong>SAM Wheels</strong>, an authorized Bosch Car Service centre.
  Built with <strong>Next.js 15</strong>, <strong>Firebase</strong>, and animated with Framer Motion + GSAP.
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs" alt="Next.js 15"/></a>
  <a href="https://firebase.google.com"><img src="https://img.shields.io/badge/Firebase-Firestore-orange?logo=firebase" alt="Firebase"/></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Hosted_on-Vercel-black?logo=vercel" alt="Vercel"/></a>
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS"/>
</p>

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Pages & Features](#pages--features)
5. [Getting Started (Local Dev)](#getting-started-local-dev)
6. [Environment Variables](#environment-variables)
7. [Firebase Setup](#firebase-setup)
8. [Security Architecture](#security-architecture)
9. [Admin Panel](#admin-panel)
10. [Deployment](#deployment)
11. [Client Handover](#client-handover)

---

## Project Overview

**SAM Wheels** is a multi-page marketing and booking website for a Bosch-authorized car service centre. Users can browse services, book an appointment, track their bookings, and leave reviews. An admin dashboard provides full CRUD capabilities for managing bookings, users, and analytics.

**Key business features:**
- 🌐 Public marketing website with hero, services, gallery, reviews, and sustainability pages
- 📅 Online booking system with form validation (synced to Firestore)
- 👤 User authentication (Email/Password + Google Sign-In — **Gmail-only**)
- 📊 Rich admin dashboard with booking management, charts, and CSV export
- 🔒 Firebase App Check + reCAPTCHA v3 for anti-spam/bot protection
- 💬 Floating contact widget and customer review system

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 + Vanilla CSS (CSS Variables) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) |
| **3D Graphics** | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) + Three.js |
| **Backend / DB** | [Firebase Firestore](https://firebase.google.com/docs/firestore) |
| **Auth** | [Firebase Authentication](https://firebase.google.com/docs/auth) (Google + Email) |
| **Security** | Firebase App Check + reCAPTCHA v3 |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Hosting** | [Vercel](https://vercel.com/) |

---

## Project Structure

```
bosch-sam-wheels/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home page (assembles Hero, Services, etc.)
│   │   ├── layout.tsx          # Root layout (fonts, theme, auth provider)
│   │   ├── globals.css         # Global CSS variables (colors, spacing, dark/light theme)
│   │   ├── admin/              # Admin dashboard route (/admin)
│   │   ├── booking/            # Booking form route (/booking)
│   │   ├── sign-in/            # Auth page (/sign-in)
│   │   ├── my-bookings/        # User's booking history (/my-bookings)
│   │   ├── services/           # Services info page
│   │   ├── gallery/            # Photo gallery
│   │   ├── blog/               # Blog page
│   │   ├── bosch-advantage/    # Bosch advantages info page
│   │   ├── why-different/      # Differentiators page
│   │   ├── sustainability/     # Sustainability page
│   │   └── privacy-policy/     # Privacy policy (DPDP compliance)
│   ├── components/             # All React components
│   │   ├── AdminClient.tsx     # Full admin dashboard (1200+ lines)
│   │   ├── Booking.tsx         # Booking form with Firestore integration
│   │   ├── Hero.tsx            # Animated homepage hero section
│   │   ├── Navbar.tsx          # Navigation bar (responsive)
│   │   ├── Footer.tsx          # Footer with links and car brand logos
│   │   ├── Services.tsx        # Services section
│   │   ├── Reviews.tsx         # Customer reviews / carousel
│   │   ├── Gallery.tsx         # Photo gallery grid
│   │   ├── SignInClient.tsx    # Sign-in / sign-up form (Gmail-restricted)
│   │   ├── MyBookingsClient.tsx# User booking history and feedback
│   │   ├── Contact.tsx         # Contact form
│   │   ├── FloatingContact.tsx # Sticky floating contact button (WhatsApp)
│   │   ├── ThemeProvider.tsx   # Dark/Light mode provider
│   │   └── ...                 # Other UI components
│   ├── context/
│   │   └── AuthContext.tsx     # Firebase auth state + Gmail domain restriction
│   ├── lib/
│   │   └── firebase.ts         # Firebase app init + App Check
│   ├── hooks/
│   │   └── useDebounce.ts      # Custom debounce hook (used in AdminClient)
│   └── middleware.ts           # Edge rate limiter (100 req/min per IP)
├── firestore.rules             # Firestore Security Rules (deployed to Firebase)
├── next.config.ts              # Security headers (CSP, HSTS, etc.)
├── handover_guide.md           # Step-by-step guide to transfer to client
├── AGENT_KNOWLEDGE.md          # Full project brain dump for AI agents/interns
├── package.json
└── .env.local                  # Local secrets (NOT committed to git)
```

---

## Pages & Features

| Route | Description | Auth Required |
|---|---|---|
| `/` | Home: Hero, Services, Reviews, CurvedLoop, Journey | No |
| `/booking` | Book a service appointment | Yes (Gmail) |
| `/my-bookings` | View & track your bookings, leave feedback | Yes (Gmail) |
| `/sign-in` | Login/Signup with Email or Google | No |
| `/admin` | Admin dashboard: all bookings, users, analytics | Admin only |
| `/services` | Detailed services breakdown | No |
| `/gallery` | Workshop photo gallery | No |
| `/blog` | Blog/news section | No |
| `/bosch-advantage` | Bosch certification benefits | No |
| `/why-different` | Why choose SAM Wheels | No |
| `/sustainability` | Eco-friendly practices | No |
| `/privacy-policy` | DPDP-compliant privacy policy | No |

---

## Getting Started (Local Dev)

### Prerequisites
- Node.js 20+
- npm 10+
- A Firebase project (see [Firebase Setup](#firebase-setup))

### 1. Clone the repository

```bash
git clone https://github.com/krshhh6/SSI.git
cd SSI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root (see [Environment Variables](#environment-variables) below).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Other scripts

```bash
npm run build   # Production build (Turbopack)
npm start       # Start production server locally
npm run lint    # Run ESLint
```

---

## Environment Variables

Create a `.env.local` file at the project root with these variables:

```env
# Google reCAPTCHA v3 Site Key (required for App Check)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_v3_site_key_here
```

> **Note:** The Firebase config (API keys, project IDs, etc.) is embedded directly in `src/lib/firebase.ts` since these are public-facing keys intended for the browser. The actual security is enforced by **Firestore Security Rules** and **Firebase App Check**, NOT by keeping these keys secret.

---

## Firebase Setup

The project uses the Firebase project named **`sam-wheels`**.

### Services Used
- **Firestore**: Main database for bookings, users, reviews, feedback
- **Firebase Authentication**: Email/Password + Google Sign-In (Gmail-only)
- **Firebase App Check**: Prevents unauthorized API access (paired with reCAPTCHA v3)

### Firestore Collections

| Collection | Purpose |
|---|---|
| `bookings` | All service appointments |
| `users` | User profile documents |
| `reviews` | Customer reviews shown on homepage |
| `feedback` | Post-service feedback from users |

### Deploying Firestore Security Rules

If you make changes to `firestore.rules`, deploy them:

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Authenticate and set the project
firebase login
firebase use sam-wheels

# Deploy only the rules
firebase deploy --only firestore:rules
```

---

## Security Architecture

This project implements **defense-in-depth** security at multiple layers:

### Layer 1: Gmail-Only Authentication

**File:** `src/components/SignInClient.tsx`  
The frontend validates that all email inputs end with `@gmail.com` before attempting Firebase authentication.

**File:** `src/context/AuthContext.tsx`  
The `onAuthStateChanged` listener enforces the Gmail restriction server-side. If a non-Gmail account somehow passes the frontend (e.g., via Google Workspace), they are immediately signed out:

```typescript
if (u.email && !u.email.toLowerCase().endsWith("@gmail.com")) {
  await signOut(auth);
  setUser(null);
  return;
}
```

### Layer 2: Firestore Security Rules

**File:** `firestore.rules`

- **`isAdmin()`**: Only `test01samwheels@gmail.com` is the admin. Change this before client handover.
- **`bookings`**: Users can only create their own bookings (with `status: "pending"`). Only admins can update/delete.
- **`users`**: Users can only read/write their own document and cannot self-assign `role: "admin"`.
- **`reviews`**: Public read, admin-only write.
- **`feedback`**: Users can create/read their own; admins can manage all.

### Layer 3: Firebase App Check (reCAPTCHA v3)

**File:** `src/lib/firebase.ts`  
App Check verifies that requests to Firebase come from the actual website (not scripts or bots). It's initialized client-side using reCAPTCHA v3.

### Layer 4: Rate Limiting Middleware

**File:** `src/middleware.ts`  
An Edge middleware rate-limits all `/api/*` routes to **100 requests/minute per IP**. Returns HTTP 429 on breach.

### Layer 5: HTTP Security Headers

**File:** `next.config.ts`  
All pages are served with:
- `X-Frame-Options: SAMEORIGIN` (clickjacking protection)
- `X-Content-Type-Options: nosniff` (MIME sniffing protection)
- `Strict-Transport-Security` (force HTTPS, 1 year)
- `Content-Security-Policy` (whitelist for Firebase, Google Fonts, reCAPTCHA)
- `Permissions-Policy` (no camera/mic/geo access)

---

## Admin Panel

**Route:** `/admin`  
**Access:** Only the email defined in `ADMIN_EMAIL` (`src/components/AdminClient.tsx`, line 23) can log in.

### Admin Features
- 📊 **Dashboard**: Stats cards (Total bookings, Revenue estimate, Users, Pending count)
- 📈 **Charts**: Bar chart (bookings by month), Pie chart (bookings by service/brand), Line chart (trend)
- 📋 **Bookings Table**: Filter by status/date, search by name/phone, update booking status
- 👥 **Users Table**: View all registered users, their booking count
- 💬 **Feedback**: View and manage customer feedback
- ⬇️ **CSV Export**: Download all bookings as a `.csv` file
- ➕ **Offline Bookings**: Admin can manually add bookings for walk-in customers
- 🔔 **Notification badge** for pending bookings

### Booking Statuses
| Status | Color | Meaning |
|---|---|---|
| `pending` | 🟡 Amber | Newly submitted, awaiting action |
| `confirmed` | 🔵 Blue | Admin confirmed the appointment |
| `on_track` | 🟣 Purple | Vehicle is currently being serviced |
| `completed` | 🟢 Green | Service done |
| `cancelled` | 🔴 Red | Booking was cancelled |

---

## Deployment

### Current Setup
The live site is deployed on **Vercel** and connected to the `krshhh6/SSI` GitHub repository. Every push to the `main` branch auto-deploys.

### Recommended Architecture (Production)
For maximum security and performance:
1. **Vercel** → hosts the Next.js app (free tier works)
2. **Cloudflare** (optional) → sit in front of Vercel as a CDN/WAF for DDoS protection, caching, and hiding the origin server IP

### Deploy to Vercel (Fresh Setup)
1. Go to [vercel.com](https://vercel.com) and create a new project
2. Import the GitHub repository `krshhh6/SSI`
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` = your reCAPTCHA v3 site key
4. Click **Deploy**

> Vercel automatically detects Next.js and runs `npm run build`.

---

## Client Handover

See [`handover_guide.md`](./handover_guide.md) for a step-by-step checklist to transfer ownership of Firebase, GitHub, Vercel, and reCAPTCHA to the client.

> **⚠️ CRITICAL:** Before handing over, update the `ADMIN_EMAIL` constant in `src/components/AdminClient.tsx` (line 23) and the `firestore.rules` `isAdmin()` function to use the client's email.

---

## 🤝 Contributing / Intern Onboarding

If you are new to this project, read **[`AGENT_KNOWLEDGE.md`](./AGENT_KNOWLEDGE.md)** — it contains a full brain dump of every architectural decision, security rule, and "gotcha" discovered during development.

---

<p align="center">Built for SAM Wheels — Bosch Authorized Service Centre</p>
