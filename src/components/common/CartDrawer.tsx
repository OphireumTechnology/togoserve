import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, CreditCard, Wallet, Banknote } from 'lucide-react';
import { Order } from '../../types';

export const CartDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    placeOrder,
    setActivePortal,
    isDarkMode,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('TOGO_PAY');
  const [address, setAddress] = useState('Tower 2 Unit 1804, Bonifacio High Street, BGC, Taguig City');
  const [phone, setPhone] = useState('+63 917 555 0192');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const deliveryFee = 65;
  const platformFee = 15;
  const discount = cartTotal > 600 ? 50 : 0;
  const finalTotal = Math.max(0, cartTotal + deliveryFee + platformFee - discount);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      placeOrder(paymentMethod, address, phone);
      setIsCheckingOut(false);
      onClose();
      // Jump to customer marketplace view to see active order tracking
      setActivePortal('marketplace');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md shadow-2xl flex flex-col transition-colors ${
            isDarkMode
              ? 'bg-[#071A2F] text-white border-l border-slate-700'
              : 'bg-white text-[#17212B] border-l border-slate-200'
          }`}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Your TOGOSERVE Basket</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {cart.length === 0 ? 'Empty basket' : `${cart.length} item(s) from merchant`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="grow overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-semibold mb-1">Your basket is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore top restaurants, grocery stores, and local merchants in the TOGOSERVE marketplace.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex gap-3 items-center"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                      <div className="grow min-w-0">
                        <h4 className="text-xs font-bold truncate">{item.product.name}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          ₱{item.product.price.toFixed(2)} each
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold font-mono">
                          ₱{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="block mt-2 ml-auto text-slate-400 hover:text-[#D64545]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address & Contact */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Delivery Coordinates
                  </h4>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Street Address / Unit
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Recipient Mobile
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>

                {/* Payment Channel Selector */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Payment Gateway
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('TOGO_PAY')}
                      className={`p-2 rounded-xl text-center border text-xs flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'TOGO_PAY'
                          ? 'border-[#D9A514] bg-[#FFC928]/15 text-[#D9A514] font-bold'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-500'
                      }`}
                    >
                      <Wallet className="w-4 h-4" />
                      <span>TOGO Pay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-2 rounded-xl text-center border text-xs flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'CARD'
                          ? 'border-[#D9A514] bg-[#FFC928]/15 text-[#D9A514] font-bold'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-500'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Card / 3DS</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-2 rounded-xl text-center border text-xs flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'COD'
                          ? 'border-[#D9A514] bg-[#FFC928]/15 text-[#D9A514] font-bold'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-500'
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span>Cash (COD)</span>
                    </button>
                  </div>
                </div>

                {/* Ledger & Price Breakdown */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums">₱{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Delivery Fee (Distance SLA)</span>
                    <span className="font-mono tabular-nums">₱{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Platform Service Charge</span>
                    <span className="font-mono tabular-nums">₱{platformFee.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#16845B] font-semibold">
                      <span>Promo Discount (TOGO Launch)</span>
                      <span className="font-mono tabular-nums">-₱{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-sm">
                    <span>Total Amount</span>
                    <span className="font-mono tabular-nums text-[#D9A514]">
                      ₱{finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <button
                disabled={isCheckingOut}
                onClick={handleCheckout}
                className="w-full py-3 px-4 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#FFC928]"
              >
                <span>{isCheckingOut ? 'Dispatching to Merchant...' : `Place Order (₱${finalTotal.toFixed(2)})`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16845B]" />
                <span>Encrypted Payment • Real-Time Rider Tracking Guaranteed</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
