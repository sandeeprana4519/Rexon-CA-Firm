import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Hostinger / Passenger or local dist detection
const hasDist = fs.existsSync(path.join(__dirname, 'dist'));
const primaryDir = hasDist ? path.join(__dirname, 'dist') : __dirname;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for API requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve compiled static assets from dist/
if (hasDist) {
  app.use(express.static(primaryDir, {
    extensions: ['html', 'htm']
  }));
}

// Serve public directory assets
if (fs.existsSync(path.join(__dirname, 'public'))) {
  app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html', 'htm']
  }));
}

// Serve root css, js, images in case dist is not pre-built
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Health check endpoint for Hostinger Web App monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    framework: 'Express',
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
});

// Express Form Submission Handler for Hostinger
app.post('/api/submit', (req, res) => {
  const { type, data } = req.body || {};
  console.log(`[Hostinger Express] Received ${type || 'general'} submission:`, data);
  
  return res.status(200).json({
    success: true,
    message: 'Your request has been received by the CA firm. We will contact you shortly.',
    type: type || 'consultation'
  });
});

// Clean URL routing & 404 fallback for multi-page CA firm portal
app.use((req, res) => {
  const rawPath = req.path.replace(/\/$/, '') || '/index';
  
  // 1. Try finding in dist/
  if (hasDist) {
    const distHtml = path.join(primaryDir, `${rawPath}.html`);
    if (fs.existsSync(distHtml) && fs.statSync(distHtml).isFile()) {
      return res.sendFile(distHtml);
    }
  }

  // 2. Try finding in project root
  const rootHtml = path.join(__dirname, `${rawPath}.html`);
  if (fs.existsSync(rootHtml) && fs.statSync(rootHtml).isFile()) {
    return res.sendFile(rootHtml);
  }

  // 3. Try finding exact file
  const exactFile = path.join(primaryDir, req.path);
  if (fs.existsSync(exactFile) && fs.statSync(exactFile).isFile()) {
    return res.sendFile(exactFile);
  }

  // 4. Default fallback: index.html
  const fallbackIndex = hasDist 
    ? path.join(primaryDir, 'index.html') 
    : path.join(__dirname, 'index.html');

  if (fs.existsSync(fallbackIndex)) {
    return res.sendFile(fallbackIndex);
  }

  res.status(404).send('Page not found');
});

// Hostinger / Passenger / Standalone startup
if (!process.env.VERCEL) {
  const isPassenger = (typeof global !== 'undefined' && typeof global.PhusionPassenger !== 'undefined') || PORT === 'passenger';
  
  if (isPassenger) {
    app.listen('passenger', () => {
      console.log('Rexon CA Firm Server started on Hostinger Phusion Passenger');
    });
  } else {
    // If PORT is a number, bind with number. If socket path, bind directly.
    const portNum = Number(PORT);
    if (!isNaN(portNum) && portNum > 0) {
      app.listen(portNum, () => {
        console.log(`Rexon CA Firm Server running on port ${portNum} (Node ${process.version})`);
      });
    } else {
      app.listen(PORT, () => {
        console.log(`Rexon CA Firm Server running on socket ${PORT} (Node ${process.version})`);
      });
    }
  }
}

export default app;
