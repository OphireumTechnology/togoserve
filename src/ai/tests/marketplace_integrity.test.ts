import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_MERCHANTS } from '../../data/demoMerchants';
import { PRODUCTION_PRODUCTS, PRODUCTION_ORDERS, PRODUCTION_INVENTORY } from '../../data/productionRegistry';

test('Marketplace Integrity: Exactly 48 demo merchants across 12 categories', () => {
  assert.equal(DEMO_MERCHANTS.length, 48, 'Should have exactly 48 demo merchants');

  // Verify category distribution (4 per category)
  const categoryCounts: Record<string, number> = {};
  for (const m of DEMO_MERCHANTS) {
    categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
  }

  const expectedCategories = [
    'Food',
    'Grocery',
    'Convenience',
    'Pharmacy',
    'Retail',
    'Flowers & Gifts',
    'Pet Care',
    'Beauty & Wellness',
    'Home & Office',
    'Electronics',
    'Local Services',
    'TOGO Padala',
  ];

  for (const cat of expectedCategories) {
    assert.equal(categoryCounts[cat], 4, `Category "${cat}" must have exactly 4 demo merchants`);
  }
});

test('Marketplace Integrity: Unique merchant and product IDs', () => {
  const merchantIds = new Set<string>();
  const productIds = new Set<string>();

  for (const m of DEMO_MERCHANTS) {
    assert.equal(merchantIds.has(m.id), false, `Duplicate merchant ID found: ${m.id}`);
    merchantIds.add(m.id);

    assert.equal(m.isDemo, true, `Merchant ${m.id} must have isDemo: true`);
    assert.equal(m.accreditationStatus, 'DEMO', `Merchant ${m.id} must have accreditationStatus: 'DEMO'`);

    for (const p of m.products) {
      assert.equal(productIds.has(p.id), false, `Duplicate product ID found: ${p.id}`);
      productIds.add(p.id);

      assert.equal(p.isSample, true, `Product ${p.id} in merchant ${m.id} must have isSample: true`);
      assert.equal(p.storeId, m.id, `Product ${p.id} storeId must match merchant ID ${m.id}`);
    }
  }

  assert.equal(merchantIds.size, 48, 'Should have 48 unique merchant IDs');
  assert.equal(productIds.size, 96, 'Current catalog contains 96 unique sample product IDs (2 per merchant)');
});

test('Marketplace Integrity: 100% Unique images across storefronts and products (Zero Duplicates, Zero Overlap)', () => {
  const storefrontImages = new Set<string>();
  const productImages = new Set<string>();

  for (const m of DEMO_MERCHANTS) {
    assert.ok(m.storefrontImage, `Merchant ${m.id} must have a storefrontImage`);
    assert.equal(
      storefrontImages.has(m.storefrontImage),
      false,
      `Duplicate storefront image detected: ${m.storefrontImage}`
    );
    storefrontImages.add(m.storefrontImage);

    for (const p of m.products) {
      assert.ok(p.image, `Product ${p.id} must have an image`);
      assert.equal(
        productImages.has(p.image),
        false,
        `Duplicate product image detected: ${p.image}`
      );
      productImages.add(p.image);

      // Verify no product image matches ANY storefront image
      assert.notEqual(
        p.image,
        m.storefrontImage,
        `Product image for ${p.id} matches merchant storefront banner: ${p.image}`
      );
    }
  }

  // Cross-verify zero intersection between the storefronts set and product images set
  for (const sImg of storefrontImages) {
    assert.equal(
      productImages.has(sImg),
      false,
      `Storefront image also reused as product image: ${sImg}`
    );
  }

  assert.equal(storefrontImages.size, 48, 'Should have 48 unique storefront images');
  assert.equal(productImages.size, 96, 'Current catalog requires 96 unique product images');
});

test('Production Data Safety: Production registries separated from demo merchants', () => {
  assert.ok(Array.isArray(PRODUCTION_PRODUCTS), 'PRODUCTION_PRODUCTS must be an array');
  assert.ok(Array.isArray(PRODUCTION_ORDERS), 'PRODUCTION_ORDERS must be an array');
  assert.ok(Array.isArray(PRODUCTION_INVENTORY), 'PRODUCTION_INVENTORY must be an array');

  // Verify production orders do not reference demo sample products
  for (const order of PRODUCTION_ORDERS) {
    for (const item of order.items) {
      assert.equal(
        (item.product as any).isSample ?? false,
        false,
        `Production order ${order.orderNumber} must not contain demo sample products`
      );
    }
  }
});
