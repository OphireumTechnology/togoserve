import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const BRANDING_DIR = path.resolve('public/branding/togoserve');
const ICONS_DIR = path.resolve('public/icons');
const MASTER_LOGO = path.resolve('public/assets/aistudio/png_file_logo_a5d4d070.png');

if (!fs.existsSync(BRANDING_DIR)) fs.mkdirSync(BRANDING_DIR, { recursive: true });
if (!fs.existsSync(ICONS_DIR)) fs.mkdirSync(ICONS_DIR, { recursive: true });

async function generateAllAssets() {
  console.log('[Logo Directive] Processing official circular logo...');

  if (!fs.existsSync(MASTER_LOGO)) {
    throw new Error(`Master logo not found at ${MASTER_LOGO}`);
  }

  // 1. logo-original.png: Copy exact master file
  fs.copyFileSync(MASTER_LOGO, path.join(BRANDING_DIR, 'logo-original.png'));
  console.log('[Logo Directive] Created logo-original.png');

  // Metadata of master
  const meta = await sharp(MASTER_LOGO).metadata();
  const w = meta.width;
  const h = meta.height;

  // Exact circle geometry from pixel analysis:
  // Center: (625, 615), Radius: 604
  const cx = 625;
  const cy = 615;
  const r = 604;

  // Create SVG mask for smooth circular transparent background
  const circleMaskSvg = Buffer.from(`
    <svg width="${w}" height="${h}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" />
    </svg>
  `);

  // Masked master buffer with transparent exterior
  const maskedBuffer = await sharp(MASTER_LOGO)
    .ensureAlpha()
    .composite([{ input: circleMaskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 2. logo-transparent.png (1024x1024)
  await sharp(maskedBuffer)
    .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(BRANDING_DIR, 'logo-transparent.png'));
  console.log('[Logo Directive] Created logo-transparent.png');

  // 3. logo-header.png (512x512)
  await sharp(maskedBuffer)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(BRANDING_DIR, 'logo-header.png'));
  console.log('[Logo Directive] Created logo-header.png');

  // 4. logo-dashboard.png (512x512)
  await sharp(maskedBuffer)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(BRANDING_DIR, 'logo-dashboard.png'));
  console.log('[Logo Directive] Created logo-dashboard.png');

  // 5. logo-footer.png (512x512)
  await sharp(maskedBuffer)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(BRANDING_DIR, 'logo-footer.png'));
  console.log('[Logo Directive] Created logo-footer.png');

  // 6. logo-mobile.png (256x256)
  await sharp(maskedBuffer)
    .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(BRANDING_DIR, 'logo-mobile.png'));
  console.log('[Logo Directive] Created logo-mobile.png');

  // 7. logo-dark-background.png (1024x1024 with subtle gold outer ambient ring)
  const glowSvg = Buffer.from(`
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="512" cy="512" r="500" stroke="#F4B400" stroke-width="2" stroke-opacity="0.3" />
    </svg>
  `);
  const resizedForDark = await sharp(maskedBuffer)
    .resize(1000, 1000, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      { input: glowSvg, top: 0, left: 0 },
      { input: resizedForDark, top: 12, left: 12 }
    ])
    .png()
    .toFile(path.join(BRANDING_DIR, 'logo-dark-background.png'));
  console.log('[Logo Directive] Created logo-dark-background.png');

  // Also maintain logo-circular.png & logo-primary.png pointing to this authoritative artwork
  fs.copyFileSync(path.join(BRANDING_DIR, 'logo-transparent.png'), path.join(BRANDING_DIR, 'logo-circular.png'));

  // 8. ICONS:
  // For favicons, extract the stylized gold-and-charcoal T monogram from center of emblem:
  // Emblem center: x: 300 to 920, y: 160 to 650
  const tSymbol = await sharp(MASTER_LOGO)
    .extract({ left: 320, top: 160, width: 620, height: 490 })
    .toBuffer();

  // Monogram on circular badge for favicon
  const favBuffer = await sharp(maskedBuffer)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const fav16Buffer = await sharp(maskedBuffer)
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(ICONS_DIR, 'favicon-32x32.png'), favBuffer);
  fs.writeFileSync(path.join(ICONS_DIR, 'favicon-16x16.png'), fav16Buffer);
  fs.writeFileSync(path.join(ICONS_DIR, 'favicon.ico'), favBuffer);
  fs.writeFileSync(path.resolve('public/favicon.ico'), favBuffer);

  // apple-touch-icon.png (180x180)
  await sharp(maskedBuffer)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(ICONS_DIR, 'apple-touch-icon.png'));

  // android-chrome-192x192.png
  await sharp(maskedBuffer)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(ICONS_DIR, 'android-chrome-192x192.png'));

  // android-chrome-512x512.png
  await sharp(maskedBuffer)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(ICONS_DIR, 'android-chrome-512x512.png'));

  console.log('[Logo Directive] All requested logo and icon assets successfully generated!');
}

generateAllAssets().catch(err => {
  console.error('[Logo Directive] Error:', err);
  process.exit(1);
});
