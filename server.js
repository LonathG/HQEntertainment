const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname);
let PORT = parseInt(process.env.PORT, 10) || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

function resolvePath(reqUrl) {
  const urlObj = new URL(reqUrl, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(urlObj.pathname);

  // Normalize path and prevent directory traversal
  let safePath = path.normalize(path.join(ROOT, pathname));
  if (!safePath.startsWith(ROOT)) {
    return null;
  }

  // 1. Direct file match
  if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
    return safePath;
  }

  // 2. Directory with index.html
  if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
    const indexPath = path.join(safePath, 'index.html');
    if (fs.existsSync(indexPath)) return indexPath;
  }

  // 3. Clean URLs (e.g. /services/pro-sound -> /services/pro-sound.html)
  const htmlPath = safePath + '.html';
  if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
    return htmlPath;
  }

  // 4. RSC payload (e.g. /services/pro-sound.txt)
  const txtPath = safePath + '.txt';
  if (fs.existsSync(txtPath) && fs.statSync(txtPath).isFile()) {
    return txtPath;
  }

  return null;
}

const server = http.createServer((req, res) => {
  // Only accept GET and HEAD
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  const resolved = resolvePath(req.url);

  if (!resolved) {
    // Check for custom 404 page
    const custom404 = path.join(ROOT, '404.html');
    if (fs.existsSync(custom404)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(custom404).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
    return;
  }

  const ext = path.extname(resolved).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  const stat = fs.statSync(resolved);
  const headers = {
    'Content-Type': contentType,
    'Content-Length': stat.size
  };

  // Cache policy: cache Next.js hashed assets for 1 year, no-cache for HTML
  if (resolved.includes('_next' + path.sep + 'static')) {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  } else if (ext === '.html') {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  }

  // Handle HEAD
  if (req.method === 'HEAD') {
    res.writeHead(200, headers);
    res.end();
    return;
  }

  // Compression support for text-based assets
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const isCompressible = /text|javascript|json|xml|svg/i.test(contentType);

  if (isCompressible && acceptEncoding.includes('gzip')) {
    headers['Content-Encoding'] = 'gzip';
    delete headers['Content-Length'];
    res.writeHead(200, headers);
    const raw = fs.createReadStream(resolved);
    raw.pipe(zlib.createGzip()).pipe(res);
  } else if (isCompressible && acceptEncoding.includes('deflate')) {
    headers['Content-Encoding'] = 'deflate';
    delete headers['Content-Length'];
    res.writeHead(200, headers);
    const raw = fs.createReadStream(resolved);
    raw.pipe(zlib.createDeflate()).pipe(res);
  } else {
    res.writeHead(200, headers);
    fs.createReadStream(resolved).pipe(res);
  }
});

function startServer(portToTry) {
  server.listen(portToTry, () => {
    console.log('\n==================================================');
    console.log('   HQ ENTERTAINMENT - LOCAL DEVELOPMENT SERVER   ');
    console.log('==================================================');
    console.log(`\n  \x1b[32m✔ Website running successfully!\x1b[0m`);
    console.log(`  \x1b[36m➜ Local URL:\x1b[0m \x1b[1m\x1b[4mhttp://localhost:${portToTry}\x1b[0m`);
    console.log(`  \x1b[90m➜ Document root: ${ROOT}\x1b[0m`);
    console.log(`\n  Press Ctrl+C to stop the server.\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${portToTry} is in use, trying port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);
