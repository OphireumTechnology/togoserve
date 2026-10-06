import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileNav } from './components/common/MobileNav';
import { CartDrawer } from './components/common/CartDrawer';
import { AuthModal } from './components/common/AuthModal';
import { ShortcutsModal } from './components/common/ShortcutsModal';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastContainer } from './components/common/ToastContainer';

import { MarketplaceView } from './components/views/MarketplaceView';
import { PadalaView } from './components/views/PadalaView';
import { MerchantOSView } from './components/views/MerchantOSView';
import { POSRegisterView } from './components/views/POSRegisterView';
import { RiderPortalView } from './components/views/RiderPortalView';
import { AICommandCenterView } from './components/views/AICommandCenterView';
import { AnalyticsView } from './components/views/AnalyticsView';

const AppContent: React.FC = () => {
  const { activePortal, isDarkMode } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
        isDarkMode
          ? 'bg-[#040E1B] text-[#F8FAFC]'
          : 'bg-[#F5F7FA] text-[#17212B]'
      }`}
    >
      {/* Top Accessible Navigation Header */}
      <Header onOpenCart={() => setIsCartOpen(true)} />

      {/* Main View Area */}
      <main className="grow max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20 lg:pb-10">
        {activePortal === 'marketplace' && (
          <MarketplaceView onOpenCart={() => setIsCartOpen(true)} />
        )}
        {activePortal === 'padala' && <PadalaView />}
        {activePortal === 'merchant' && <MerchantOSView />}
        {activePortal === 'pos' && <POSRegisterView />}
        {activePortal === 'rider' && <RiderPortalView />}
        {activePortal === 'ai-center' && <AICommandCenterView />}
        {activePortal === 'analytics' && <AnalyticsView />}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal />
      <ShortcutsModal />
      <CommandPalette />
      <ToastContainer />

      {/* Mobile Touch Navigation */}
      <MobileNav onOpenCart={() => setIsCartOpen(true)} />

      {/* Platform Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
