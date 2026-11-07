import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const BRANDING_DIR = path.resolve('public/branding/togoserve');
const ICONS_DIR = path.resolve('public/icons');
const SOCIAL_DIR = path.resolve('public/social');
const LEGACY_BRAND_DIR = path.resolve('public/brand');

for (const dir of [BRANDING_DIR, ICONS_DIR, SOCIAL_DIR, LEGACY_BRAND_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Official Colors
const MUSTARD_GOLD = '#F4B400';
const PREMIUM_YELLOW = '#FFD54F';
const CHARCOAL_BLACK = '#2E2E2E';
const LIGHT_GRAY = '#EBEEEE';
const OFF_WHITE = '#FAFAFA';
const EARTH_BEIGE = '#D9C39A';

async function buildOfficialAssets() {
  console.log('[Branding] Starting official asset generation...');

  // 1. Process Master Circular Emblem (from png_file_logo_a5d4d070.png)
  const masterEmblemPath = 'public/assets/aistudio/png_file_logo_a5d4d070.png';
  if (fs.existsSync(masterEmblemPath)) {
    const emblemMeta = await sharp(masterEmblemPath).metadata();
    const w = emblemMeta.width;
    const h = emblemMeta.height;

    // Apply circular alpha mask to remove any square margin
    const cx = 625;
    const cy = 615;
    const radius = 604;
    
    // Create an SVG circular mask
    const maskSvg = Buffer.from(`
      <svg width="${w}" height="${h}">
        <circle cx="${cx}" cy="${cy}" r="${radius}" fill="#ffffff" />
      </svg>
    `);

    // Circular emblem with transparent exterior
    const maskedCircular = await sharp(masterEmblemPath)
      .ensureAlpha()
      .composite([{ input: maskSvg, blend: 'dest-in' }])
      .png()
      .toBuffer();

    // Save logo-circular.png (both full res and standard)
    await sharp(maskedCircular)
      .resize(800, 800, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFile(path.join(BRANDING_DIR, 'logo-circular.png'));

    // Also copy to legacy brand
    await sharp(maskedCircular)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFile(path.join(LEGACY_BRAND_DIR, 'togoserve-app-icon.png'));

    console.log('[Branding] Generated logo-circular.png');
  }

  // 2. High-Precision Vector SVG for Horizontal, Stacked, and Symbol Logos
  // Precise vector specification matching the official brand identity
  const symbolSvg = (isDark = false, width = 120, height = 120) => `
    <svg width="${width}" height="${height}" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="togoGoldGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFD54F" />
          <stop offset="60%" stop-color="#F4B400" />
          <stop offset="100%" stop-color="#D9A514" />
        </linearGradient>
        <linearGradient id="togoCharcoalGrad" x1="60" y1="30" x2="100" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#3A3A3A" />
          <stop offset="100%" stop-color="#242424" />
        </linearGradient>
      </defs>
      <!-- Stylized Gold T -->
      <path d="M18 22C18 17.5817 21.5817 14 26 14H94C98.4183 14 102 17.5817 102 22V28C102 32.4183 98.4183 36 94 36H70V96C70 101.523 65.5228 106 60 106C54.4772 106 50 101.523 50 96V36H26C21.5817 36 18 32.4183 18 28V22Z" fill="url(#togoGoldGrad)" />
      <!-- Dark Charcoal Geometric Accent Wing -->
      <path d="M72 40C72 37.7909 73.7909 36 76 36H94C96.2091 36 98 37.7909 98 40V70C98 74.4183 94.4183 78 90 78H76C73.7909 78 72 76.2091 72 74V40Z" fill="${isDark ? '#E2E8F0' : 'url(#togoCharcoalGrad)'}" />
    </svg>
  `;

  // Horizontal Full Corporate Logo SVG (500 x 110)
  const fullHorizontalLogoSvg = (isDark = false) => `
    <svg width="600" height="120" viewBox="0 0 600 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldTGrad" x1="10" y1="15" x2="85" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFD54F" />
          <stop offset="60%" stop-color="#F4B400" />
          <stop offset="100%" stop-color="#D9A514" />
        </linearGradient>
        <linearGradient id="charcoalWing" x1="65" y1="35" x2="95" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#3A3A3A" />
          <stop offset="100%" stop-color="#242424" />
        </linearGradient>
      </defs>

      <!-- Symbol (x: 10 to 95) -->
      <g transform="translate(10, 10)">
        <!-- Stylized Metallic Gold T -->
        <path d="M6 14C6 9.58 9.58 6 14 6H78C82.42 6 86 9.58 86 14V20C86 24.42 82.42 28 78 28H56V88C56 93.52 51.52 98 46 98C40.48 98 36 93.52 36 88V28H14C9.58 28 6 24.42 6 20V14Z" fill="url(#goldTGrad)" />
        <!-- Charcoal Geometric Wing Accent -->
        <path d="M58 32C58 29.8 59.8 28 62 28H78C80.2 28 82 29.8 82 32V64C82 68.42 78.42 72 74 72H62C59.8 72 58 70.2 58 68V32Z" fill="${isDark ? '#E2E8F0' : 'url(#charcoalWing)'}" />
      </g>

      <!-- Wordmark: TOGOSERVE (x: 120) -->
      <text x="120" y="68" font-family="'Inter', sans-serif" font-size="52" font-weight="900" letter-spacing="-1.5">
        <tspan fill="${isDark ? '#FFFFFF' : '#2E2E2E'}">TOGO</tspan>
        <tspan fill="#F4B400">SERVE</tspan>
      </text>

      <!-- Descriptor: COMMERCE • LOGISTICS • AI -->
      <text x="122" y="98" font-family="'Inter', sans-serif" font-size="16" font-weight="700" letter-spacing="4.5" fill="${isDark ? '#D9C39A' : '#2E2E2E'}">
        COMMERCE <tspan fill="#F4B400" font-size="18">•</tspan> LOGISTICS <tspan fill="#F4B400" font-size="18">•</tspan> AI
      </text>
    </svg>
  `;

  // Render horizontal logos
  const horizLightSvg = fullHorizontalLogoSvg(false);
  const horizDarkSvg = fullHorizontalLogoSvg(true);

  // Write SVG files
  fs.writeFileSync(path.join(LEGACY_BRAND_DIR, 'togoserve-logo.svg'), horizLightSvg);
  fs.writeFileSync(path.join(LEGACY_BRAND_DIR, 'togoserve-logo-white.svg'), horizDarkSvg);
  fs.writeFileSync(path.join(LEGACY_BRAND_DIR, 'togoserve-symbol.svg'), symbolSvg(false));
  fs.writeFileSync(path.join(LEGACY_BRAND_DIR, 'togoserve-symbol-white.svg'), symbolSvg(true));

  // Render PNG variations
  await sharp(Buffer.from(horizLightSvg))
    .png()
    .toFile(path.join(BRANDING_DIR, 'logo-primary.png'));

  await sharp(Buffer.from(horizLightSvg))
    .png()
    .toFile(path.join(BRANDING_DIR, 'logo-horizontal.png'));

  await sharp(Buffer.from(horizLightSvg))
    .png()
    .toFile(path.join(BRANDING_DIR, 'logo-light.png'));

  await sharp(Buffer.from(horizLightSvg))
    .png()
    .toFile(path.join(BRANDING_DIR, 'logo-transparent.png'));

  await sharp(Buffer.from(horizDarkSvg))
    .png()
    .toFile(path.join(BRANDING_DIR, 'logo-dark.png'));

  // Header & Footer sized PNGs
  await sharp(Buffer.from(horizLightSvg))
    .resize(360, 72, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(BRANDING_DIR, 'logo-header.png'));

  await sharp(Buffer.from(horizLightSvg))
    .resize(380, 76, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(BRANDING_DIR, 'logo-footer.png'));

  // Also update legacy PNGs
  await sharp(Buffer.from(horizLightSvg))
    .resize(360, 72, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(LEGACY_BRAND_DIR, 'togoserve-logo-horizontal.png'));

  await sharp(Buffer.from(horizDarkSvg))
    .resize(360, 72, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(LEGACY_BRAND_DIR, 'togoserve-logo-dark.png'));

  console.log('[Branding] Rendered horizontal, header, footer and dark/light logo variants');

  // 3. Application Icons & Favicons Package
  // App icon squircle SVG (512x512) with dark charcoal background (#2E2E2E) and gold T
  const appIconSvg = `
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="128" fill="#2E2E2E" />
      <g transform="translate(64, 64) scale(3.2)">
        <defs>
          <linearGradient id="appGoldT" x1="10" y1="15" x2="85" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FFD54F" />
            <stop offset="60%" stop-color="#F4B400" />
            <stop offset="100%" stop-color="#D9A514" />
          </linearGradient>
        </defs>
        <!-- Stylized Metallic Gold T -->
        <path d="M6 14C6 9.58 9.58 6 14 6H78C82.42 6 86 9.58 86 14V20C86 24.42 82.42 28 78 28H56V88C56 93.52 51.52 98 46 98C40.48 98 36 93.52 36 88V28H14C9.58 28 6 24.42 6 20V14Z" fill="url(#appGoldT)" />
        <!-- Wing Accent in light off-white/gold -->
        <path d="M58 32C58 29.8 59.8 28 62 28H78C80.2 28 82 29.8 82 32V64C82 68.42 78.42 72 74 72H62C59.8 72 58 70.2 58 68V32Z" fill="#EBEEEE" />
      </g>
    </svg>
  `;

  const appIconBuffer = Buffer.from(appIconSvg);

  // App icon 512
  await sharp(appIconBuffer)
    .resize(512, 512)
    .toFile(path.join(ICONS_DIR, 'app-icon-512.png'));

  // Android Chrome 512
  await sharp(appIconBuffer)
    .resize(512, 512)
    .toFile(path.join(ICONS_DIR, 'android-chrome-512x512.png'));

  // Maskable icon 512 (with safe padding zone)
  const maskableSvg = `
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#2E2E2E" />
      <g transform="translate(106, 106) scale(2.5)">
        <defs>
          <linearGradient id="maskGoldT" x1="10" y1="15" x2="85" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FFD54F" />
            <stop offset="60%" stop-color="#F4B400" />
            <stop offset="100%" stop-color="#D9A514" />
          </linearGradient>
        </defs>
        <path d="M6 14C6 9.58 9.58 6 14 6H78C82.42 6 86 9.58 86 14V20C86 24.42 82.42 28 78 28H56V88C56 93.52 51.52 98 46 98C40.48 98 36 93.52 36 88V28H14C9.58 28 6 24.42 6 20V14Z" fill="url(#maskGoldT)" />
        <path d="M58 32C58 29.8 59.8 28 62 28H78C80.2 28 82 29.8 82 32V64C82 68.42 78.42 72 74 72H62C59.8 72 58 70.2 58 68V32Z" fill="#EBEEEE" />
      </g>
    </svg>
  `;
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .toFile(path.join(ICONS_DIR, 'maskable-icon-512.png'));

  // Android Chrome 192
  await sharp(appIconBuffer)
    .resize(192, 192)
    .toFile(path.join(ICONS_DIR, 'android-chrome-192x192.png'));

  // Apple Touch Icon 180
  await sharp(appIconBuffer)
    .resize(180, 180)
    .toFile(path.join(ICONS_DIR, 'apple-touch-icon.png'));

  // Favicons 32x32 & 16x16
  await sharp(appIconBuffer)
    .resize(32, 32)
    .toFile(path.join(ICONS_DIR, 'favicon-32x32.png'));

  await sharp(appIconBuffer)
    .resize(16, 16)
    .toFile(path.join(ICONS_DIR, 'favicon-16x16.png'));

  // Create favicon.ico (copy of 32x32 PNG with ICO header or PNG format which modern browsers support)
  const fav32 = await sharp(appIconBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(ICONS_DIR, 'favicon.ico'), fav32);
  fs.writeFileSync(path.resolve('public/favicon.ico'), fav32);

  console.log('[Branding] Rendered favicon and application icon package');

  // 4. Social Preview Card (1200 x 630) OpenGraph
  const socialSvg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#FAFAFA" />
      
      <!-- Subtle Luxury Gold Wave Accents in Background -->
      <path d="M-100 630C200 630 350 480 500 420C650 360 850 440 1300 280V630H-100Z" fill="#F4B400" fill-opacity="0.08" />
      <path d="M100 630C400 630 550 510 700 450C850 390 1050 470 1300 350V630H100Z" fill="#FFD54F" fill-opacity="0.12" />

      <!-- Left Content: Logo & Headlines -->
      <g transform="translate(80, 80)">
        <!-- Horizontal Logo -->
        <g transform="scale(1.1)">
          <g>
            <defs>
              <linearGradient id="socGoldT" x1="10" y1="15" x2="85" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#FFD54F" />
                <stop offset="60%" stop-color="#F4B400" />
                <stop offset="100%" stop-color="#D9A514" />
              </linearGradient>
            </defs>
            <path d="M6 14C6 9.58 9.58 6 14 6H78C82.42 6 86 9.58 86 14V20C86 24.42 82.42 28 78 28H56V88C56 93.52 51.52 98 46 98C40.48 98 36 93.52 36 88V28H14C9.58 28 6 24.42 6 20V14Z" fill="url(#socGoldT)" />
            <path d="M58 32C58 29.8 59.8 28 62 28H78C80.2 28 82 29.8 82 32V64C82 68.42 78.42 72 74 72H62C59.8 72 58 70.2 58 68V32Z" fill="#2E2E2E" />
          </g>
          <text x="110" y="62" font-family="'Inter', sans-serif" font-size="46" font-weight="900" letter-spacing="-1">
            <tspan fill="#2E2E2E">TOGO</tspan>
            <tspan fill="#F4B400">SERVE</tspan>
          </text>
          <text x="112" y="88" font-family="'Inter', sans-serif" font-size="14" font-weight="700" letter-spacing="4" fill="#2E2E2E">
            COMMERCE <tspan fill="#F4B400">•</tspan> LOGISTICS <tspan fill="#F4B400">•</tspan> AI
          </text>
        </g>

        <!-- Main Heading -->
        <text x="0" y="210" font-family="'Inter', sans-serif" font-size="46" font-weight="800" fill="#2E2E2E" letter-spacing="-1.5">
          Everything Your Business
        </text>
        <text x="0" y="265" font-family="'Inter', sans-serif" font-size="46" font-weight="800" fill="#2E2E2E" letter-spacing="-1.5">
          Needs to Move Forward
        </text>

        <!-- Supporting Heading -->
        <text x="0" y="320" font-family="'Inter', sans-serif" font-size="20" font-weight="600" fill="#F4B400">
          AI-Native Commerce, Logistics &amp; Multi-Agent Operating Platform
        </text>

        <!-- Description -->
        <text x="0" y="365" font-family="'Inter', sans-serif" font-size="16" font-weight="400" fill="#64748B">
          Connecting people, businesses and communities through intelligent
        </text>
        <text x="0" y="392" font-family="'Inter', sans-serif" font-size="16" font-weight="400" fill="#64748B">
          commerce, seamless logistics and AI-powered solutions.
        </text>

        <!-- Feature Pills -->
        <g transform="translate(0, 430)">
          <rect width="190" height="38" rx="8" fill="#EBEEEE" />
          <text x="18" y="24" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#2E2E2E">AI-Powered Operations</text>
          
          <rect x="206" width="175" height="38" rx="8" fill="#EBEEEE" />
          <text x="224" y="24" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#2E2E2E">Integrated Logistics</text>

          <rect x="397" width="165" height="38" rx="8" fill="#EBEEEE" />
          <text x="415" y="24" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#2E2E2E">Business Growth</text>
        </g>
      </g>
    </svg>
  `;

  // Composite social SVG with circular emblem on the right side
  const socialBase = await sharp(Buffer.from(socialSvg)).png().toBuffer();
  
  if (fs.existsSync(path.join(BRANDING_DIR, 'logo-circular.png'))) {
    const emblemThumb = await sharp(path.join(BRANDING_DIR, 'logo-circular.png'))
      .resize(440, 440)
      .toBuffer();

    await sharp(socialBase)
      .composite([
        {
          input: emblemThumb,
          top: 95,
          left: 690,
        }
      ])
      .toFile(path.join(SOCIAL_DIR, 'social-preview.png'));
  } else {
    await sharp(socialBase).toFile(path.join(SOCIAL_DIR, 'social-preview.png'));
  }

  console.log('[Branding] Rendered social-preview.png (1200x630)');
  console.log('[Branding] Official corporate branding asset generation COMPLETE.');
}

buildOfficialAssets().catch(err => {
  console.error('[Branding] Generation error:', err);
  process.exit(1);
});
