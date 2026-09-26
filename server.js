import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Determine target directory (dist if built, otherwise project root)
const distDir = fs.existsSync(path.join(__dirname, 'dist')) 
  ? path.join(__dirname, 'dist') 
  : __dirname;

app.use(express.json());

// Serve static assets with html extension fallback
app.use(express.static(distDir, {
  extensions: ['html', 'htm']
}));

// Fallback to static public directory if present
if (fs.existsSync(path.join(__dirname, 'public'))) {
  app.use(express.static(path.join(__dirname, 'public')));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Clean URL routing & 404 fallback
app.get('*', (req, res) => {
  // Check if a direct .html file exists for the request path
  const normalizedPath = req.path.replace(/\/$/, '');
  const candidateFile = path.join(distDir, `${normalizedPath}.html`);
  
  if (fs.existsSync(candidateFile)) {
    return res.sendFile(candidateFile);
  }

  // Fallback to index.html
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  res.status(404).send('Page not found');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Rexon CA Firm Server running on port ${PORT}`);
});
