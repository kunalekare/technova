import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiMenuAlt2, HiSearch } from 'react-icons/hi';
import { fetchBranding } from '../../redux/slices/brandingSlice';
import Sidebar from './Sidebar';
import NotificationBell from '../dashboard/NotificationBell';
import { useSocket } from '../../hooks/useSocket';
import { addNotification } from '../../redux/slices/notificationSlice';
import ClientAssistant from '../dashboard/ClientAssistant';

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { socket, connected } = useSocket();
  const { branding } = useSelector((state) => state.branding);

  useEffect(() => {
    dispatch(fetchBranding());
  }, [dispatch]);

  useEffect(() => {
    // Scroll to top on route change within dashboard
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Listen for real-time notifications via socket
  useEffect(() => {
    if (socket && connected) {
      socket.on('notification', (notification) => {
        dispatch(addNotification(notification));
      });

      return () => {
        socket.off('notification');
      };
    }
  }, [socket, connected, dispatch]);

  return (
    <div className="min-h-screen bg-surface-950">
      {branding && (
        <style>
          {`
            :root {
              --color-primary-500: ${branding.primaryColor};
              --color-primary-600: ${branding.primaryColor};
              --color-primary-400: ${branding.primaryColor};
            }
            /* A simple text gradient override using the secondary color */
            .gradient-text {
              background: linear-gradient(to right, ${branding.primaryColor}, ${branding.secondaryColor});
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          `}
        </style>
      )}

      <Sidebar 
        isMobile={mobileMenuOpen} 
        closeMobileSidebar={() => setMobileMenuOpen(false)} 
      />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full max-w-[100vw] overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-20 bg-surface-950/80 backdrop-blur-xl border-b border-white/5 px-3 sm:px-6 lg:px-8">
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

              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center gap-2">
                {branding?.logoUrl ? (
                  <img src={branding.logoUrl} alt="Logo" className="w-8 h-8 rounded" />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-xl">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <linearGradient id="tarkkoGradHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                      <polygon points="50 5, 90 25, 90 75, 50 95, 10 75, 10 25" fill="url(#tarkkoGradHeader)" />
                      <path d="M 50 28 L 72 45 L 63 54 L 55 48 L 55 72 L 45 72 L 45 48 L 37 54 L 28 45 Z" fill="white" />
                    </svg>
                  </div>
                )}
                <span className="text-xl font-display font-extrabold tracking-wide">
                  {branding?.companyName ? (
                    <span className="text-white">{branding.companyName}</span>
                  ) : (
                    <>TARK<span className="gradient-text">KO</span></>
                  )}
                </span>
              </div>

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
              {/* Notification Bell with dropdown */}
              <NotificationBell />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      
      {/* Client AI Assistant Widget */}
      <ClientAssistant />
    </div>
  );
};

export default DashboardLayout;
