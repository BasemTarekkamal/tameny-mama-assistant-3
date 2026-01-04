import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Navigation from './Navigation';

const Layout = () => {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Safe area top spacer for notch/status bar */}
      <div className="w-full bg-background" style={{ paddingTop: 'env(safe-area-inset-top)' }} />
      
      <main className="flex-1 max-w-md mx-auto w-full px-4 pb-28 overflow-y-auto">
        <Outlet />
      </main>
      
      <Navigation />
      <Toaster position="top-center" />
    </div>
  );
};

export default Layout;
