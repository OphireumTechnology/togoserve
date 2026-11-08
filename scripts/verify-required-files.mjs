import { existsSync } from 'node:fs';

const requiredFiles = [
  'src/data/demoMerchants.ts',
  'src/data/productionRegistry.ts',
  'src/context/AppContext.tsx',
  'src/components/views/MarketplaceView.tsx',
  'src/components/marketplace/MerchantStorefrontModal.tsx',
  'src/components/brand/OfficialLogo.tsx',
  'public/branding/togoserve-official-circular.png',
];

const missing = requiredFiles.filter((file) => !existsSync(file));

if (missing.length > 0) {
  console.error('❌ Missing required files:', missing);
  process.exit(1);
}

console.log('✅ Required source files verified successfully.');
