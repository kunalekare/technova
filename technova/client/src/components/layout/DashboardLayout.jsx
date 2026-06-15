import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HiMenuAlt2, HiBell, HiSearch } from 'react-icons/hi';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change within dashboard
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-surface-950">
      <Sidebar 
        isMobile={mobileMenuOpen} 
        closeMobileSidebar={() => setMobileMenuOpen(false)} 
      />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-20 bg-surface-950/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="lg:hidden p-2 -ml-2 text-surface-400 hover:text-white hover:bg-white/5 rounded-lg"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <HiMenuAlt2 className="w-6 h-6" />
              </button>

              {/* Optional Search */}
              <div className="hidden sm:flex relative w-64 lg:w-96">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="text"
                  placeholder="Search projects, services..."
                  className="input-field pl-9 !py-2 text-sm bg-surface-900 border-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button className="relative p-2 text-surface-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <HiBell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-950"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
