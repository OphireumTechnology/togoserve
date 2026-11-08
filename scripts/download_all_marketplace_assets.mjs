import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

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

for (const cat of CATEGORIES) {
  fs.mkdirSync(path.join(PUBLIC_IMAGES, 'merchants', cat), { recursive: true });
  fs.mkdirSync(path.join(PUBLIC_IMAGES, 'products', cat), { recursive: true });
}

// 48 UNIQUE STOREFRONTS
// Food uses local AI-generated images.
// Other 11 categories use carefully chosen distinct Unsplash photography IDs.
export const STOREFRONT_MANIFEST = [
  // Food
  { id: 'merch-food-1', file: 'merchants/food/golden-hearth-kitchen.jpg', localSrc: 'golden_hearth_storefront' },
  { id: 'merch-food-2', file: 'merchants/food/casa-amara-cafe.jpg', localSrc: 'casa_amara_storefront' },
  { id: 'merch-food-3', file: 'merchants/food/firestone-grill-house.jpg', localSrc: 'firestone_grill_storefront' },
  { id: 'merch-food-4', file: 'merchants/food/noodle-district.jpg', localSrc: 'noodle_district_storefront' },

  // Grocery
  { id: 'merch-groc-1', file: 'merchants/grocery/bukid-fresh-highlands.jpg', unsplashId: 'photo-1542838132-92c53300491e' },
  { id: 'merch-groc-2', file: 'merchants/grocery/isla-verde-pantry.jpg', unsplashId: 'photo-1578916171728-46686eac8d58' },
  { id: 'merch-groc-3', file: 'merchants/grocery/pacific-harvest-seafood.jpg', unsplashId: 'photo-1534483509719-3feaee7c30da' },
  { id: 'merch-groc-4', file: 'merchants/grocery/hacienda-citrus-fruits.jpg', unsplashId: 'photo-1619566636858-adf3ef46400b' },

  // Convenience
  { id: 'merch-conv-1', file: 'merchants/convenience/quickstop-247-metro.jpg', unsplashId: 'photo-1528698827591-e19ccd7bc23d' },
  { id: 'merch-conv-2', file: 'merchants/convenience/midnightbite-bodega.jpg', unsplashId: 'photo-1604719312566-8912e9227c6a' },
  { id: 'merch-conv-3', file: 'merchants/convenience/cornerstore-essentials.jpg', unsplashId: 'photo-1550989460-0adf9ea622e2' },
  { id: 'merch-conv-4', file: 'merchants/convenience/apex-minimart.jpg', unsplashId: 'photo-1563245372-f21724e3856d' },

  // Pharmacy
  { id: 'merch-pharm-1', file: 'merchants/pharmacy/curative-wellness-hub.jpg', unsplashId: 'photo-1586015555751-63bb77f4322a' },
  { id: 'merch-pharm-2', file: 'merchants/pharmacy/botanica-herbal-dispensary.jpg', unsplashId: 'photo-1512069772995-ec65ed45afd6' },
  { id: 'merch-pharm-3', file: 'merchants/pharmacy/dermacare-clinical-care.jpg', unsplashId: 'photo-1522337360788-8b13dee7a37e' },
  { id: 'merch-pharm-4', file: 'merchants/pharmacy/lifeline-first-aid-depot.jpg', unsplashId: 'photo-1584308666744-24d5c474f2ae' },

  // Retail
  { id: 'merch-ret-1', file: 'merchants/retail/atelier-habi-manila.jpg', unsplashId: 'photo-1441986300917-64674bd600d8' },
  { id: 'merch-ret-2', file: 'merchants/retail/solecraft-footwear.jpg', unsplashId: 'photo-1449505278894-297fdb3edbc1' },
  { id: 'merch-ret-3', file: 'merchants/retail/archipelago-apparel.jpg', unsplashId: 'photo-1489987707025-afc232f7ea0f' },
  { id: 'merch-ret-4', file: 'merchants/retail/tala-leathercraft.jpg', unsplashId: 'photo-1473188557829-c147e42e327a' },

  // Flowers & Gifts
  { id: 'merch-flow-1', file: 'merchants/flowers/bloom-stem-atelier.jpg', unsplashId: 'photo-1526047932273-341f2a7631f9' },
  { id: 'merch-flow-2', file: 'merchants/flowers/petal-box-manila.jpg', unsplashId: 'photo-1582794543139-8ac9cb0f7b11' },
  { id: 'merch-flow-3', file: 'merchants/flowers/verde-botanica-foliage.jpg', unsplashId: 'photo-1485955900006-10f4d324d411' },
  { id: 'merch-flow-4', file: 'merchants/flowers/heritage-gift-guild.jpg', unsplashId: 'photo-1549465220-1a8b9238cd48' },

  // Pet Care
  { id: 'merch-pet-1', file: 'merchants/pets/paws-tails-nutrition.jpg', unsplashId: 'photo-1583511655857-d19b40a7a54e' },
  { id: 'merch-pet-2', file: 'merchants/pets/furry-haven-grooming.jpg', unsplashId: 'photo-1516734212186-a967f81ad0d7' },
  { id: 'merch-pet-3', file: 'merchants/pets/bark-purr-toys-gear.jpg', unsplashId: 'photo-1535930891776-0c2dfb7fda1a' },
  { id: 'merch-pet-4', file: 'merchants/pets/companion-habitat-supply.jpg', unsplashId: 'photo-1541781774459-bb2af2f05b55' },

  // Beauty & Wellness
  { id: 'merch-beau-1', file: 'merchants/beauty/lumina-skincare-labs.jpg', unsplashId: 'photo-1556228720-195a672e8a03' },
  { id: 'merch-beau-2', file: 'merchants/beauty/sinta-natural-botanicals.jpg', unsplashId: 'photo-1608248597359-54378f44ffef' },
  { id: 'merch-beau-3', file: 'merchants/beauty/solstice-glow-cosmetics.jpg', unsplashId: 'photo-1512496015851-a90fb38ba796' },
  { id: 'merch-beau-4', file: 'merchants/beauty/sanctuary-aroma-spa.jpg', unsplashId: 'photo-1544367567-0f2fcb009e0b' },

  // Home & Office
  { id: 'merch-home-1', file: 'merchants/home-office/ergonomia-workspace.jpg', unsplashId: 'photo-1524758631624-e2822e304c36' },
  { id: 'merch-home-2', file: 'merchants/home-office/minimalist-living-co.jpg', unsplashId: 'photo-1513519245088-0e12902e5a38' },
  { id: 'merch-home-3', file: 'merchants/home-office/casa-moderna-lighting.jpg', unsplashId: 'photo-1507473885765-e6ed057f782c' },
  { id: 'merch-home-4', file: 'merchants/home-office/papercraft-guild.jpg', unsplashId: 'photo-1583485088034-697b5bc54ccd' },

  // Electronics
  { id: 'merch-elec-1', file: 'merchants/electronics/voltmax-power-hub.jpg', unsplashId: 'photo-1583394838336-acd977736f90' },
  { id: 'merch-elec-2', file: 'merchants/electronics/sonicpulse-audio-labs.jpg', unsplashId: 'photo-1505740420928-5e560c06d30e' },
  { id: 'merch-elec-3', file: 'merchants/electronics/gadgetguard-protective.jpg', unsplashId: 'photo-1580910051074-3eb694886505' },
  { id: 'merch-elec-4', file: 'merchants/electronics/smartliving-iot-hub.jpg', unsplashId: 'photo-1558002038-1055907df827' },

  // Local Services
  { id: 'merch-serv-1', file: 'merchants/services/aircool-pro-hvac.jpg', unsplashId: 'photo-1621905251189-08b45d6a269e' },
  { id: 'merch-serv-2', file: 'merchants/services/cleansweep-residential.jpg', unsplashId: 'photo-1581578731548-c64695cc6952' },
  { id: 'merch-serv-3', file: 'merchants/services/fixit-quick-handyman.jpg', unsplashId: 'photo-1581244277943-fe4a9c777189' },
  { id: 'merch-serv-4', file: 'merchants/services/washcraft-laundry-shoes.jpg', unsplashId: 'photo-1545173168-9f1947eebb7f' },

  // TOGO Padala
  { id: 'merch-padala-1', file: 'merchants/padala/togo-padala-bike-hub.jpg', unsplashId: 'photo-1558981403-c5f9899a28bc' },
  { id: 'merch-padala-2', file: 'merchants/padala/togo-padala-multistop-hub.jpg', unsplashId: 'photo-1586528116311-ad8dd3c8310d' },
  { id: 'merch-padala-3', file: 'merchants/padala/togo-padala-cargo-van-depot.jpg', unsplashId: 'photo-1519003722824-194d4455a60c' },
  { id: 'merch-padala-4', file: 'merchants/padala/togo-padala-heavy-truck-freight.jpg', unsplashId: 'photo-1601584115197-04ecc0da31d7' },
];

