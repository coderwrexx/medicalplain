const fs = require('fs');

const svg192 = `<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" rx="40" fill="#2563eb"/>
  <text x="96" y="85" font-family="Arial" font-size="60" font-weight="bold" fill="white" text-anchor="middle">M</text>
  <text x="96" y="140" font-family="Arial" font-size="22" fill="#bfdbfe" text-anchor="middle">MedicalPlain</text>
</svg>`;

const svg512 = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="100" fill="#2563eb"/>
  <text x="256" y="220" font-family="Arial" font-size="160" font-weight="bold" fill="white" text-anchor="middle">M</text>
  <text x="256" y="340" font-family="Arial" font-size="55" fill="#bfdbfe" text-anchor="middle">MedicalPlain</text>
</svg>`;

fs.writeFileSync('public/icon-192.svg', svg192);
fs.writeFileSync('public/icon-512.svg', svg512);
fs.writeFileSync('public/icon-192.png', svg192);
fs.writeFileSync('public/icon-512.png', svg512);
console.log('Icons created');
