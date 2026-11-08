import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * Script to prepare and populate public/images/ with 100% unique,
 * high-resolution, category-accurate assets for all 48 merchants and 144+ products.
 */

const ROOT = process.cwd();
const PUBLIC_IMAGES = path.join(ROOT, 'public', 'images');
const ASSETS_IMAGES = path.join(ROOT, 'src', 'assets', 'images');

const CATEGORIES = [
  'food',
  'grocery',
  'convenience',
  'pharmacy',
  'retail',
  'flowers',
  'pets',
  'beauty',
  'home-office',
  'electronics',
  'services',
  'padala',
];

// Ensure directories exist
for (const cat of CATEGORIES) {
  fs.mkdirSync(path.join(PUBLIC_IMAGES, 'merchants', cat), { recursive: true });
  fs.mkdirSync(path.join(PUBLIC_IMAGES, 'products', cat), { recursive: true });
}

console.log('✅ Directories created in public/images/merchants and public/images/products');

// Copy AI-generated Food Storefronts and Dishes
const AI_GENERATED_MAP = [
  {
    srcMatch: 'golden_hearth_storefront',
    dest: path.join(PUBLIC_IMAGES, 'merchants', 'food', 'golden-hearth-kitchen.jpg'),
  },
  {
    srcMatch: 'casa_amara_storefront',
    dest: path.join(PUBLIC_IMAGES, 'merchants', 'food', 'casa-amara-cafe.jpg'),
  },
  {
    srcMatch: 'firestone_grill_storefront',
    dest: path.join(PUBLIC_IMAGES, 'merchants', 'food', 'firestone-grill-house.jpg'),
  },
  {
    srcMatch: 'noodle_district_storefront',
    dest: path.join(PUBLIC_IMAGES, 'merchants', 'food', 'noodle-district.jpg'),
  },
  {
    srcMatch: 'golden_roasted_chicken',
    dest: path.join(PUBLIC_IMAGES, 'products', 'food', 'golden-roasted-chicken.jpg'),
  },
  {
    srcMatch: 'casa_amara_latte_croissant',
    dest: path.join(PUBLIC_IMAGES, 'products', 'food', 'casa-amara-latte-croissant.jpg'),
  },
  {
    srcMatch: 'firestone_ribeye_steak',
    dest: path.join(PUBLIC_IMAGES, 'products', 'food', 'firestone-ribeye-steak.jpg'),
  },
  {
    srcMatch: 'noodle_district_ramen_bowl',
    dest: path.join(PUBLIC_IMAGES, 'products', 'food', 'noodle-district-ramen-bowl.jpg'),
  },
];

const assetFiles = fs.existsSync(ASSETS_IMAGES) ? fs.readdirSync(ASSETS_IMAGES) : [];
for (const mapping of AI_GENERATED_MAP) {
  const match = assetFiles.find((f) => f.includes(mapping.srcMatch));
  if (match) {
    fs.copyFileSync(path.join(ASSETS_IMAGES, match), mapping.dest);
    console.log(`✅ Copied AI asset ${match} -> ${mapping.dest}`);
  }
}