// 144 UNIQUE PRODUCTS (Each product has its own DISTINCT photo ID, matching the item!)
export const PRODUCT_MANIFEST = [
  // Food - Golden Hearth Kitchen
  { id: 'prod-food-101', file: 'products/food/golden-roasted-chicken.jpg', localSrc: 'golden_roasted_chicken' },
  { id: 'prod-food-102', file: 'products/food/crispy-lechon-kawali.jpg', unsplashId: 'photo-1598515214211-89d3c73ae83b' },
  { id: 'prod-food-103', file: 'products/food/tamarind-sinigang-soup.jpg', unsplashId: 'photo-1547592166-23ac45744acd' },

  // Food - Casa Amara Café
  { id: 'prod-food-201', file: 'products/food/casa-amara-latte-croissant.jpg', localSrc: 'casa_amara_latte_croissant' },
  { id: 'prod-food-202', file: 'products/food/basque-burnt-cheesecake.jpg', unsplashId: 'photo-1533134242443-d4fd215305ad' },
  { id: 'prod-food-203', file: 'products/food/cold-brew-reserve-bottle.jpg', unsplashId: 'photo-1517701550927-30cf4ba1dba5' },

  // Food - Firestone Grill House
  { id: 'prod-food-301', file: 'products/food/firestone-ribeye-steak.jpg', localSrc: 'firestone_ribeye_steak' },
  { id: 'prod-food-302', file: 'products/food/bbq-baby-back-ribs.jpg', unsplashId: 'photo-1544025162-d76694265947' },
  { id: 'prod-food-303', file: 'products/food/grilled-sweet-corn-elote.jpg', unsplashId: 'photo-1551782450-a2132b4ba21d' },

  // Food - Noodle District
  { id: 'prod-food-401', file: 'products/food/noodle-district-ramen-bowl.jpg', localSrc: 'noodle_district_ramen_bowl' },
  { id: 'prod-food-402', file: 'products/food/beef-brisket-wonton-soup.jpg', unsplashId: 'photo-1569718212165-3a8278d5f624' },
  { id: 'prod-food-403', file: 'products/food/spicy-dan-dan-noodles.jpg', unsplashId: 'photo-1552611052-33e04de081de' },

  // Grocery - Bukid Fresh Highlands Organics
  { id: 'prod-groc-101', file: 'products/grocery/fresh-benguet-strawberries.jpg', unsplashId: 'photo-1464965911861-746a04b4bca6' },
  { id: 'prod-groc-102', file: 'products/grocery/organic-curly-kale-box.jpg', unsplashId: 'photo-1524179091875-bf99a9a6fa57' },
  { id: 'prod-groc-103', file: 'products/grocery/heirloom-rainbow-carrots.jpg', unsplashId: 'photo-1598170845058-32b9d6a5da37' },

  // Grocery - Isla Verde Artisanal Pantry
  { id: 'prod-groc-201', file: 'products/grocery/single-estate-dinorado-rice.jpg', unsplashId: 'photo-1586201375761-83865001e31c' },
  { id: 'prod-groc-202', file: 'products/grocery/davao-single-origin-tablea.jpg', unsplashId: 'photo-1549007994-cb92caebd54b' },
  { id: 'prod-groc-203', file: 'products/grocery/virgin-coconut-oil-glass.jpg', unsplashId: 'photo-1526947425960-945c6e72858f' },

  // Grocery - Pacific Harvest Seafood Depot
  { id: 'prod-groc-301', file: 'products/grocery/atlantic-salmon-fillet.jpg', unsplashId: 'photo-1467003909585-2f8a72700288' },
  { id: 'prod-groc-302', file: 'products/grocery/head-on-tiger-prawns.jpg', unsplashId: 'photo-1565680018434-b513d5e5fd47' },
  { id: 'prod-groc-303', file: 'products/grocery/yellowfin-tuna-loin-steak.jpg', unsplashId: 'photo-1501595091296-3aa970afb3ff' },

  // Grocery - Hacienda Citrus & Fruits Co.
  { id: 'prod-groc-401', file: 'products/grocery/guimaras-carabao-mangoes.jpg', unsplashId: 'photo-1553279768-865429fa0078' },
  { id: 'prod-groc-402', file: 'products/grocery/davao-golden-honey-pomelo.jpg', unsplashId: 'photo-1587132137056-bfbf0166836e' },
  { id: 'prod-groc-403', file: 'products/grocery/cavendish-bananas-cluster.jpg', unsplashId: 'photo-1571771894821-ce9b6c11b08e' },

  // Convenience - QuickStop 24/7 Metro Express
  { id: 'prod-conv-101', file: 'products/convenience/electrolyte-mineral-drink.jpg', unsplashId: 'photo-1527661591475-527312dd65f5' },
  { id: 'prod-conv-102', file: 'products/convenience/almonds-cranberry-trail-mix.jpg', unsplashId: 'photo-1509912760195-456073832d20' },
  { id: 'prod-conv-103', file: 'products/convenience/purified-tube-ice-bag.jpg', unsplashId: 'photo-1518173946687-a4c8a383392e' },

  // Convenience - midnightBite Pantry & Bodega
  { id: 'prod-conv-201', file: 'products/convenience/spicy-kimchi-ramen-pack.jpg', unsplashId: 'photo-1612927601601-6638404737ce' },
  { id: 'prod-conv-202', file: 'products/convenience/sparkling-yuzu-calamansi-soda.jpg', unsplashId: 'photo-1581009146145-b5ef050c2e1e' },
  { id: 'prod-conv-203', file: 'products/convenience/sea-salt-truffle-chips.jpg', unsplashId: 'photo-1566478989037-eec170784d0b' },

  // Convenience - CornerStore Daily Essentials
  { id: 'prod-conv-301', file: 'products/convenience/natural-spring-water-pack.jpg', unsplashId: 'photo-1548839140-29a749e1bc4e' },
  { id: 'prod-conv-302', file: 'products/convenience/bamboo-bathroom-tissue.jpg', unsplashId: 'photo-1584556812952-905ffd0c611a' },
  { id: 'prod-conv-303', file: 'products/convenience/alkaline-aa-batteries-pack.jpg', unsplashId: 'photo-1619725002198-6a689b72f41d' },

  // Convenience - Apex MiniMart Station
  { id: 'prod-conv-401', file: 'products/convenience/nitro-cold-brew-can.jpg', unsplashId: 'photo-1517701604599-bb29b565090c' },
  { id: 'prod-conv-402', file: 'products/convenience/antibacterial-disinfecting-wipes.jpg', unsplashId: 'photo-1584483766114-2cea6facdf57' },
  { id: 'prod-conv-403', file: 'products/convenience/dark-chocolate-granola-bar.jpg', unsplashId: 'photo-1590080875515-8a3a8dc5735e' },

  // Pharmacy - Curative Wellness & Non-Rx Hub
  { id: 'prod-pharm-101', file: 'products/pharmacy/vitamin-c-zinc-effervescent.jpg', unsplashId: 'photo-1550572017-ed200f5e6343' },
  { id: 'prod-pharm-102', file: 'products/pharmacy/trauma-first-aid-kit.jpg', unsplashId: 'photo-1603398938378-e54eab446dde' },
  { id: 'prod-pharm-103', file: 'products/pharmacy/menthol-eucalyptus-lozenges.jpg', unsplashId: 'photo-1471864190281-a93a3070b6de' },

  // Pharmacy - Botanica Herbal Dispensary
  { id: 'prod-pharm-201', file: 'products/pharmacy/lagundi-herbal-cough-syrup.jpg', unsplashId: 'photo-1584017911766-d451b3d0e843' },
  { id: 'prod-pharm-202', file: 'products/pharmacy/spirulina-superfood-tablets.jpg', unsplashId: 'photo-1576092768241-dec231879fc3' },
  { id: 'prod-pharm-203', file: 'products/pharmacy/peppermint-clove-muscle-balm.jpg', unsplashId: 'photo-1544367567-0f2fcb009e0b' },

  // Pharmacy - Dermacare Clinical OTC Care
  { id: 'prod-pharm-301', file: 'products/pharmacy/ceramide-moisture-barrier-balm.jpg', unsplashId: 'photo-1608248597359-54378f44ffef' },
  { id: 'prod-pharm-302', file: 'products/pharmacy/mineral-zinc-sunscreen-spf50.jpg', unsplashId: 'photo-1556228720-195a672e8a03' },
  { id: 'prod-pharm-303', file: 'products/pharmacy/gentle-ph55-facial-cleanser.jpg', unsplashId: 'photo-1556228722-d0b5de70b774' },

  // Pharmacy - Lifeline Family First-Aid Depot
  { id: 'prod-pharm-401', file: 'products/pharmacy/infrared-digital-thermometer.jpg', unsplashId: 'photo-1584515979956-d9f6e5d09982' },
  { id: 'prod-pharm-402', file: 'products/pharmacy/antiseptic-wound-spray-aloe.jpg', unsplashId: 'photo-1584308666744-24d5c474f2ae' },
  { id: 'prod-pharm-403', file: 'products/pharmacy/flexible-waterproof-plasters.jpg', unsplashId: 'photo-1586015555751-63bb77f4322a' },

  // Retail - Atelier Habi Manila
  { id: 'prod-ret-101', file: 'products/retail/inabel-handwoven-tote-bag.jpg', unsplashId: 'photo-1544816155-12df9643f363' },
  { id: 'prod-ret-102', file: 'products/retail/french-linen-haori-jacket.jpg', unsplashId: 'photo-1591047139829-d91aecb6caea' },
  { id: 'prod-ret-103', file: 'products/retail/embroidered-cotton-pouch.jpg', unsplashId: 'photo-1553062407-98eeb64c6a62' },

  // Retail - SoleCraft Handcrafted Footwear
  { id: 'prod-ret-201', file: 'products/retail/burnished-cognac-penny-loafers.jpg', unsplashId: 'photo-1533867617858-e7b97e060509' },
  { id: 'prod-ret-202', file: 'products/retail/cushioned-leather-slide-sandals.jpg', unsplashId: 'photo-1603487742131-4160ec999306' },
  { id: 'prod-ret-203', file: 'products/retail/beeswax-leather-conditioner.jpg', unsplashId: 'photo-1516762689617-e1cffcef479d' },

  // Retail - Archipelago Apparel Co.
  { id: 'prod-ret-301', file: 'products/retail/heavyweight-pima-cotton-tee.jpg', unsplashId: 'photo-1521572267360-ee0c2909d518' },
  { id: 'prod-ret-302', file: 'products/retail/textured-linen-resort-shirt.jpg', unsplashId: 'photo-1596755094514-f87e34085b2c' },
  { id: 'prod-ret-303', file: 'products/retail/unstructured-twill-ballcap.jpg', unsplashId: 'photo-1588850561407-ed78c282e89b' },

  // Retail - Tala Minimalist Leathercraft
  { id: 'prod-ret-401', file: 'products/retail/whiskey-tan-cardholder-wallet.jpg', unsplashId: 'photo-1627123424574-724758594e93' },
  { id: 'prod-ret-402', file: 'products/retail/padded-leather-laptop-sleeve.jpg', unsplashId: 'photo-1544816155-225381a17960' },
  { id: 'prod-ret-403', file: 'products/retail/solid-brass-key-clip-lanyard.jpg', unsplashId: 'photo-1607604276583-eef5d076aa5f' },

  // Flowers & Gifts - Bloom & Stem Atelier
  { id: 'prod-flow-101', file: 'products/flowers/parisian-blush-rose-bouquet.jpg', unsplashId: 'photo-1561181286-d3fee7d55364' },
  { id: 'prod-flow-102', file: 'products/flowers/holland-sunset-tulip-bundle.jpg', unsplashId: 'photo-1520763185298-1b434c919102' },
  { id: 'prod-flow-103', file: 'products/flowers/dried-lavender-bunny-tails.jpg', unsplashId: 'photo-1508610048659-a06b669e3321' },

  // Flowers & Gifts - Petal & Box Manila
  { id: 'prod-flow-201', file: 'products/flowers/preserved-eternal-crimson-rose.jpg', unsplashId: 'photo-1518709268805-4e9042af9f23' },
  { id: 'prod-flow-202', file: 'products/flowers/aromatherapy-candle-floral-hamper.jpg', unsplashId: 'photo-1603006905003-be475563bc59' },
  { id: 'prod-flow-203', file: 'products/flowers/velvet-hatbox-bloom-display.jpg', unsplashId: 'photo-1589244159943-460088ed5c92' },

  // Flowers & Gifts - Verde Botanica Potted Foliage
  { id: 'prod-flow-301', file: 'products/flowers/monstera-deliciosa-ceramic-pot.jpg', unsplashId: 'photo-1614594975525-e45190c55d0b' },
  { id: 'prod-flow-302', file: 'products/flowers/snake-plant-air-purifier.jpg', unsplashId: 'photo-1509423350716-97f9360b4e09' },
  { id: 'prod-flow-303', file: 'products/flowers/solid-brass-mist-sprayer.jpg', unsplashId: 'photo-1416879595882-3373a0480b5b' },

  // Flowers & Gifts - The Heritage Gift Guild
  { id: 'prod-flow-401', file: 'products/flowers/single-origin-chocolate-tasting-set.jpg', unsplashId: 'photo-1606312619070-d48b4c652a52' },
  { id: 'prod-flow-402', file: 'products/flowers/woven-bamboo-hamper-crate.jpg', unsplashId: 'photo-1549465220-1a8b9238cd48' },
  { id: 'prod-flow-403', file: 'products/flowers/cast-brass-capiz-coasters.jpg', unsplashId: 'photo-1513519245088-0e12902e5a38' },

  // Pet Care - Paws & Tails Nutrition Lab
  { id: 'prod-pet-101', file: 'products/pets/wild-salmon-grain-free-kibble.jpg', unsplashId: 'photo-1589924691995-400dc9ecc119' },
  { id: 'prod-pet-102', file: 'products/pets/freeze-dried-chicken-raw-bites.jpg', unsplashId: 'photo-1583511655857-d19b40a7a54e' },
  { id: 'prod-pet-103', file: 'products/pets/canine-probiotic-soft-chews.jpg', unsplashId: 'photo-1548767797-d8c844163c4c' },

  // Pet Care - Furry Haven Grooming & Wellness
  { id: 'prod-pet-201', file: 'products/pets/colloidal-oatmeal-pet-shampoo.jpg', unsplashId: 'photo-1583337130417-3346a1be7dee' },
  { id: 'prod-pet-202', file: 'products/pets/shea-butter-paw-balm.jpg', unsplashId: 'photo-1537151625747-768eb6cf92b2' },
  { id: 'prod-pet-203', file: 'products/pets/self-cleaning-slicker-brush.jpg', unsplashId: 'photo-1516734212186-a967f81ad0d7' },

  // Pet Care - Bark & Purr Co. Toys & Gear
  { id: 'prod-pet-301', file: 'products/pets/reflective-no-pull-dog-harness.jpg', unsplashId: 'photo-1543466835-00a7907e9de1' },
  { id: 'prod-pet-302', file: 'products/pets/carbon-fiber-cat-feather-teaser.jpg', unsplashId: 'photo-1514888286974-6c03e2ca1dba' },
  { id: 'prod-pet-303', file: 'products/pets/natural-rubber-dental-chew-ball.jpg', unsplashId: 'photo-1535930891776-0c2dfb7fda1a' },

  // Pet Care - Companion Habitat Supply
  { id: 'prod-pet-401', file: 'products/pets/flushable-tofu-cat-litter.jpg', unsplashId: 'photo-1541781774459-bb2af2f05b55' },
  { id: 'prod-pet-402', file: 'products/pets/stainless-steel-pet-water-fountain.jpg', unsplashId: 'photo-1574158622682-e40e69881006' },
  { id: 'prod-pet-403', file: 'products/pets/orthopedic-bolster-pet-bed.jpg', unsplashId: 'photo-1541599540903-216a46ca1dc0' },

  // Beauty & Wellness - Lumina Skincare Bio-Labs
  { id: 'prod-beau-101', file: 'products/beauty/niacinamide-zinc-clarifying-serum.jpg', unsplashId: 'photo-1620916566398-39f1143ab7be' },
  { id: 'prod-beau-102', file: 'products/beauty/peptide-recovery-cream.jpg', unsplashId: 'photo-1556228720-195a672e8a03' },
  { id: 'prod-beau-103', file: 'products/beauty/pure-plant-squalane-oil.jpg', unsplashId: 'photo-1608248597359-54378f44ffef' },

  // Beauty & Wellness - Sinta Natural Botanicals
  { id: 'prod-beau-201', file: 'products/beauty/cold-pressed-moringa-oil.jpg', unsplashId: 'photo-1601049541289-9b1b7bbbfe19' },
  { id: 'prod-beau-202', file: 'products/beauty/damask-rose-water-mist.jpg', unsplashId: 'photo-1571781926291-c477ebfd024b' },
  { id: 'prod-beau-203', file: 'products/beauty/raw-honey-beeswax-lip-balm.jpg', unsplashId: 'photo-1586495777744-4413f21062fa' },

  // Beauty & Wellness - Solstice Glow Cosmetics
  { id: 'prod-beau-301', file: 'products/beauty/dewy-cheek-lip-tint.jpg', unsplashId: 'photo-1596462502278-27bfdc403348' },
  { id: 'prod-beau-302', file: 'products/beauty/tinted-mineral-glow-sun-fluid.jpg', unsplashId: 'photo-1522337360788-8b13dee7a37e' },
  { id: 'prod-beau-303', file: 'products/beauty/micro-blade-brow-sculptor-gel.jpg', unsplashId: 'photo-1512496015851-a90fb38ba796' },

  // Beauty & Wellness - Sanctuary Aroma & Spa Rituals
  { id: 'prod-beau-401', file: 'products/beauty/french-lavender-essential-oil.jpg', unsplashId: 'photo-1544367567-0f2fcb009e0b' },
  { id: 'prod-beau-402', file: 'products/beauty/dead-sea-magnesium-bath-flakes.jpg', unsplashId: 'photo-1507652313519-d4e9174996dd' },
  { id: 'prod-beau-403', file: 'products/beauty/rose-quartz-gua-sha-sculptor.jpg', unsplashId: 'photo-1598440947619-2c35fc9aa908' },

  // Home & Office - Ergonomia Workspace Design
  { id: 'prod-home-101', file: 'products/home-office/aluminum-laptop-riser.jpg', unsplashId: 'photo-1527864550417-7fd91fc51a46' },
  { id: 'prod-home-102', file: 'products/home-office/memory-foam-lumbar-pillow.jpg', unsplashId: 'photo-1584100936595-c0654b55a2e2' },
  { id: 'prod-home-103', file: 'products/home-office/magnetic-cable-raceway.jpg', unsplashId: 'photo-1524758631624-e2822e304c36' },

  // Home & Office - Minimalist Living Co.
  { id: 'prod-home-201', file: 'products/home-office/bamboo-drawer-dividers.jpg', unsplashId: 'photo-1586023492125-27b2c045efd7' },
  { id: 'prod-home-202', file: 'products/home-office/cotton-canvas-storage-bin.jpg', unsplashId: 'photo-1513519245088-0e12902e5a38' },
  { id: 'prod-home-203', file: 'products/home-office/ceramic-desk-valet-tray.jpg', unsplashId: 'photo-1505797149-43b0069ec26b' },

  // Home & Office - Casa Moderna Lighting & Decor
  { id: 'prod-home-301', file: 'products/home-office/cordless-dimming-mushroom-lamp.jpg', unsplashId: 'photo-1507473885765-e6ed057f782c' },
  { id: 'prod-home-302', file: 'products/home-office/ribbed-ceramic-cool-humidifier.jpg', unsplashId: 'photo-1513506003901-1e6a229e2d15' },
  { id: 'prod-home-303', file: 'products/home-office/walnut-silent-desk-clock.jpg', unsplashId: 'photo-1563861826100-9cb868fdbe1c' },

  // Home & Office - Papercraft & Guild Stationers
  { id: 'prod-home-401', file: 'products/home-office/hardcover-dot-grid-journal.jpg', unsplashId: 'photo-1583485088034-697b5bc54ccd' },
  { id: 'prod-home-402', file: 'products/home-office/solid-raw-brass-drafting-pencil.jpg', unsplashId: 'photo-1585776245991-cf89dd7fc73a' },
  { id: 'prod-home-403', file: 'products/home-office/archival-micro-pigment-fineliners.jpg', unsplashId: 'photo-1569683795645-b62e50fbf103' },

  // Electronics - VoltMax Power & Charging Hub
  { id: 'prod-elec-101', file: 'products/electronics/65w-gan-dual-charger.jpg', unsplashId: 'photo-1583863788434-e58a36330cf0' },
  { id: 'prod-elec-102', file: 'products/electronics/magsafe-wireless-powerbank.jpg', unsplashId: 'photo-1622445262464-84b1456045b6' },
  { id: 'prod-elec-103', file: 'products/electronics/kevlar-100w-usbc-cable.jpg', unsplashId: 'photo-1544816155-12df9643f363' },

  // Electronics - SonicPulse Audio Labs
  { id: 'prod-elec-201', file: 'products/electronics/true-wireless-anc-earbuds.jpg', unsplashId: 'photo-1590658268037-6bf12165a8df' },
  { id: 'prod-elec-202', file: 'products/electronics/waterproof-bluetooth-speaker.jpg', unsplashId: 'photo-1545454675-3531b543be5d' },
  { id: 'prod-elec-203', file: 'products/electronics/lossless-usbc-dac-amplifier.jpg', unsplashId: 'photo-1505740420928-5e560c06d30e' },

  // Electronics - GadgetGuard Protective Gear
  { id: 'prod-elec-301', file: 'products/electronics/sapphire-tempered-glass.jpg', unsplashId: 'photo-1580910051074-3eb694886505' },
  { id: 'prod-elec-302', file: 'products/electronics/impact-magsafe-case.jpg', unsplashId: 'photo-1601784551446-20c9e07cdbdb' },
  { id: 'prod-elec-303', file: 'products/electronics/screen-cleaner-mist-cloth.jpg', unsplashId: 'photo-1585060544812-6b45742d762f' },

  // Electronics - SmartLiving IoT Hub
  { id: 'prod-elec-401', file: 'products/electronics/smart-wifi-plug-powermeter.jpg', unsplashId: 'photo-1558002038-1055907df827' },
  { id: 'prod-elec-402', file: 'products/electronics/universal-smart-ir-remote.jpg', unsplashId: 'photo-1518770660439-4636190af475' },
  { id: 'prod-elec-403', file: 'products/electronics/motion-sensor-night-light.jpg', unsplashId: 'photo-1513506003901-1e6a229e2d15' },

  // Local Services - AirCool Pro HVAC & Maintenance
  { id: 'prod-serv-101', file: 'products/services/split-aircon-hydro-jet-cleaning.jpg', unsplashId: 'photo-1621905251189-08b45d6a269e' },
  { id: 'prod-serv-102', file: 'products/services/inverter-diagnostic-freon-check.jpg', unsplashId: 'photo-1581092160607-ee22621dd758' },
  { id: 'prod-serv-103', file: 'products/services/window-aircon-overhaul.jpg', unsplashId: 'photo-1581092335397-9583fe92d232' },

  // Local Services - CleanSweep Residential Services
  { id: 'prod-serv-201', file: 'products/services/condo-deep-cleaning-service.jpg', unsplashId: 'photo-1581578731548-c64695cc6952' },
  { id: 'prod-serv-202', file: 'products/services/queen-mattress-steam-extraction.jpg', unsplashId: 'photo-1631679706909-1844bbd07221' },
  { id: 'prod-serv-203', file: 'products/services/fabric-sofa-shampoo-extraction.jpg', unsplashId: 'photo-1555041469-a586c61ea9bc' },

  // Local Services - FixIt Quick Handyman & Electrical
  { id: 'prod-serv-301', file: 'products/services/pendant-ceiling-lamp-installation.jpg', unsplashId: 'photo-1517991104123-1d56a6e81ed9' },
  { id: 'prod-serv-302', file: 'products/services/plumbing-leak-repair-bidet.jpg', unsplashId: 'photo-1581244277943-fe4a9c777189' },
  { id: 'prod-serv-303', file: 'products/services/instant-water-heater-hookup.jpg', unsplashId: 'photo-1504307651254-35680f356dfd' },

  // Local Services - WashCraft Premium Laundry & Shoes
  { id: 'prod-serv-401', file: 'products/services/wash-dry-fold-laundry-bag.jpg', unsplashId: 'photo-1545173168-9f1947eebb7f' },
  { id: 'prod-serv-402', file: 'products/services/sneaker-deep-restoration-cleaning.jpg', unsplashId: 'photo-1549298916-b41d501d3772' },
  { id: 'prod-serv-403', file: 'products/services/mens-suit-dry-cleaning.jpg', unsplashId: 'photo-1594938298603-c8148c4dae35' },

  // TOGO Padala - TOGO Padala Express Bike Hub
  { id: 'prod-padala-101', file: 'products/padala/instant-moto-express-booking.jpg', unsplashId: 'photo-1558981403-c5f9899a28bc' },
  { id: 'prod-padala-102', file: 'products/padala/insulated-thermal-box-delivery.jpg', unsplashId: 'photo-1526367790999-0150786686a2' },
  { id: 'prod-padala-103', file: 'products/padala/waterproof-document-pouch.jpg', unsplashId: 'photo-1586528116311-ad8dd3c8310d' },

  // TOGO Padala - TOGO Padala Multi-Stop Route Hub
  { id: 'prod-padala-201', file: 'products/padala/multistop-delivery-route-3drops.jpg', unsplashId: 'photo-1586528116311-ad8dd3c8310d' },
  { id: 'prod-padala-202', file: 'products/padala/enterprise-bulk-scheduled-stops.jpg', unsplashId: 'photo-1580674285054-bed31e145f59' },
  { id: 'prod-padala-203', file: 'products/padala/automated-recipient-sms-tracking.jpg', unsplashId: 'photo-1512428559087-560fa5ceab42' },

  // TOGO Padala - TOGO Padala Cargo Van Depot
  { id: 'prod-padala-301', file: 'products/padala/cargo-van-1000kg-booking.jpg', unsplashId: 'photo-1519003722824-194d4455a60c' },
  { id: 'prod-padala-302', file: 'products/padala/loading-helper-assistance.jpg', unsplashId: 'photo-1600585154340-be6161a56a0c' },
  { id: 'prod-padala-303', file: 'products/padala/bubble-wrap-stretch-film-roll.jpg', unsplashId: 'photo-1530587191325-3db32d826c18' },

  // TOGO Padala - TOGO Padala Heavy Truck Freight
  { id: 'prod-padala-401', file: 'products/padala/closed-aluminum-truck-2000kg.jpg', unsplashId: 'photo-1601584115197-04ecc0da31d7' },
  { id: 'prod-padala-402', file: 'products/padala/medium-duty-hauling-truck-4000kg.jpg', unsplashId: 'photo-1508974239320-0a029497e820' },
  { id: 'prod-padala-403', file: 'products/padala/wooden-pallet-securing-service.jpg', unsplashId: 'photo-1586528116493-a029325540fa' },
];

console.log('Manifest defined with 48 storefronts and 144 products.');
