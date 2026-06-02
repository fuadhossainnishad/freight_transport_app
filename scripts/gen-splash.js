const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC = path.resolve(__dirname, '..', 'assets', 'logo', 'logo.png');
const RES = path.resolve(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

// Target logo edge ~200dp. px = dp * density scale.
const densities = {
  'drawable-mdpi': 200,
  'drawable-hdpi': 300,
  'drawable-xhdpi': 400,
  'drawable-xxhdpi': 600,
  'drawable-xxxhdpi': 800,
};

(async () => {
  for (const [dir, px] of Object.entries(densities)) {
    const outDir = path.join(RES, dir);
    fs.mkdirSync(outDir, { recursive: true });
    const buf = await sharp(SRC)
      .resize(px, px, { fit: 'contain', background: '#ffffff' })
      .flatten({ background: '#ffffff' })
      .png()
      .toBuffer();
    fs.writeFileSync(path.join(outDir, 'splash_logo.png'), buf);
    console.log(`generated ${dir}/splash_logo.png @ ${px}px`);
  }
  // Remove the stale baseline logo that was being clipped, so the
  // density-qualified versions are always picked.
  const stale = path.join(RES, 'drawable', 'logo.png');
  if (fs.existsSync(stale)) {
    fs.unlinkSync(stale);
    console.log('removed stale drawable/logo.png');
  }
  console.log('done');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
