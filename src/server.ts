
import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import http from 'http';

const PORT = process.env.PORT || 8080;
const distPath = resolve(__dirname, '../dist');

// Simple static file server
const server = http.createServer((req, res) => {
  // Default to index.html
  let filePath = distPath + (req.url === '/' ? '/index.html' : req.url);
  
  // Ensure the path stays within the dist directory
  if (!filePath.startsWith(distPath)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    // Check if file exists
    const stat = fs.statSync(filePath);
    
    // If path is a directory, try to serve index.html from that directory
    if (stat.isDirectory()) {
      filePath = resolve(filePath, 'index.html');
    }
    
    const content = fs.readFileSync(filePath);
    
    // Set appropriate content type
    const ext = filePath.split('.').pop()?.toLowerCase() || '';
    const contentTypes: Record<string, string> = {
      'html': 'text/html',
      'css': 'text/css',
      'js': 'text/javascript',
      'json': 'application/json',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'ico': 'image/x-icon'
    };
    
    const contentType = contentTypes[ext] || 'text/plain';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (error) {
    // If the file doesn't exist, try to serve index.html for SPA routing
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      try {
        const content = fs.readFileSync(resolve(distPath, 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      } catch (indexError) {
        res.writeHead(404);
        res.end('Not found');
      }
    } else {
      res.writeHead(500);
      res.end('Internal server error');
      console.error(error);
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
