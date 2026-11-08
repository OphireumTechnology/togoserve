/** Fictional demo-only merchant catalog. Never treat as accredited or live inventory. */
import type { DemoMerchantProfile } from '../types';

const categorySeeds = [["Food",["Golden Hearth Kitchen","Casa Amara Café","Firestone Grill House","Noodle District"],["Chicken Rice Bowl","Fresh Brewed Coffee"],"photo-1552566626-52f8b828add9"],["Grocery",["Harvest Lane Market","Green Basket Grocers","Daily Pantry Hub","Farmgate Fresh"],["Fresh Vegetable Basket","Pantry Rice Pack"],"photo-1542838132-92c53300491e"],["Convenience",["QuickNest Mart","Corner 24 Market","EasyPick Express","Metro Mini Mart"],["Snack Combo","Bottled Refreshment"],"photo-1601599561213-832382fd07ba"],["Pharmacy",["WellSpring Pharmacy","CareBridge Pharmacy","VitalCare Essentials","HealthNest Store"],["First Aid Kit","Hygiene Essentials"],"photo-1471864190281-a93a3070b6de"],["Retail",["Urban Thread Collective","Everyday Style Studio","The Modern Closet","Luna Lifestyle Shop"],["Everyday Tote Bag","Casual Cotton Shirt"],"photo-1441986300917-64674bd600d8"],["Flowers & Gifts",["Petal & Pine Florist","BloomCraft Studio","Golden Ribbon Gifts","The Flower Atelier"],["Seasonal Bouquet","Gift Box"],"photo-1490750967868-88aa4486c946"],["Pet Care",["Paw Haven Supply","Happy Tails Market","Fur & Feather Shop","PetNest Essentials"],["Pet Toy Set","Pet Grooming Kit"],"photo-1601758228041-f3b2795255f1"],["Beauty & Wellness",["Glow Theory Beauty","Pure Aura Wellness","Radiant Skin Studio","Bloom Wellness Market"],["Gentle Cleanser","Body Care Set"],"photo-1596462502278-27bfdc403348"],["Home & Office",["Nest & Co. Living","DeskWorks Supply","Modern Habitat","Paper & Space"],["Desk Organizer","Notebook Set"],"photo-1497366754035-f200968a6e72"],["Electronics",["Circuit Point Tech","VoltHub Electronics","Digital Nest Store","TechBridge Supply"],["USB-C Charging Cable","Wireless Earbuds"],"photo-1498049794561-7780e7231661"],["Local Services",["FixRight Home Services","SparklePro Cleaning","CoolCare Aircon Services","HandyNest Solutions"],["Home Service Consultation","Service Booking Request"],"photo-1581578731548-c64695cc6952"],["TOGO Padala",["TOGO Express Delivery","TOGO Business Courier","TOGO Document Express","TOGO Scheduled Pickup"],["Sample Parcel Quote","Sample Pickup Request"],"photo-1586528116311-ad8dd3c8310d"]] as const;

export const DEMO_MERCHANTS: DemoMerchantProfile[] = categorySeeds.flatMap(([category, names, productNames, imageId], groupIndex) =>
  names.map((name, index) => {
    const id = `demo-${groupIndex + 1}-${index + 1}`;
    const image = `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=900&q=80`;
    return {
      id,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name,
      category,
      description: `Fictional demonstration storefront for ${category.toLowerCase()} products and services. Preview only; no real orders accepted.`,
      storefrontImage: image,
      logo: image,
      indicativeRating: 0,
      operatingHours: 'Sample schedule only',
      isOpen: false,
      address: 'Fictional demo location — not a real address',
      city: 'Demo location',
      estimatedDeliveryMin: 0,
      minimumOrder: 0,
      deliveryFee: 0,
      deliveryOptions: ['MOTORCYCLE'] as ('MOTORCYCLE')[],
      onboardingStatus: 'DRAFT' as const,
      accreditationStatus: 'DEMO' as const,
      isDemo: true,
      publicVisibility: true,
      featuredTags: ['Sample Store', 'Preview Only'],
      products: productNames.map((productName, productIndex) => ({
        id: `${id}-item-${productIndex + 1}`,
        name: productName,
        storeId: id,
        storeName: name,
        category,
        price: productIndex === 0 ? 149 : 249,
        stock: 0,
        sku: `SAMPLE-${groupIndex + 1}-${index + 1}-${productIndex + 1}`,
        image,
        description: 'Illustrative sample item. Not available for purchase.',
        isSample: true,
      })),
    };
  })
);
