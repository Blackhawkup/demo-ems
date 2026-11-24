import React, { useState } from 'react';
import { SlimSidebar } from './SlimSidebar';
import { Navbar } from './Navbar';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col md:flex-row font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Desktop & Tablet Slim Icon Rail (Screenshot 2 style) */}
      <div className="hidden md:flex">
        <SlimSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50 w-20 bg-white flex flex-col h-full border-r border-slate-200">
            <div className="absolute top-3 right-2 z-10">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <SlimSidebar />
          </div>
        </div>
      )}

      {/* Main Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile top strip with hamburger button */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-slate-900">Client Associates</span>
          </div>
          <div className="w-6" />
        </div>

        {/* Global Clean Navbar */}
        <Navbar pageTitle={pageTitle} />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 w-full max-w-[1800px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};