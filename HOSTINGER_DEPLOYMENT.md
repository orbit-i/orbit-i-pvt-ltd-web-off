# ORBIT-I Private Limited — Hostinger Deployment & Configuration Guide

This guide provides step-by-step instructions for deploying the ORBIT-I website, Intern Verification Portal, Client Dashboard, and SuperAdmin system to **Hostinger** (cPanel / Cloud / VPS) using **Node.js** and **MySQL**.

---

## 1. Architecture Overview

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS (SPA)
- **Backend**: Node.js + Express 5 + TypeScript REST API
- **Database**: MySQL 8.x / MariaDB (Standard Hostinger phpMyAdmin database)
- **Features**:
  - Intern & Certificate Verification Portal (`/verify` & `/admin/interns`)
  - Multi-Gateway Payment Checkout (JazzCash, EasyPaisa, NayaPay, Stripe, Bank Wire)
  - Legal Tax Invoice & Receipt Generator
  - Dark / Light Mode Toggle with persistence
  - WordPress-style Rich Text Editor & SEO Management for Blog & Pages
  - Bulletproof Security: Parameterized SQL, Helmet, CORS, JWT, Bcrypt, Rate Limiting

---

## 2. Hostinger MySQL Database Setup (phpMyAdmin)

1. Log into your **Hostinger hPanel / cPanel**.
2. Navigate to **Databases** → **MySQL Databases**.
3. Create a new database:
   - **Database Name**: e.g., `u123456789_orbit_db`
   - **Database Username**: e.g., `u123456789_orbit_user`
   - **Password**: Enter a secure password (e.g., `OrbitMySQL#Secure2026`)
4. Open **phpMyAdmin** from your Hostinger control panel.
5. Select your database from the left sidebar.
6. Click the **Import** tab at the top.
7. Click **Choose File** and select:
   ```
   server/database/schema.sql
   ```
8. Click **Import / Go**. All tables (`users`, `interns`, `projects`, `project_milestones`, `invoices`, `payment_gateway_settings`, `blog_posts`, `services`, `jobs`, `contact_messages`) will be created instantly.

---

## 3. Backend Deployment (Node.js on Hostinger)

> [!IMPORTANT]
> **Hostinger Startup File & TypeScript Build Fix**:
> - **Application Startup File**: Must be set to `app.js` (Recommended) or `dist/server.js`. **NEVER** set `dist/server.ts` or `src/server.ts`, because Node.js only runs JavaScript (`.js`) files.
> - **Pre-compiled in Git**: The compiled JavaScript bundle in `server/dist/` is committed to the repository so your server can boot immediately on Hostinger even if Hostinger's runner does not run a build script.
> - **Automatic Build Hooks**: `server/package.json` includes `"postinstall": "tsc -p tsconfig.json"` and `"prestart": "tsc -p tsconfig.json"`. When Hostinger runs `npm install` or starts the app, it compiles TypeScript automatically.
> - **Self-Healing Entrypoint**: `server/app.js` automatically checks if `dist/server.js` is present; if missing, it compiles TypeScript on the fly before booting.

### Option A: Using Hostinger "Setup Node.js App" (cPanel / hPanel)

1. In Hostinger cPanel / hPanel, open **Setup Node.js App** (or **Node.js** in hPanel).
2. Click **Create Application**:
   - **Node.js Version**: `20.x` or `22.x` (18.x+ supported)
   - **Application Mode**: `Production`
   - **Application Root**: `server`
   - **Application URL**: `api.orbit-i.tech` (or `orbit-i.tech/api`)
   - **Application Startup File**: `app.js` (or `dist/server.js`)
3. Click **Create**.
4. In the Application dashboard:
   - Click **Run NPM Install** (or run `npm install` in terminal).
   - If a **Build Command** field is available, set it to:
     ```bash
     bash build.sh
     ```
     or
     ```bash
     npm run build
     ```
5. If using Hostinger SSH / Terminal:
   ```bash
   cd server
   bash build.sh
   # Or manually:
   # npm install
   # npm run build
   npm run seed:mysql
   ```
5. Set Environment Variables in Hostinger Node.js app interface or in `server/.env`:
   ```env
   NODE_ENV=production
   PORT=5000
   DB_HOST=localhost
   DB_USER=u123456789_orbit_user
   DB_PASSWORD=YourPasswordHere
   DB_NAME=u123456789_orbit_db
   DB_PORT=3306

   JWT_SECRET=production-access-token-secret-orbit-i-2026
   JWT_REFRESH_SECRET=production-refresh-token-secret-orbit-i-2026
   CLIENT_URL=https://orbit-i.tech
   PUBLIC_SITE_URL=https://orbit-i.tech

   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
6. Click **Restart** on the Node.js application in Hostinger panel.

---

## 4. Frontend Deployment (React / Vite on Hostinger)

1. Build the production bundle locally or on your server:
   ```bash
   cd client
   npm install
   npm run build
   ```
2. The output directory is:
   ```
   client/dist/
   ```
3. In Hostinger **File Manager**, navigate to your domain's web root (`public_html/`).
4. Upload all files from `client/dist/` directly into `public_html/`.
5. Ensure a `.htaccess` file exists in `public_html/` with the following rewrite rule for React client-side routing:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 5. Default Credentials & SuperAdmin Access

Once seeded (`npm run seed:mysql`), the system includes these accounts:

- **SuperAdmin**:
  - **Email**: `superadmin@orbit-i.com`
  - **Password**: `OrbitSuper#2026`
  - **URL**: `/login` → redirects to `/admin/dashboard`
  - **Capabilities**: Full access to Interns, Payment Gateways (live keys), SEO Blog Editor, Clients, Orders, Projects.

- **Admin**:
  - **Email**: `admin@orbit-i.com`
  - **Password**: `OrbitAdmin#2026`

- **Client**:
  - **Email**: `client@apexsolutions.com`
  - **Password**: `ClientPass#2026`
  - **URL**: `/login` → redirects to `/client/dashboard`
  - **Capabilities**: View project progress, pay invoices via JazzCash / EasyPaisa / NayaPay / Stripe / Bank Wire, download legal receipts.

---

## 6. Official Contact & Social Media Data (Integrated)

- **Phone**: `+92 3190375751`
- **Email**: `contactus@orbit-i.tech`
- **Website**: `https://orbit-i.tech/`
- **WhatsApp Channel**: `https://whatsapp.com/channel/0029Vb8I4kvJJhzUXqEnB50J`
- **TikTok**: `https://www.tiktok.com/@orbitiprivatelimited`
- **Facebook**: `https://www.facebook.com/orbitiprivatelimited`
- **Instagram**: `https://www.instagram.com/orbiti_private_limited?utm_source=qr&stkn=ZnE1c25zdG96Y3Zp`
- **LinkedIn**: `https://www.linkedin.com/company/orbit-i-private-limited/`
- **Offices**: Karachi & Nawabshah, Pakistan

---

## 7. Intern Verification Flow

- **Public Route**: `https://orbit-i.tech/verify`
- Anyone can enter a Certificate ID (e.g. `ORBIT-I/INT/2026/01`).
- The portal validates against the database registry and displays the verified record, tenure, department, and completion grade.
- Allows 1-click **Print / Save PDF Certificate** with official watermark, security verification hash, and signature stamps.
- Admins can add, edit, or revoke credentials and **Export Complete Registry to CSV** from `/admin/interns`.
