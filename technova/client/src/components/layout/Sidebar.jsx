import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  HiViewGrid, HiFolderOpen, HiHeart,
  HiUser, HiLogout, HiCog, HiCreditCard, HiTicket,
  HiUsers, HiCollection, HiChartPie, HiInbox, HiSparkles
} from 'react-icons/hi';
import { logout } from '../../redux/slices/authSlice';

const clientLinks = [
  { name: 'Overview', path: '/dashboard', icon: HiViewGrid },
  { name: 'AI Scoper', path: '/dashboard/scoper', icon: HiSparkles },
  { name: 'My Projects', path: '/dashboard/projects', icon: HiFolderOpen },
  { name: 'Wishlist', path: '/dashboard/wishlist', icon: HiHeart },
  { name: 'Orders & Payments', path: '/dashboard/orders', icon: HiCreditCard },
  { name: 'Support Tickets', path: '/dashboard/tickets', icon: HiTicket },
  { name: 'Profile', path: '/dashboard/profile', icon: HiUser },
];

const adminLinks = [
  { name: 'KPIs & Analytics', path: '/admin', icon: HiChartPie },
  { name: 'Leads CRM', path: '/admin/leads', icon: HiInbox },
  { name: 'All Projects', path: '/admin/projects', icon: HiFolderOpen },
  { name: 'Services Mgmt', path: '/admin/services', icon: HiCollection },
  { name: 'Users', path: '/admin/users', icon: HiUsers },
];

const Sidebar = ({ isMobile, closeMobileSidebar }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  const links = (user?.role?.name === 'admin' || user?.role?.name === 'super_admin')
    ? adminLinks
    : clientLinks;

  const handleLogout = () => {
    dispatch(logout());
  };

  const navContent = (
    <div className="flex flex-col h-full bg-surface-950 border-r border-white/5">
      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2" onClick={isMobile ? closeMobileSidebar : undefined}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9L12 4L18 9V18L12 22L6 18Z" />
              <circle cx="12" cy="13" r="3" fill="currentColor" />
            </svg>
          </div>
          <span className="text-xl font-display font-bold text-white">TechNova</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">{user?.name}</h3>
            <p className="text-xs text-surface-400 truncate">{user?.role?.name}</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.path || (link.path !== '/dashboard' && location.pathname.startsWith(link.path));
          return (
            <Link
              key={link.name}
              to={link.path}
              onClick={isMobile ? closeMobileSidebar : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${isActive
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'text-surface-300 hover:text-white hover:bg-white/5'
                }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : 'text-surface-400'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          to="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-300 hover:text-white hover:bg-white/5 transition-all"
        >
          <HiCog className="w-5 h-5 text-surface-400" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <HiLogout className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 z-40">
        {navContent}
      </aside>

      {/* Mobile Sidebar overlay */}
      {isMobile && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-surface-950/80 backdrop-blur-sm"
            onClick={closeMobileSidebar}
          />
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
