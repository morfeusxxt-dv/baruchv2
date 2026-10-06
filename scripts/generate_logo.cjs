const fs = require('fs');
const path = require('path');

const favPath = path.join(__dirname, '../public/brand/favicon.png');
const favBase64 = fs.readFileSync(favPath).toString('base64');

// Clean, high precision SVG logo
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 90" fill="none">
  <!-- Yellow Pill Background -->
  <g transform="translate(0, 0)">
    <rect x="2" y="2" width="58" height="86" rx="29" fill="#FFD400" />
    <image href="data:image/png;base64,${favBase64}" x="-3" y="1" width="68" height="88" style="mix-blend-mode: multiply;" />
  </g>
  <!-- Typography BARUCH VEÍCULOS -->
  <g transform="translate(74, 0)">
    <text x="0" y="52" font-family="'Sora', 'Montserrat', -apple-system, sans-serif" font-size="44" font-weight="900" letter-spacing="1.5" fill="#0F172A">BARUCH</text>
    <text x="2" y="76" font-family="'Inter', -apple-system, sans-serif" font-size="14" font-weight="800" letter-spacing="9" fill="#94A3B8">VEÍCULOS</text>
  </g>
</svg>`;

const logoSvgPath = path.join(__dirname, '../public/brand/logo.svg');
fs.writeFileSync(logoSvgPath, svgContent);
console.log('Saved public/brand/logo.svg successfully');
