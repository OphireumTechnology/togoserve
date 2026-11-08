import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  HelpCircle,
  Search,
  MessageSquare,
  Mail,
  Phone,
  ChevronDown,
  ShieldCheck,
  Truck,
  Store,
  CreditCard
} from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isDarkMode, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How does TOGO Padala express courier calculate shipping rates?',
      a: 'Padala rates are calculated dynamically using vehicle base rates + actual road distance (per km) + volumetric weight (L x W x H in cm / 5000). All delivery quotes are transparently provided before booking.',
      category: 'Logistics',
    },
    {
      q: 'What payment methods are supported on the Marketplace?',
      a: 'TOGOSERVE accepts Cash on Delivery (COD), GCash, Maya, major credit/debit cards, and corporate TOGO Pay digital wallets.',
      category: 'Payments',
    },
    {
      q: 'How do merchants receive payouts and settlements?',
      a: 'Merchant sales are reconciled daily through double-entry accounting ledgers. Payouts are automatically transferred to authorized bank accounts or merchant e-wallets within 24 hours.',
      category: 'Merchants',
    },
    {
      q: 'What is the A00 AI Supervisor and how does it protect my orders?',
      a: 'The A00 Supervisor orchestrates multi-agent systems for route dispatch, demand forecasting, and fraud prevention. High-value transactions are subject to Human-in-the-Loop (HITL) approval gates.',
      category: 'AI & Safety',
    },
    {
      q: 'Can I track my courier rider in real time?',
      a: 'Yes! Once an order or Padala shipment is dispatched, real-time GPS coordinates, vehicle details, driver contact numbers, and electronic proof of delivery (e-POD) are viewable via the Track Order modal.',
      category: 'Tracking',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setContactMessage('');
      setContactSubject('');
      addToast('success', 'Ticket Created', 'Your support inquiry has been submitted. Support will reply to your email.');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 transition-colors ${
          isDarkMode
            ? 'bg-[#1C1C1C] border border-neutral-700 text-white'
            : 'bg-white border border-[#EBEEEE] text-[#2E2E2E]'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-full transition-colors focus:outline-none"
          aria-label="Close help modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4B400]/20 text-[#2E2E2E] dark:text-[#FFD54F] text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Customer & Merchant Support Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Help & Knowledge Base
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
            Find immediate answers to common commerce, courier, and account inquiries.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search FAQs, topics, shipping, refunds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-[#2E2E2E] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Frequently Asked Questions ({filteredFaqs.length})
          </h3>
          <div className="space-y-2">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-50/50 dark:bg-neutral-850"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-3.5 text-left text-xs font-bold flex items-center justify-between gap-3 text-[#2E2E2E] dark:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 text-xs text-neutral-600 dark:text-neutral-300 border-t border-neutral-200 dark:border-neutral-800/80 pt-2.5 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-5 rounded-2xl bg-[#EBEEEE]/40 dark:bg-neutral-800 border border-[#EBEEEE] dark:border-neutral-700">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-300 mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#F4B400]" />
            <span>Send a Support Request</span>
          </h3>
          <form onSubmit={handleSendMessage} className="space-y-3">
            <input
              type="text"
              placeholder="Subject (e.g. Order inquiry, merchant POS assistance)"
              value={contactSubject}
              onChange={(e) => setContactSubject(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
            />
            <textarea
              required
              rows={3}
              placeholder="Describe your issue or question in detail..."
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">
                Email: support@togoserve.com
              </span>
              <button
                type="submit"
                disabled={isSending}
                className="px-4 py-2 bg-[#F4B400] hover:bg-[#FFD54F] text-[#2E2E2E] font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                {isSending ? 'Transmitting...' : 'Submit Inquiry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
