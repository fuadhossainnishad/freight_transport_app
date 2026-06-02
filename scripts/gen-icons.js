const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC = path.resolve(__dirname, '..', 'assets', 'logo', 'logo.png');
const RES = path.resolve(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

// Android launcher icon sizes per density bucket
const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

async function squareIcon(size) {
  // White background, logo fitted with a little breathing room
  const inner = Math.round(size * 0.86);
  const logo = await sharp(SRC)
    .resize(inner, inner, { fit: 'contain', background: '#ffffff' })
    .toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: '#ffffff',
    },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function roundIcon(size) {
  const base = await squareIcon(size);
  const r = size / 2;
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${r}" cy="${r}" r="${r}" fill="#fff"/></svg>`
  );
  return sharp(base)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

(async () => {
  for (const [dir, size] of Object.entries(sizes)) {
    const outDir = path.join(RES, dir);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'ic_launcher.png'), await squareIcon(size));
    fs.writeFileSync(path.join(outDir, 'ic_launcher_round.png'), await roundIcon(size));
    console.log(`generated ${dir} @ ${size}px`);
  }
  console.log('done');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
