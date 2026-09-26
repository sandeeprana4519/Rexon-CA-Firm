# Professional CA & Accounting Firm Portal
### Ready for Hostinger Shared Hosting (`public_html`) & Supabase Backend

A modern, production-grade website designed for Chartered Accountants, Tax Consultants, and Accounting Firms in India. Built with clean, framework-free HTML, CSS, JavaScript, and Supabase database integration.

---

## 📁 Project File Structure

```text
ca-accounting-website/
├── index.html                   # Complete Homepage (Hero, Trust metrics, Services, Forms, FAQs, Testimonials)
├── about.html                   # Partner qualifications, practice philosophy, and firm credentials
├── services.html                # Services directory (6 Core Domains)
├── contact.html                 # Office location, Contact form, Callback, and Appointment system
├── consultation.html            # Dedicated Consultation Booking page with auto-service selection
├── privacy-policy.html          # Professional data handling & client confidentiality notice
├── terms.html                   # Engagement terms & conditions
├── disclaimer.html              # Statutory ICAI compliance notice & non-solicitation declaration
│
├── services/                    # Dedicated Service Detail Pages (Benefits, Docs, Process, FAQs)
│   ├── income-tax.html          # Personal & Corporate ITR, Tax Planning, Capital Gains, Notice Assistance
│   ├── gst.html                 # GST Registration, Monthly GSTR-1/3B, 2B Reconciliation, LUT Filing
│   ├── accounting.html          # Full-cycle Bookkeeping, Reconciliations, Monthly MIS, Payroll
│   ├── audit.html               # Statutory Audit, Tax Audit (Sec 44AB), Internal Audit
│   ├── company-registration.html# Pvt Ltd, LLP, OPC, MSME Udyam, Startup India DPIIT
│   └── business-advisory.html   # Virtual CFO, Annual MCA ROC Compliance, CMA Project Reports
│
├── admin/                       # Supabase Auth Protected Administration Portal
│   ├── login.html               # Secure Supabase Auth login screen (Email & Password)
│   ├── dashboard.html           # Unified metrics, overview stats, and live recent submissions
│   ├── consultations.html       # Manage Consultation Requests, change status, and export CSV
│   ├── contacts.html            # Manage General Inquiries and messages
│   ├── callbacks.html           # Manage Quick Callback Leads
│   └── appointments.html        # Manage In-Person / Virtual Appointment Requests
│
├── css/
│   └── style.css                # Financial services corporate stylesheet (Navy, Gold, Off-white)
│
├── js/
│   ├── config.js                # SINGLE CENTRAL CONFIGURATION FILE (All phone, address, and Supabase keys)
│   ├── main.js                  # Header scroll, mobile menu, accordion FAQs, modals, dynamic placeholders
│   ├── forms.js                 # Form validations, loading spinners, Supabase inserts, WhatsApp triggers
│   └── admin.js                 # Session guard, authentication verification, live status updates, CSV export
│
├── api/
│   └── submit.php               # Optional Hostinger server-side PHP endpoint for email alerts via mail()
│
├── database.sql                 # Complete PostgreSQL schema, UUID keys, and Row Level Security (RLS) policies
└── README.md                    # Deployment guide, GitHub sync, Supabase setup, and testing checklist
```

---

## 🚀 Step-by-Step Hostinger Deployment Guide

### STEP 1: Connect Domain & Hosting
1. Log in to your **Hostinger Control Panel (hPanel)**.
2. Ensure your domain name is pointed to your Hostinger hosting account.

### STEP 2: Access Hostinger File Manager
1. In hPanel, navigate to: **Websites** → Click **Manage** next to your domain.
2. Under **Files**, click **File Manager** (or connect via FTP / FileZilla).

### STEP 3: Navigate to `public_html`
1. Open the folder named `public_html`.
2. Delete any default placeholder files (such as `default.php`).

### STEP 4: Upload Website Files
1. Upload all files and folders from this project directly into `public_html`.
2. Verify that `index.html` is located directly at:
   ```text
   public_html/index.html
   ```
   and subfolders exist as:
   ```text
   public_html/css/
   public_html/js/
   public_html/services/
   public_html/admin/
   public_html/api/
   ```

### STEP 5: Enable Free SSL / HTTPS
1. In hPanel, navigate to **Security** → **SSL**.
2. Click **Install SSL** on your domain to ensure all form submissions and admin sessions run over encrypted HTTPS.

---

## 🗄️ Supabase Setup Instructions

