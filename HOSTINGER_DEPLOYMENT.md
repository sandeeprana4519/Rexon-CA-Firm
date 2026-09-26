# Hostinger Web App Deployment Guide (Express + Node.js 22.x)

This project is fully configured for **Hostinger Web Apps** with **Framework: Express** and **Node version: 22.x**.

---

## 1. Hostinger hPanel Settings

In your Hostinger hPanel dashboard, navigate to **Websites** → **Manage** → **Web Applications / Node.js**:

| Setting | Value to Enter / Select |
| :--- | :--- |
| **Framework / Type** | `Express` |
| **Node.js version** | `22.x` (or latest Node 22) |
| **Application mode** | `Production` |
| **Application root** | `public_html` (or your chosen subfolder) |
| **Application startup file** | `server.js` (or `app.js`) |
| **Application URL** | Your connected domain (e.g. `yourdomain.com`) |

---

## 2. Deploy via Git (Recommended)

1. Go to **Git** in your Hostinger control panel.
2. Connect your GitHub repository (`Rexon-CA-Firm`) and select the `main` branch.
3. Set the target folder to `public_html` (or your application folder).
4. Click **Create** / **Deploy**.

---

## 3. Install Dependencies & Build

In Hostinger hPanel under **Web Applications (Node.js)**:
1. Click **NPM Install**.
   - `postinstall` is configured in `package.json` to automatically run `npm run build` during installation, building all static assets into `dist/`.
2. Click **Restart Application**.

*(If you have SSH access on Hostinger, you can also run):*
```bash
npm install
npm run build
npm start
```

---

## 4. Features Active in Hostinger Express Mode

- **Server Entry Points:** Both `server.js` and `app.js` are provided and compatible with Hostinger's Phusion Passenger and standalone Node.
- **Port Handling:** Automatically binds to Hostinger's assigned port or Phusion Passenger socket.
- **Form Submissions:** Incoming leads are captured in Supabase directly and also supported via Express route `/api/submit`.
- **Health Check Endpoint:** `https://yourdomain.com/api/health` returns `200 OK` with Node version and server status.
