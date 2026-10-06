import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Barcode,
  Search,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  DollarSign,
  Printer,
  X,
  User,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { ProductItem } from '../../types';

export const POSRegisterView: React.FC = () => {
  const { products, currentUser, isDarkMode, addToast } = useApp();

  const [orderMode, setOrderMode] = useState<'WALK_IN' | 'PICKUP' | 'DELIVERY'>('WALK_IN');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketItems, setTicketItems] = useState<{ product: ProductItem; quantity: number }[]>([]);
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
  const [tenderMethod, setTenderMethod] = useState<'CASH' | 'CARD' | 'TOGO_PAY'>('CASH');
  const [cashTendered, setCashTendered] = useState<number>(1000);
  const [receiptData, setReceiptData] = useState<any>(null);

  const subtotal = ticketItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.12; // 12% VAT
  const total = subtotal; // Inclusive in menu price
  const changeDue = Math.max(0, cashTendered - total);

  const addItemToTicket = (product: ProductItem) => {
    setTicketItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      setTicketItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setTicketItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput) return;
    const found = products.find(
      (p) =>
        p.sku.toLowerCase() === barcodeInput.toLowerCase() ||
        p.name.toLowerCase().includes(barcodeInput.toLowerCase())
    );
    if (found) {
      addItemToTicket(found);
      setBarcodeInput('');
      addToast('success', 'SKU Added', found.name);
    } else {
      addToast('warning', 'Item Not Found', `No SKU matching "${barcodeInput}"`);
    }
  };

  const handleCompleteTransaction = () => {
    const receipt = {
      receiptNo: `POS-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toLocaleTimeString(),
      mode: orderMode,
      items: [...ticketItems],
      subtotal,
      tax,
      total,
      tenderMethod,
      cashTendered: tenderMethod === 'CASH' ? cashTendered : total,
      changeDue: tenderMethod === 'CASH' ? changeDue : 0,
      clerk: currentUser?.name || 'Clerk #04',
    };
    setReceiptData(receipt);
    setIsTenderModalOpen(false);
    setTicketItems([]);
    addToast('success', 'Sale Finalized', `Receipt #${receipt.receiptNo} generated.`);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-12">
      {/* Top POS Header */}
      <div className="bg-[#071A2F] text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#FFC928] text-[#071A2F] font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold">TOGOSERVE POS Terminal #01</h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Clerk: {currentUser?.name || 'Danilo D.'} • Shift #882 • Online Mode
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-white/10 p-1 rounded-xl text-xs font-bold">
          {(['WALK_IN', 'PICKUP', 'DELIVERY'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setOrderMode(mode)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                orderMode === mode
                  ? 'bg-[#FFC928] text-[#071A2F] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: PRODUCT SELECTION & BARCODE (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Quick Barcode Scanner & Search */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <form onSubmit={handleBarcodeSubmit} className="relative">
              <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Scan Barcode or Enter SKU (Enter to add)..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className={`w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#D9A514] font-mono ${
                  isDarkMode
                    ? 'bg-[#0B223D] border-slate-700 text-white'
                    : 'bg-white border-slate-300 text-[#17212B]'
                }`}
              />
            </form>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search items by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#D9A514] ${
                  isDarkMode
                    ? 'bg-[#0B223D] border-slate-700 text-white'
                    : 'bg-white border-slate-300 text-[#17212B]'
                }`}
              />
            </div>
          </div>

          {/* Grid of Quick Touch Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => addItemToTicket(p)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all hover:border-[#D9A514] active:scale-98 ${
                  isDarkMode
                    ? 'bg-[#0B223D] border-slate-800 text-white'
                    : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{p.sku}</span>
                  <h4 className="text-xs font-bold line-clamp-2 leading-tight">{p.name}</h4>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-[#D9A514]">
                    ₱{p.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400">{p.stock} in stock</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE TICKET & REGISTER TOTAL (5 cols) */}
        <div
          className={`lg:col-span-5 xl:col-span-4 rounded-2xl border p-4 sm:p-5 flex flex-col justify-between min-h-[500px] ${
            isDarkMode
              ? 'bg-[#0B223D] border-slate-800 text-white'
              : 'bg-white border-slate-200 text-[#17212B] shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold">Active Sale Ticket</h3>
              <button
                onClick={() => setTicketItems([])}
                className="text-[11px] text-slate-400 hover:text-rose-500 font-semibold"
              >
                Clear Ticket
              </button>
            </div>

            {/* Items List */}
            <div className="max-h-72 overflow-y-auto py-3 space-y-2 divide-y divide-slate-100 dark:divide-slate-800/60">
              {ticketItems.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400">
                  Ticket is currently empty. Tap items or scan a barcode to add.
                </div>
              ) : (
                ticketItems.map((item) => (
                  <div key={item.product.id} className="pt-2 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <div className="font-bold truncate">{item.product.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ₱{item.product.price} each
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold w-16 text-right">
                        ₱{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ticket Total and Tender Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal (Net)</span>
                <span className="font-mono">₱{(total - tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>12% VAT (Included)</span>
                <span className="font-mono">₱{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total Due</span>
                <span className="font-mono text-[#D9A514] text-xl">₱{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              disabled={ticketItems.length === 0}
              onClick={() => setIsTenderModalOpen(true)}
              className="w-full py-3 bg-[#FFC928] hover:bg-[#D9A514] disabled:opacity-50 text-[#071A2F] font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Collect Payment (Tender)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* TENDER PAYMENT MODAL */}
      {isTenderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-2xl shadow-2xl p-6 ${
              isDarkMode ? 'bg-[#071A2F] text-white border border-slate-700' : 'bg-white text-[#17212B]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold">Process Payment Tender</h3>
              <button onClick={() => setIsTenderModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="text-center py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-xs text-slate-400">Total Balance</span>
                <div className="text-2xl font-mono font-extrabold text-[#D9A514]">
                  ₱{total.toFixed(2)}
                </div>
              </div>

              {/* Payment tender tabs */}
              <div className="grid grid-cols-3 gap-2">
                {(['CASH', 'TOGO_PAY', 'CARD'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenderMethod(t)}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                      tenderMethod === t
                        ? 'border-[#D9A514] bg-[#FFC928]/20 text-[#D9A514]'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {tenderMethod === 'CASH' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Cash Tendered (₱)</label>
                    <input
                      type="number"
                      step="50"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(parseFloat(e.target.value) || 0)}
                      className="w-full text-base font-mono font-bold p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold">
                    <span className="text-xs">Change to Return:</span>
                    <span className="text-lg font-mono">₱{changeDue.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {tenderMethod === 'TOGO_PAY' && (
                <div className="text-center py-4 space-y-2">
                  <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center border">
                    <div className="text-xs text-black font-mono font-bold">[ QR CODE SCAN ]</div>
                  </div>
                  <p className="text-xs text-slate-400">Customer scans with TOGO Pay Super-App</p>
                </div>
              )}
            </div>

            <button
              onClick={handleCompleteTransaction}
              className="w-full py-3 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Confirm Sale & Print Receipt
            </button>
          </div>
        </div>
      )}

      {/* DIGITAL RECEIPT MODAL */}
      {receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white text-slate-900 rounded-2xl shadow-2xl p-6 font-mono text-xs border border-slate-200">
            <div className="text-center pb-3 border-b border-dashed border-slate-300 space-y-1">
              <h2 className="text-sm font-extrabold font-sans">TOGOSERVE RETAIL</h2>
              <p className="text-[10px] text-slate-500">Aroma Bakehouse & Roastery</p>
              <p className="text-[10px] text-slate-400">Tax ID: 480-192-384-000 VAT</p>
            </div>

            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-0.5 text-[11px]">
              <div>Receipt: {receiptData.receiptNo}</div>
              <div>Time: {receiptData.timestamp}</div>
              <div>Clerk: {receiptData.clerk}</div>
              <div>Mode: {receiptData.mode}</div>
            </div>

            <div className="py-3 border-b border-dashed border-slate-300 space-y-1">
              {receiptData.items.map((it: any, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {it.quantity}x {it.product.name.slice(0, 20)}
                  </span>
                  <span>₱{(it.product.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2.5 space-y-1 font-bold">
              <div className="flex justify-between">
                <span>TOTAL PAID:</span>
                <span>₱{receiptData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[10px] font-normal">
                <span>Method: {receiptData.tenderMethod}</span>
                <span>Change: ₱{receiptData.changeDue.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setReceiptData(null)}
                className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-sans font-bold hover:bg-slate-800"
              >
                Close & Next Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
