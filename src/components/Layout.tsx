import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Navigation from './Navigation';

const Layout = () => {
  return (
    <div
      className="bg-background flex flex-col"
      style={{
        height: '100dvh',
        paddingTop: 'env(safe-area-inset-top)'
      }}
    >
      <main
        className="flex-1 max-w-md mx-auto w-full px-4 pb-2 flex flex-col min-h-0"
        style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}
      >
        <Outlet />
      </main>

      <Navigation />
      <Toaster position="top-center" />
    </div>
  );
};

export default Layout;
