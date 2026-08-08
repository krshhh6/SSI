const fs = require('fs');
fs.mkdirSync('public/logos', { recursive: true });

const logos = {
  'maruti.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 70"><text x="110" y="42" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="13" font-weight="900" fill="#003087" letter-spacing="1">MARUTI SUZUKI</text></svg>',
  'hyundai.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 70"><text x="100" y="42" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="18" font-weight="900" fill="#002C5F" letter-spacing="2">HYUNDAI</text></svg>',
  'toyota.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 70"><text x="100" y="42" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="18" font-weight="900" fill="#EB0A1E" letter-spacing="2">TOYOTA</text></svg>',
  'honda.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 70"><text x="90" y="42" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="20" font-weight="900" fill="#CC0000" letter-spacing="2">HONDA</text></svg>',
  'renault.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 70"><text x="100" y="42" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="18" font-weight="900" fill="#FFCD00" letter-spacing="1">RENAULT</text></svg>',
  'tata.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 70"><text x="80" y="44" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="26" font-weight="900" fill="#1A5BA7" letter-spacing="5">TATA</text></svg>',
  'kia.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70"><text x="70" y="44" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="28" font-weight="900" fill="#05141F" letter-spacing="6">KIA</text></svg>',
};

for (const [f, s] of Object.entries(logos)) {
  fs.writeFileSync('public/logos/' + f, s);
  console.log('Written ' + f + ' (' + fs.statSync('public/logos/' + f).size + 'b)');
}
console.log('All done');
