import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Official Logo: Approved circular emblem assets exist and are valid PNGs', () => {
  const root = process.cwd();
  const officialLogoPath = path.join(root, 'public', 'branding', 'togoserve-official-circular.png');
  const transparentLogoPath = path.join(root, 'public', 'branding', 'togoserve', 'logo-transparent.png');
  const circularLogoPath = path.join(root, 'public', 'branding', 'togoserve', 'logo-circular.png');

  assert.ok(fs.existsSync(officialLogoPath), 'public/branding/togoserve-official-circular.png must exist');
  assert.ok(fs.existsSync(transparentLogoPath), 'public/branding/togoserve/logo-transparent.png must exist');
  assert.ok(fs.existsSync(circularLogoPath), 'public/branding/togoserve/logo-circular.png must exist');

  // Verify file size is substantial (not empty or corrupted placeholder)
  const stats = fs.statSync(officialLogoPath);
  assert.ok(stats.size > 50000, `Official circular logo file must be high-res (size: ${stats.size} bytes)`);

  // Verify PNG header signature (89 50 4E 47 0D 0A 1A 0A)
  const buffer = fs.readFileSync(officialLogoPath);
  assert.equal(buffer[0], 0x89);
  assert.equal(buffer[1], 0x50);
  assert.equal(buffer[2], 0x4e);
  assert.equal(buffer[3], 0x47);
});

test('Official Logo: Header and Footer use official circular logo', () => {
  const root = process.cwd();
  const headerContent = fs.readFileSync(path.join(root, 'src', 'components', 'common', 'Header.tsx'), 'utf8');
  const footerContent = fs.readFileSync(path.join(root, 'src', 'components', 'common', 'Footer.tsx'), 'utf8');
  const officialLogoSource = fs.readFileSync(path.join(root, 'src', 'components', 'brand', 'OfficialLogo.tsx'), 'utf8');

  // Verify Header uses OfficialLogo
  assert.ok(headerContent.includes('<OfficialLogo'), 'Header.tsx must render <OfficialLogo');

  // Verify Footer uses OfficialLogo
  assert.ok(footerContent.includes('<OfficialLogo'), 'Footer.tsx must render <OfficialLogo');

  // Verify OfficialLogo points to official circular logo asset
  assert.ok(
    officialLogoSource.includes('/branding/togoserve-official-circular.png'),
    'OfficialLogo.tsx must reference /branding/togoserve-official-circular.png'
  );
  assert.ok(
    officialLogoSource.includes('togoserve-official-logo'),
    'OfficialLogo.tsx must use the .togoserve-official-logo class'
  );
});

test('Official Logo: Responsive styling rules defined in index.css', () => {
  const root = process.cwd();
  const cssContent = fs.readFileSync(path.join(root, 'src', 'index.css'), 'utf8');

  assert.ok(cssContent.includes('.togoserve-official-logo'), 'index.css must define .togoserve-official-logo');
  assert.ok(cssContent.includes('height: 54px;'), 'Desktop height must be 54px');
  assert.ok(cssContent.includes('height: 44px;'), 'Mobile height must be 44px');
});
