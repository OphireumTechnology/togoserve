import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'src/components/views/MarketplaceView.tsx',
  'src/components/views/MerchantOSView.tsx',
  'src/components/views/PadalaView.tsx',
  'src/components/views/POSRegisterView.tsx',
  'src/components/views/RiderPortalView.tsx',
  'src/components/views/SupplierPortalView.tsx',
  'src/components/views/FleetManagementView.tsx',
  'src/components/views/AnalyticsView.tsx',
  'src/components/views/AICommandCenterView.tsx',
  'src/components/common/AuthModal.tsx',
  'src/components/common/CartDrawer.tsx',
  'src/components/common/CloudSyncIndicator.tsx',
  'src/components/common/CommandPalette.tsx',
  'src/components/common/ShortcutsModal.tsx',
  'src/components/common/ToastContainer.tsx',
];

console.log('[Branding] Applying official corporate color mapping...');

for (const relPath of filesToUpdate) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`[Branding] Skipping missing file: ${relPath}`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;

  // Replace old navy #071A2F with charcoal #2E2E2E
  content = content.replaceAll('#071A2F', '#2E2E2E');

  // Replace old text #17212B with charcoal #2E2E2E
  content = content.replaceAll('#17212B', '#2E2E2E');

  // Replace old background #F5F7FA with off-white #FAFAFA
  content = content.replaceAll('#F5F7FA', '#FAFAFA');

  // Replace old gold #D9A514 with mustard gold #F4B400
  content = content.replaceAll('#D9A514', '#F4B400');

  // Replace old bright yellow #FFC928 with mustard gold #F4B400 (or #FFD54F for stars)
  content = content.replaceAll('#FFC928', '#F4B400');

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`[Branding] Successfully updated ${relPath}`);
  } else {
    console.log(`[Branding] No old colors found in ${relPath}`);
  }
}

console.log('[Branding] Corporate color tokens applied across all views.');
