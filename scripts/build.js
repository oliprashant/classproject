const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const pkg = require('../package.json');

const staticFiles = ['index.html', 'style.css', 'script.js'];

if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true });
}
fs.mkdirSync(dist, { recursive: true });

for (const file of staticFiles) {
  const src = path.join(root, file);
  if (!fs.existsSync(src)) {
    console.error(`Build failed: missing ${file}`);
    process.exit(1);
  }
  fs.copyFileSync(src, path.join(dist, file));
}

const apiDir = path.join(dist, 'api');
fs.mkdirSync(apiDir, { recursive: true });
fs.writeFileSync(
  path.join(apiDir, 'version.json'),
  JSON.stringify({
    success: true,
    version: pkg.version,
    name: pkg.name,
    environment: 'production'
  })
);

console.log(`Built static site → ${dist} (${staticFiles.length + 1} files)`);