### STEP 6: Create Your Supabase Project
1. Visit [https://app.supabase.com](https://app.supabase.com) and create a free account.
2. Click **New Project**, choose a project name (e.g. `apex-ca-firm`), set a database password, and select your preferred region (e.g. `South Asia (Mumbai)`).

### STEP 7: Run the Database SQL Script
1. In your Supabase project dashboard, click **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Open the `database.sql` file included in this project, copy its entire contents, paste it into the SQL Editor, and click **Run**.
4. Confirm success: Under **Table Editor**, you will now see:
   - `consultation_requests`
   - `contact_messages`
   - `callback_requests`
   - `appointments`
5. Note: Row Level Security (RLS) is automatically enabled with strict policies:
   - Anonymous visitors can **ONLY INSERT** form submissions.
   - Anonymous visitors **CANNOT READ** other clients' data.
   - Only authenticated administrators have full access.

### STEP 8: Create an Admin Account for the Admin Panel
1. In Supabase Dashboard, click **Authentication** in the left sidebar.
2. Under the **Users** tab, click **Add User** → **Create User**.
3. Enter your desired administrator email (e.g. `admin@yourdomain.com`) and a strong password.
4. Click **Create User**. You will use this email and password to log in to `/admin/login.html`.

### STEP 9: Configure Your Credentials in `js/config.js`
1. In Supabase Dashboard, click the gear icon **Project Settings** → **API**.
2. Copy the **Project URL** and the **anon (public)** key.
3. Open `public_html/js/config.js` in Hostinger File Manager (or your code editor) and replace the placeholders:
   ```javascript
   supabase: {
     url: "https://yourprojectid.supabase.co", // Replace with your Project URL
     anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Replace with your anon key
   }
   ```
4. Also update your Firm Name, Partner Name, Phone Number, WhatsApp Number, and Address in `js/config.js`.

---

## 🔄 Connecting Google AI Studio → GitHub → Hostinger → Supabase

To establish an automated, beginner-friendly workflow:

```text
[Google AI Studio Codebase] ──(Push)──> [GitHub Repository] ──(Auto-Deploy)──> [Hostinger Shared Hosting]
                                                                                       │
                                                                                       ▼
                                                                           [Supabase Cloud Database]
```

1. **Push from AI Studio to GitHub:**
   - In GitHub, create a new private or public repository (e.g., `ca-firm-website`).
   - Push this workspace to your GitHub repository.
2. **Connect Hostinger to GitHub (Git Deployment):**
   - In Hostinger hPanel, go to **Advanced** → **GIT**.
   - Paste your GitHub repository URL and select `public_html` as the deployment directory and `main` as the branch.
   - Hostinger will pull files automatically. Every time you push updates to GitHub, you can click **Deploy** in Hostinger to update your live website instantly!
3. **Connect to Supabase:**
   - Put your Supabase URL & anon key into `js/config.js`.
   - Your frontend communicates directly and securely with Supabase without requiring any Node.js server or Docker setup!

---

## 🧪 Testing Checklist

Before going live to public visitors, test each item:

- [x] **Homepage Loads:** Clean typography, logo, phone, and statutory ICAI notice.
- [x] **Navigation:** All links (`/about.html`, `/services.html`, `/contact.html`, `/consultation.html`) resolve.
- [x] **Mobile Menu:** Click hamburger icon on mobile view; links expand and close properly.
- [x] **WhatsApp Floating Button:** Clicking opens `https://wa.me/` with pre-filled message.
- [x] **Phone Links:** Clicking initiates a phone call (`tel:`) on mobile devices.
- [x] **Consultation Form:** Fill out test information and click submit. Verify the loading spinner appears, success alert shows, and record appears in Supabase `consultation_requests`.
- [x] **Contact Form:** Submit a message. Verify record appears in `contact_messages`.
- [x] **Callback Request:** Click the floating "Request Callback" button, submit, and verify record in `callback_requests`.
- [x] **Appointment Booking:** Submit a request on `contact.html` and verify record in `appointments`.
- [x] **Admin Login:** Visit `/admin/login.html` and log in with your Supabase credentials.
- [x] **Admin Protection:** Try opening `/admin/dashboard.html` in an Incognito window without logging in; verify it redirects to `login.html`.
- [x] **Status Management:** In `/admin/dashboard.html`, change a lead status from `NEW` to `CONTACTED`. Verify it updates in real time.
- [x] **CSV Export:** Click "Export to CSV" on any table and ensure the `.csv` file downloads.
- [x] **Sign Out:** Click "Sign Out" and verify the session terminates securely.

---

## 🛠️ Troubleshooting Guide

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Forms show "demo mode" notice** | Supabase keys are still set to `YOUR_SUPABASE_...` | Open `js/config.js` and paste your actual Supabase Project URL and anon public key. |
| **Admin login says "Invalid email or password"** | User not created in Supabase | Go to Supabase Dashboard → Authentication → Users → Add User. Ensure you typed the email and password accurately. |
| **Form submission error on live site** | SQL tables not created or RLS blocking | Go to Supabase SQL Editor and re-run `database.sql`. Ensure all 4 tables exist and have RLS policies enabled. |
| **404 error when clicking links on Hostinger** | Files not placed in `public_html` | Ensure files are directly in `public_html/` and not nested inside an extra folder like `public_html/ca-accounting-website/`. |
| **CSS or changes not reflecting** | Browser or CDN caching | Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac) to hard refresh the browser cache. |

---

## ⚖️ Statutory & Compliance Notice
This portal is engineered to conform with the Code of Ethics and guidelines prescribed by the Institute of Chartered Accountants of India (ICAI). No unsolicited advertisement, fee undercutting, or performance guarantee claims are featured.
