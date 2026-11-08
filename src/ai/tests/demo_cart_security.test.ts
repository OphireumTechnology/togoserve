import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_MERCHANTS } from '../../data/demoMerchants';
import { PRODUCTION_PRODUCTS } from '../../data/productionRegistry';
import { ProductItem } from '../../types';

// Standalone verification of the business logic rules in cart and order management
function simulateCartAddition(
  cart: { product: ProductItem; quantity: number }[],
  product: ProductItem | (ProductItem & { isSample?: boolean; isDemo?: boolean })
): { success: boolean; reason?: string } {
  if ((product as any).isSample === true || (product as any).isDemo === true) {
    return { success: false, reason: 'PREVIEW_ONLY_DEMO_PRODUCT' };
  }

  cart.push({ product: product as ProductItem, quantity: 1 });
  return { success: true };
}

function simulateCheckout(
  cart: { product: ProductItem; quantity: number }[]
): { success: boolean; orderId?: string } {
  const hasDemoItems = cart.some(
    (item) => (item.product as any).isSample === true || (item.product as any).isDemo === true
  );

  if (hasDemoItems) {
    throw new Error('DEMO_CHECKOUT_BLOCKED: Demonstration products cannot be checked out.');
  }

  return { success: true, orderId: 'ord-simulated-123' };
}

test('Demo Cart Security: Sample products are rejected from live cart', () => {
  const cart: { product: ProductItem; quantity: number }[] = [];

  // Attempt to add sample products from demo merchants
  const demoProduct = DEMO_MERCHANTS[0].products[0] as unknown as ProductItem;
  assert.equal((demoProduct as any).isSample, true);

  const result = simulateCartAddition(cart, demoProduct);

  assert.equal(result.success, false, 'Adding demo sample product should fail');
  assert.equal(result.reason, 'PREVIEW_ONLY_DEMO_PRODUCT');
  assert.equal(cart.length, 0, 'Cart should remain empty');
});

test('Demo Cart Security: Production catalog items are accepted into cart', () => {
  const cart: { product: ProductItem; quantity: number }[] = [];

  const prodProduct = PRODUCTION_PRODUCTS[0];
  assert.equal((prodProduct as any).isSample, undefined);

  const result = simulateCartAddition(cart, prodProduct);

  assert.equal(result.success, true, 'Adding production catalog item should succeed');
  assert.equal(cart.length, 1);
  assert.equal(cart[0].product.id, prodProduct.id);
});

test('Demo Cart Security: Checkout hard-fails if demo items are present', () => {
  const cartWithDemo = [
    { product: DEMO_MERCHANTS[1].products[0] as unknown as ProductItem, quantity: 1 },
  ];

  assert.throws(
    () => simulateCheckout(cartWithDemo),
    /DEMO_CHECKOUT_BLOCKED/,
    'Checkout with demo items must throw DEMO_CHECKOUT_BLOCKED'
  );
});

test('Demo Cart Security: Checkout succeeds with legitimate production items', () => {
  const legitimateCart = [
    { product: PRODUCTION_PRODUCTS[0], quantity: 1 },
  ];

  const checkout = simulateCheckout(legitimateCart);
  assert.equal(checkout.success, true);
  assert.ok(checkout.orderId);
});
