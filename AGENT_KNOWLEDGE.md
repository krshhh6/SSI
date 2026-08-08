# 🧠 AGENT_KNOWLEDGE.md — SAM Wheels Full Project Brain Dump

> **Purpose:** This document is the single source of truth for any AI agent, developer, or intern taking over this project. If the original conversation history is lost, **everything you need to understand, maintain, and extend this project is documented here.**

> **Project:** SAM Wheels — Bosch Authorized Car Service Centre Website  
> **Repository:** `https://github.com/krshhh6/SSI` (private)  
> **Tech Stack:** Next.js 15 (Turbopack) + Firebase (Firestore + Auth) + Framer Motion + GSAP  
> **Original Dev Session:** Conversation ID `83718685-bb6f-4acd-970a-270c154c3bcf`

---

## 📑 Table of Contents

1. [Project Context & Business Brief](#1-project-context--business-brief)
2. [Architecture Overview](#2-architecture-overview)
3. [Authentication Deep-Dive](#3-authentication-deep-dive)
4. [Firebase & Firestore](#4-firebase--firestore)
5. [Security — All Layers Explained](#5-security--all-layers-explained)
6. [Admin Panel — How It Works](#6-admin-panel--how-it-works)
7. [Key Files Reference](#7-key-files-reference)
8. [CSS Design System](#8-css-design-system)
9. [Decisions Made & Why](#9-decisions-made--why)
10. [Known Issues & Gotchas](#10-known-issues--gotchas)
11. [Deployment Workflow](#11-deployment-workflow)
12. [Client Handover Checklist](#12-client-handover-checklist)
13. [Do's and Don'ts for Future Maintenance](#13-dos-and-donts-for-future-maintenance)
14. [Environment Variables Reference](#14-environment-variables-reference)

---

## 1. Project Context & Business Brief

**Client:** SAM Wheels, a car service garage that is an **authorized Bosch Car Service (BCS) centre**.

**Goal:** Build a premium, modern web application that:
- Serves as a marketing website to attract car owners
- Allows customers to **book service appointments online**
- Allows customers to **track their bookings** in real-time
- Gives the **business owner an admin panel** to manage everything
- Looks premium and professional (dark mode, glassmorphism, animations)

**Supported Car Brands (displayed in the UI):**
BMW, Audi, Mercedes-Benz, Hyundai, Honda, Suzuki, Toyota, MG, Ford, Ferrari, Porsche, Volkswagen, Kia, Tata, Mahindra, and others.

**Key Constraints agreed during development:**
- Only `@gmail.com` email addresses can register/log in (no corporate/Workspace emails)
- The admin is a single person whose email is hardcoded (see Security section)
- The site must comply with India's DPDP Act (hence the Privacy Policy page)

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (Client Side)                    │
│  Next.js App Router (React 19, Framer Motion, GSAP, Three.js)│
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐ │
│  │  Public      │  │  Auth'd User │  │  Admin Only       │ │
│  │  Pages       │  │  Pages       │  │  /admin           │ │
│  │  / /services │  │  /booking    │  │  (hardcoded email)│ │
│  │  /gallery etc│  │  /my-bookings│  │                   │ │
│  └─────────────┘  └──────────────┘  └───────────────────┘ │
└────────────────────────────┬────────────────────────────────┘
                             │ Firebase SDK (client-side)
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    FIREBASE BACKEND                          │
│                                                             │
│  ┌─────────────────────┐  ┌──────────────────────────────┐ │
│  │  Firebase Auth       │  │  Firestore Database          │ │
│  │  - Google Sign-In    │  │  - bookings collection       │ │
│  │  - Email/Password    │  │  - users collection          │ │
│  │  - Gmail domain only │  │  - reviews collection        │ │
│  └─────────────────────┘  │  - feedback collection       │ │
│                            └──────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Firebase App Check (reCAPTCHA v3) — Anti-bot        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             │
                    Deployed via
                             ▼
┌─────────────────────────────────────────────────────────────┐
│          VERCEL (Next.js Hosting — Free Tier)                │
│          Connected to GitHub repo: krshhh6/SSI              │
│          Auto-deploys on push to main branch                 │
└─────────────────────────────────────────────────────────────┘
```

**There is NO custom backend server.** All data operations happen directly from the browser to Firebase using the Firebase JS SDK. Security is enforced by **Firestore Security Rules** (evaluated server-side by Firebase), not by an intermediary server.

---

## 3. Authentication Deep-Dive

### How Auth Works

1. User visits `/sign-in`
2. User enters a Gmail address + password, OR clicks "Continue with Google"
3. Firebase Auth handles credential verification
4. On success, `onAuthStateChanged` fires in `AuthContext.tsx`
5. The context checks if the email ends with `@gmail.com` — if not, it signs the user out immediately
6. If valid, it creates/fetches their Firestore user document
7. The user is redirected to `/my-bookings`

### Gmail-Only Restriction — Where It's Enforced

The restriction is enforced at **3 different layers** to prevent any bypass:

**Layer 1: Frontend (SignInClient.tsx, line 44-51)**
```typescript
const allowedDomains = ["@gmail.com"];
const isAllowedDomain = allowedDomains.some(domain => cleanEmail.endsWith(domain));
if (!isAllowedDomain) {
  setError("Only Gmail email addresses are allowed.");
  return;
}
```
This prevents the form from submitting. Fast UX feedback, but NOT a security control on its own.

**Layer 2: Post-Sign-In (AuthContext.tsx, signInWithGoogle, line 64-73)**
```typescript
if (!email.endsWith("@gmail.com")) {
  await signOut(auth);
  throw { code: "auth/custom-domain-restricted", message: "Only Gmail email addresses are allowed." };
}
```
This catches non-Gmail Google Workspace accounts that slip through the Google auth popup.

**Layer 3: Session State (AuthContext.tsx, onAuthStateChanged, line 33-39)**
```typescript
if (u.email && !u.email.toLowerCase().endsWith("@gmail.com")) {
  await signOut(auth);
  setUser(null);
  return;
}
```
This is the most critical layer. Even if someone already has a session token from before the restriction was added, they will be signed out on the next page load.

### Admin Authentication

The admin panel (`/admin`) uses a **completely separate sign-in form** (inside `AdminClient.tsx`) that only accepts `test01samwheels@gmail.com`. It uses `signInWithEmailAndPassword` directly — no Google popup.

The Firestore rules' `isAdmin()` function also enforces this at the database level.

> **⚠️ Before client handover:** Change `ADMIN_EMAIL` in `AdminClient.tsx` line 23 AND the email in `firestore.rules` `isAdmin()` function.

---

## 4. Firebase & Firestore

### Firebase Project Details
- **Project ID:** `sam-wheels`
- **Project Name:** SAM Wheels
- **Firebase Console:** https://console.firebase.google.com/project/sam-wheels
- **Auth Domain:** `sam-wheels.firebaseapp.com`

### Firestore Data Model

#### `bookings` collection
```
bookings/{bookingId}
├── userId: string           // Firebase Auth UID of the user
├── userEmail: string        // User's email
├── name: string             // Customer's name (max 100 chars)
├── phone: string            // 10-digit phone number
├── brand: string            // Car brand (e.g., "BMW")
├── model: string            // Car model (e.g., "X5")
├── service: string          // Service type (e.g., "General Servicing")
├── date: string             // Preferred date (ISO string or "YYYY-MM-DD")
├── message: string          // Additional notes (max 500 chars)
├── status: string           // "pending" | "confirmed" | "on_track" | "completed" | "cancelled"
└── createdAt: Timestamp     // Firestore server timestamp
```

**Status Flow:** `pending` → `confirmed` → `on_track` → `completed` (or `cancelled` at any point)

Only admins can change the status. Users cannot modify their booking after creation.

#### `users` collection
```
users/{userId}              // Document ID = Firebase Auth UID
├── name: string            // Display name
├── email: string           // Gmail address
├── role: string            // "user" (never "admin" for security)
└── createdAt: Timestamp    // When they first signed in
```

Note: The `role` field is informational only. Admin privileges are determined SOLELY by the hardcoded `ADMIN_EMAIL`, not by the role field in Firestore.

#### `reviews` collection
```
reviews/{reviewId}
├── author: string          // Reviewer name
├── rating: number          // 1-5 stars
├── text: string            // Review body
└── createdAt: Timestamp
```
Admin adds these manually from the admin panel or Firebase Console.

#### `feedback` collection
```
feedback/{feedbackId}
├── userId: string          // UID of user leaving feedback
├── bookingId: string       // Which booking the feedback is for
├── rating: number          // 1-5
├── comment: string         // Feedback text
└── createdAt: Timestamp
```

### Firestore Security Rules Summary

The rules file is at `firestore.rules`. Key rules:

| Collection | Create | Read | Update | Delete |
|---|---|---|---|---|
| `bookings` | Auth + validation OR Admin | Own + Admin | Admin only | Admin only |
| `users` | Auth (own doc) | Own + Admin | Own (no role change) + Admin | - |
| `reviews` | Admin only | Anyone (public) | Admin only | Admin only |
| `feedback` | Auth (own userId) | Own + Admin | Admin only | Admin only |

> **⚠️ IMPORTANT:** After ANY changes to `firestore.rules`, you MUST deploy them. Changes in the local file don't take effect automatically!
> 
> Deploy command: `firebase deploy --only firestore:rules`

---

## 5. Security — All Layers Explained

This project uses **defense-in-depth** — multiple overlapping security layers.

### Layer 1: Gmail Domain Restriction
**Where:** `SignInClient.tsx`, `AuthContext.tsx`  
**What it prevents:** Non-Gmail accounts from authenticating  
**How:** Client-side validation + Firebase SDK `signOut()` call

### Layer 2: Firestore Security Rules
**Where:** `firestore.rules` (deployed to Firebase)  
**What it prevents:** Unauthorized data reads/writes, status forgery, role escalation  
**Key rules:**
- Users cannot set their own `status` to anything other than `"pending"` on create
- Users cannot set their own `role` to `"admin"`
- Users cannot read other users' bookings
- Non-admin users cannot update or delete any booking

### Layer 3: Firebase App Check (reCAPTCHA v3)
**Where:** `src/lib/firebase.ts`  
**What it prevents:** Bot scripts and automated attacks from hitting Firebase APIs  
**How:** Firebase requires a valid App Check token with every request. The token is generated by reCAPTCHA v3 (invisible to users).  
**Environment Variable required:** `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

### Layer 4: Rate Limiting Middleware
**Where:** `src/middleware.ts`  
**What it prevents:** Flooding the site/APIs  
**How:** Edge middleware counts requests per IP. If > 100 requests/minute, returns HTTP 429.  
**Note:** On Vercel's Edge network, each edge node has its own in-memory store, so this is per-edge-node. For production-grade global rate limiting, consider [Upstash Redis](https://upstash.com/).

### Layer 5: HTTP Security Headers
**Where:** `next.config.ts`  
**What it prevents:**
- Clickjacking (`X-Frame-Options: SAMEORIGIN`)
- MIME sniffing attacks (`X-Content-Type-Options: nosniff`)
- HTTP downgrade attacks (`Strict-Transport-Security`)
- XSS via inline scripts from unauthorized sources (`Content-Security-Policy`)
- Excessive browser permissions (`Permissions-Policy`)

### Layer 6: Input Sanitization
**Where:** `SignInClient.tsx` (sanitize function)  
**What it prevents:** Script injection through name field  
**How:** Strips HTML tags before sending to Firebase

---

## 6. Admin Panel — How It Works

**URL:** `/admin`  
**File:** `src/components/AdminClient.tsx` (~1200 lines)

### Access Control
1. Admin navigates to `/admin`
2. Sees a login screen (not the regular `/sign-in` page)
3. Enters the admin email (`test01samwheels@gmail.com`) + password
4. `signInWithEmailAndPassword` is called directly
5. After login, the component checks `user.email === ADMIN_EMAIL`
6. If not the admin, shows "Access denied" and signs out

### Admin Sections
- **Dashboard**: 4 stat cards (bookings, pending, users, "this month")
- **Bookings**: Full table with search, filter by status, update status via dropdown
- **Users**: Table of all registered users
- **Analytics**: Recharts-powered bar, pie, and line charts
- **Feedback**: User-submitted post-service feedback
- **Add Booking**: Form to manually add walk-in customer bookings (bypass validation)

### CSV Export
The "Export" button generates a CSV of all bookings with: name, phone, brand, model, service, date, status, email, created date.

### Offline / Walk-in Bookings
Admin can add bookings manually from the admin panel. These bypass the strict Firestore validation rules because the `isAdmin()` rule allows unrestricted creates.

---

## 7. Key Files Reference

| File | Purpose | Notes |
|---|---|---|
| `src/lib/firebase.ts` | Firebase initialization | App Check init here |
| `src/context/AuthContext.tsx` | Global auth state + Gmail domain enforcement | Most critical security file |
| `src/components/SignInClient.tsx` | Login/Signup UI | Also validates Gmail on frontend |
| `src/components/AdminClient.tsx` | Full admin dashboard | Line 23: `ADMIN_EMAIL` constant |
| `src/components/Booking.tsx` | Service booking form | Writes to `bookings` collection |
| `src/components/MyBookingsClient.tsx` | User's booking history + feedback | Reads from `bookings` + `feedback` |
| `src/components/Navbar.tsx` | Navigation bar | Has dropdown menus for Services, Company |
| `src/components/Footer.tsx` | Site footer | Has car brand logos in a row |
| `src/components/Hero.tsx` | Homepage hero | Animated with GSAP and Framer Motion |
| `src/components/Reviews.tsx` | Review carousel | Reads from `reviews` collection |
| `src/middleware.ts` | IP rate limiter | Runs on Vercel Edge |
| `src/app/globals.css` | CSS variable design system | All theme colors defined here |
| `next.config.ts` | Security headers + Next.js config | CSP policy is here |
| `firestore.rules` | Firestore access control | MUST be deployed after changes |
| `handover_guide.md` | Client transfer steps | Step-by-step for 4 services |

### CSS Variables in `globals.css`
The design system is built on these CSS variables (dark mode by default):
```css
--bg: #0a0a0f              /* Page background */
--bg-secondary: #0f0f18    /* Cards, secondary backgrounds */
--text: #f0f0ff            /* Primary text */
--text-secondary: #a0a0c0  /* Subtitle text */
--text-muted: #606090      /* Placeholder, muted labels */
--accent: #0066FF          /* Primary brand blue (Bosch) */
--bosch-red: #E2001A       /* Bosch brand red */
--border: rgba(255,255,255,0.08) /* Card borders */
```

---

## 8. CSS Design System

The project uses a **hybrid approach**: TailwindCSS v4 for utility classes + custom CSS variables for theming.

### Typography
- **Outfit** (Google Font): Used for headings, buttons, brand elements
- **Inter** (Google Font): Used for body text, form labels, descriptions

### Design Philosophy
- **Glassmorphism**: Cards use `backdrop-filter: blur()` + semi-transparent backgrounds
- **Dark mode first**: The primary theme is dark. Light mode is available via `ThemeProvider`
- **Micro-animations**: Framer Motion powers hover states, page transitions, loading animations
- **Brand colors**: Bosch blue (`#0066FF`) is the primary accent; Bosch red (`#E2001A`) for highlights

### Components Style Guide
- Buttons: `border-radius: 12px`, accent background, Framer Motion `whileHover/whileTap` scale
- Cards: `border-radius: 20-24px`, `background: rgba(255,255,255,0.03)`, `backdrop-filter: blur(24px)`
- Inputs: `border-radius: 12px`, transparent with border, focus highlights in `--accent`
- Dropdowns: Custom SVG chevron icon via `backgroundImage` data-URI (for cross-browser compat)

---

## 9. Decisions Made & Why

### Why Firebase instead of a custom backend?
- **No server costs**: Firebase free tier handles all our traffic needs
- **Auth + DB in one**: Seamless integration between authentication and Firestore
- **Real-time capable**: Firestore supports real-time updates (used in MyBookings status tracking)
- **Security rules**: Enterprise-grade access control without writing a custom auth middleware

### Why Gmail-only authentication?
- The business owner requested it to avoid fake/throwaway email registrations
- Gmail accounts are tied to real Google profiles, providing accountability
- Google Sign-In with Gmail provides a smooth UX
- It simplifies the admin's user management

### Why Vercel over Cloudflare Pages?
- Vercel has native Next.js support (same team built both)
- Turbopack build features work best on Vercel
- Cloudflare can sit in FRONT of Vercel for additional CDN/WAF without conflicting
- Vercel free tier is generous enough for this project's scale

### Why hardcode the admin email instead of a role field?
- Simpler to reason about — no DB call required to check admin status
- Firestore rules enforce it server-side anyway
- A single-admin use case doesn't need a complex role system
- Reduces attack surface (can't escalate privileges by modifying Firestore)

### Why App Check + reCAPTCHA instead of just relying on security rules?
- Security rules prevent unauthorized DATA writes, but App Check prevents unauthorized API calls entirely
- Without App Check, bots can still hammer Firebase Auth endpoints
- reCAPTCHA v3 is invisible to legitimate users — no UX friction

### Why custom SVG for dropdown arrows instead of CSS?
- `<select>` element styling is notoriously inconsistent across browsers
- CSS `appearance: none` + `backgroundImage` with a data-URI SVG is the most reliable cross-browser approach
- Allows using the brand blue (`#0066FF`) for the chevron color

---

## 10. Known Issues & Gotchas

### 🐛 App Check in Development
Firebase App Check will show warnings in local dev because localhost isn't a registered reCAPTCHA domain. Add `localhost` to your reCAPTCHA admin console's allowed domains, or use App Check debug tokens.

**Fix:** In Firebase Console → App Check → Apps → Add debug token. Set `FIREBASE_APPCHECK_DEBUG_TOKEN=your_debug_token` in `.env.local`.

### 🐛 Rate Limiter is Per-Edge-Node
The `middleware.ts` rate limiter uses `Map` in memory. On Vercel Edge, each edge node has its own memory. So the effective rate limit per user is `100 × number_of_edge_nodes`. This is fine for abuse prevention but not perfect. For production-grade rate limiting, integrate Upstash Redis.

### 🐛 Email/Password Sign-Up Creates Account Even for Non-Gmail
Firebase Auth `createUserWithEmailAndPassword` actually creates the account before `AuthContext.tsx` can check the domain. The account gets deleted by the `signOut()` call, but the Firebase Auth record may persist until cleanup. The `onAuthStateChanged` listener catches this and signs out immediately.

**Current behavior:** Account is created in Firebase Auth, immediately invalidated by sign-out. The Firestore `users` document is NOT created because the check happens before `setDoc`.

### 🐛 Turbopack + puppeteer
`puppeteer` is listed as a dependency but may cause build warnings. It's only used for server-side screenshot testing, not in the main application. If you encounter build errors related to it, you can remove it from `package.json`.

### 🐛 CSP Policy May Block New Features
If you add a new external service (e.g., a video embed, a new font, an analytics script), it will be blocked by the Content-Security-Policy in `next.config.ts`. You MUST add the new domain to the appropriate CSP directive.

---

## 11. Deployment Workflow

### Standard Deployment (Auto)
1. Make code changes locally
2. `git add .`
3. `git commit -m "description"`
4. `git push origin main`
5. Vercel auto-detects the push and starts a deployment
6. Deployment takes ~2-3 minutes
7. Visit the Vercel dashboard to check status

### Manual Build Verification (Before Push)
```bash
npm run build
```
This runs `next build --turbopack`. If it completes without errors, the deployment will succeed.

### Deploying Firestore Rules (Separate Step)
Security rules are NOT deployed by Vercel. You must deploy them separately:
```bash
firebase deploy --only firestore:rules
```

### Environment Variables on Vercel
To add/update environment variables on the live site:
1. Go to [vercel.com](https://vercel.com) → your project → Settings → Environment Variables
2. Add/update `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
3. Redeploy the project (or trigger via a new push)

---

## 12. Client Handover Checklist

Before giving the project to the client (see also `handover_guide.md` for detailed steps):

- [ ] **Update admin email in code:**
  - `src/components/AdminClient.tsx` → line 23 → `const ADMIN_EMAIL = "client@gmail.com";`
  - `firestore.rules` → `isAdmin()` function → change `test01samwheels@gmail.com`
  
- [ ] **Deploy the updated Firestore rules:**
  - `firebase deploy --only firestore:rules`

- [ ] **Push updated code to GitHub:**
  - `git push origin main`

- [ ] **Transfer Firebase project ownership:**
  - Firebase Console → Project Settings → Users and Permissions → Add client as Owner

- [ ] **Transfer GitHub repository:**
  - GitHub → Settings → Transfer ownership

- [ ] **Transfer Vercel project:**
  - Vercel → Settings → Advanced → Transfer Project

- [ ] **Transfer reCAPTCHA:**
  - reCAPTCHA Admin Console → Add client as Owner

- [ ] **Share environment variables:**
  - Give client the `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` value so they can add it to their Vercel

- [ ] **Set up admin password:**
  - Client must create their account in Firebase Auth (or you set one up for them)
  - Go to Firebase Console → Authentication → Users → Add User (with client's email)

---

## 13. Do's and Don'ts for Future Maintenance

### ✅ DO

- **DO** run `npm run build` locally before pushing to catch TypeScript/build errors
- **DO** deploy Firestore rules every time you change `firestore.rules`
- **DO** keep the Gmail-only restriction in ALL THREE places (`SignInClient.tsx`, `AuthContext.tsx` post-login, `AuthContext.tsx` `onAuthStateChanged`)
- **DO** add new external domains to the CSP in `next.config.ts` if you add new services
- **DO** test the admin panel after any auth or Firestore changes
- **DO** keep the `ADMIN_EMAIL` constant and `firestore.rules` `isAdmin()` in sync

### ❌ DON'T

- **DON'T** commit `.env.local` to GitHub — it's in `.gitignore`
- **DON'T** store secrets (service account keys, etc.) in the Next.js code — use environment variables
- **DON'T** change Firestore rules and forget to deploy them — local changes do nothing
- **DON'T** add a `role: "admin"` check in Firestore rules (the current hardcoded email is more secure)
- **DON'T** remove the `onAuthStateChanged` domain check in `AuthContext.tsx` — it's the most important security layer
- **DON'T** use `allow read, write: if true;` in Firestore rules — never open-up unrestricted access
- **DON'T** remove App Check without adding an alternative bot protection mechanism

---

## 14. Environment Variables Reference

| Variable | Required | Description | Where to get |
|---|---|---|---|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Yes | reCAPTCHA v3 site key for Firebase App Check | [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin) |
| `FIREBASE_APPCHECK_DEBUG_TOKEN` | Dev only | Debug token to bypass App Check locally | Firebase Console → App Check → Debug tokens |

**All Firebase config values** (apiKey, authDomain, etc.) are hardcoded in `src/lib/firebase.ts`. They are intentionally public — Firebase API keys are not secrets, they're identifiers. The real security is the Firestore rules + App Check.

---

## 📞 Project Contacts

| Role | Contact |
|---|---|
| Original Developer | (Owner of GitHub account `krshhh6`) |
| Firebase Project | `sam-wheels` — accessible via Google account linked to `test01samwheels@gmail.com` |
| GitHub Repo | https://github.com/krshhh6/SSI |

---

*Last updated: August 2026 | Generated from AI-assisted development session `83718685-bb6f-4acd-970a-270c154c3bcf`*
