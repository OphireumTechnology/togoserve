import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileNav } from './components/common/MobileNav';
import { CartDrawer } from './components/common/CartDrawer';
import { AuthModal } from './components/common/AuthModal';
import { EnterpriseLoginModal } from './components/auth/EnterpriseLoginModal';
import { ShortcutsModal } from './components/common/ShortcutsModal';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastContainer } from './components/common/ToastContainer';
import { RouteGuard } from './components/common/RouteGuard';
import { OrderTrackingModal } from './components/views/OrderTrackingModal';
import { MerchantApplicationModal } from './components/views/MerchantApplicationModal';
import { RiderApplicationModal } from './components/views/RiderApplicationModal';
import { HelpSupportModal } from './components/views/HelpSupportModal';

import { PublicLandingView } from './components/views/PublicLandingView';
import { MarketplaceView } from './components/views/MarketplaceView';
import { PadalaView } from './components/views/PadalaView';
import { MerchantOSView } from './components/views/MerchantOSView';
import { POSRegisterView } from './components/views/POSRegisterView';
import { RiderPortalView } from './components/views/RiderPortalView';
import { SupplierPortalView } from './components/views/SupplierPortalView';
import { FleetManagementView } from './components/views/FleetManagementView';
import { AICommandCenterView } from './components/views/AICommandCenterView';
import { AnalyticsView } from './components/views/AnalyticsView';

const AppContent: React.FC = () => {
  const {
    activePortal,
    isDarkMode,
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    activeTrackingOrderId,
    isMerchantModalOpen,
    setIsMerchantModalOpen,
    isRiderModalOpen,
    setIsRiderModalOpen,
    isHelpModalOpen,
    setIsHelpModalOpen,
  } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
        isDarkMode
          ? 'bg-[#181818] text-[#FAFAFA]'
          : 'bg-[#FAFAFA] text-[#2E2E2E]'
      }`}
    >
      {/* Top Accessible Navigation Header */}
      <Header onOpenCart={() => setIsCartOpen(true)} />

      {/* Main View Area with Public Access & Route Guards */}
      <main className="grow max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20 lg:pb-10">
        {/* PUBLIC ENVIRONMENT */}
        {activePortal === 'landing' && <PublicLandingView />}
        {(activePortal === 'marketplace' || activePortal === 'customer') && (
          <MarketplaceView onOpenCart={() => setIsCartOpen(true)} />
        )}
        {activePortal === 'padala' && <PadalaView />}

        {/* RESTRICTED PRIVATE ENTERPRISE ENVIRONMENT */}
        {activePortal === 'merchant' && (
          <RouteGuard requiredPortal="merchant">
            <MerchantOSView />
          </RouteGuard>
        )}
        {activePortal === 'pos' && (
          <RouteGuard requiredPortal="pos">
            <POSRegisterView />
          </RouteGuard>
        )}
        {activePortal === 'rider' && (
          <RouteGuard requiredPortal="rider">
            <RiderPortalView />
          </RouteGuard>
        )}
        {activePortal === 'supplier' && (
          <RouteGuard requiredPortal="supplier">
            <SupplierPortalView />
          </RouteGuard>
        )}
        {activePortal === 'fleet' && (
          <RouteGuard requiredPortal="fleet">
            <FleetManagementView />
          </RouteGuard>
        )}
        {(activePortal === 'ai-center' || activePortal === 'admin') && (
          <RouteGuard requiredPortal="ai-center">
            <AICommandCenterView />
          </RouteGuard>
        )}
        {activePortal === 'analytics' && (
          <RouteGuard requiredPortal="analytics">
            <AnalyticsView />
          </RouteGuard>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal />
      <EnterpriseLoginModal />
      <ShortcutsModal />
      <CommandPalette />
      <ToastContainer />
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        initialTrackingId={activeTrackingOrderId}
      />
      <MerchantApplicationModal
        isOpen={isMerchantModalOpen}
        onClose={() => setIsMerchantModalOpen(false)}
      />
      <RiderApplicationModal
        isOpen={isRiderModalOpen}
        onClose={() => setIsRiderModalOpen(false)}
      />
      <HelpSupportModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

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
