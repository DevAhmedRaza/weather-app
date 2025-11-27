// Lightweight Node static server for local testing
const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const port = 8080;
const root = path.join(__dirname);

const server = http.createServer((req, res) => {
  let pathname = decodeURI(req.url.split('?')[0]);
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(root, pathname);
  if (!filePath.startsWith(root)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = mime[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', type + '; charset=UTF-8');
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
