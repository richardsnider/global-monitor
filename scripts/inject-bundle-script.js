const fs = require('fs');
const path = require('path');

const bundlePath = path.resolve(__dirname, '../dist/bundle.js');
const indexPath = path.resolve(__dirname, '../dist/index.html');
const bundle = fs.readFileSync(bundlePath, 'utf8');
const index = fs.readFileSync(indexPath, 'utf8');
const newScriptTag = `<script type="module" async>${bundle}</script>`; 
const newHTML = index.replace('</body>', newScriptTag + '</body>');
fs.writeFileSync(indexPath, newHTML);

console.log('Injected bundle.js into index.html');
