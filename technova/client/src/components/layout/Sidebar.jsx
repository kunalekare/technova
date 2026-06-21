import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  HiViewGrid, HiFolderOpen, HiHeart,
  HiUser, HiLogout, HiCog, HiCreditCard, HiTicket,
  HiUsers, HiCollection, HiChartPie, HiInbox, HiSparkles, HiBell,
  HiUserGroup, HiStar, HiPencilAlt, HiPhotograph, HiBriefcase,
  HiDocumentText, HiBadgeCheck, HiClipboardList, HiCurrencyRupee, HiColorSwatch
} from 'react-icons/hi';
import { logout } from '../../redux/slices/authSlice';

const clientSections = [
  {
    title: 'My Workspace',
    links: [
      { name: 'Overview', path: '/dashboard', icon: HiViewGrid },
      { name: 'Profile', path: '/dashboard/profile', icon: HiUser },
      { name: 'Wishlist', path: '/dashboard/wishlist', icon: HiHeart },
    ]
  },
  {
    title: 'Operations & Team',
    links: [
      { name: 'AI Scoper', path: '/dashboard/scoper', icon: HiSparkles },
      { name: 'My Projects', path: '/dashboard/projects', icon: HiFolderOpen },
      { name: 'Orders & Payments', path: '/dashboard/orders', icon: HiCreditCard },
      { name: 'My Retainers', path: '/dashboard/retainers', icon: HiCurrencyRupee },
      { name: 'Team Access', path: '/dashboard/team', icon: HiUserGroup },
      { name: 'Branding', path: '/dashboard/branding', icon: HiColorSwatch },
      { name: 'Book Consultation', path: '/dashboard/book-consultation', icon: HiUserGroup },
      { name: 'Refer & Earn', path: '/dashboard/referrals', icon: HiStar },
    ]
  },
  {
    title: 'Trust & Legal',
    links: [
      { name: 'Contracts', path: '/dashboard/contracts', icon: HiDocumentText },
      { name: 'Verification', path: '/dashboard/verification', icon: HiBadgeCheck },
    ]
  },
  {
    title: 'Applications',
    links: [
      { name: 'Job Apps', path: '/dashboard/jobs', icon: HiBriefcase },
      { name: 'Internships', path: '/dashboard/internships', icon: HiBriefcase },
    ]
  },
  {
    title: 'Support',
    links: [
      { name: 'Support Tickets', path: '/dashboard/tickets', icon: HiTicket },
      { name: 'Notifications', path: '/dashboard/notifications', icon: HiBell },
    ]
  }
];

const adminSections = [
  {
    title: 'Core Insights',
    links: [
      { name: 'Dashboard KPIs', path: '/admin', icon: HiChartPie },
      { name: 'Analytics', path: '/admin/analytics', icon: HiChartPie },
    ]
  },
  {
    title: 'User & CRM',
    links: [
      { name: 'Leads CRM', path: '/admin/leads', icon: HiInbox },
      { name: 'Users', path: '/admin/users', icon: HiUsers },
      { name: 'Team Mgmt', path: '/admin/team', icon: HiUserGroup },
      { name: 'Partners', path: '/admin/partners', icon: HiBriefcase },
    ]
  },
  {
    title: 'Operations',
    links: [
      { name: 'Projects', path: '/admin/projects', icon: HiFolderOpen },
      { name: 'Services Mgmt', path: '/admin/services', icon: HiCollection },
      { name: 'Consultations', path: '/admin/bookings', icon: HiUserGroup },
      { name: 'Custom Requests', path: '/admin/custom-requests', icon: HiInbox },
      { name: 'Jobs Mgmt', path: '/admin/jobs', icon: HiBriefcase },
      { name: 'Internships', path: '/admin/internships', icon: HiBriefcase },
    ]
  },
  {
    title: 'Finance & Compliance',
    links: [
      { name: 'Finance Dashboard', path: '/admin/finance', icon: HiChartPie },
      { name: 'Payments', path: '/admin/payments', icon: HiCreditCard },
      { name: 'Escrow', path: '/admin/escrow', icon: HiCurrencyRupee },
      { name: 'Retainers', path: '/admin/retainers', icon: HiClipboardList },
      { name: 'Verifications', path: '/admin/verifications', icon: HiBadgeCheck },
    ]
  },
  {
    title: 'Content Management',
    links: [
      { name: 'Blog', path: '/admin/blog', icon: HiPencilAlt },
      { name: 'Portfolio', path: '/admin/portfolio', icon: HiPhotograph },
      { name: 'Industry Pages', path: '/admin/industries', icon: HiDocumentText },
      { name: 'Reviews', path: '/admin/reviews', icon: HiStar },
    ]
  },
  {
    title: 'System Admin',
    links: [
      { name: 'Tickets', path: '/admin/tickets', icon: HiTicket },
      { name: 'Broadcasts', path: '/admin/broadcasts', icon: HiBell },
      { name: 'Audit Logs', path: '/admin/audit-logs', icon: HiClipboardList },
    ]
  }
];

const partnerSections = [
  {
    title: 'Marketplace',
    links: [
      { name: 'Dashboard', path: '/partner-portal', icon: HiChartPie },
      { name: 'Commission Payouts', path: '/partner-portal/payouts', icon: HiCurrencyRupee },
    ]
  }
];

const Sidebar = ({ isMobile, closeMobileSidebar }) => {
  const { user } = useSelector((state) => state.auth);
  const { branding } = useSelector((state) => state.branding);
  const location = useLocation();
  const dispatch = useDispatch();

  const sections = location.pathname.startsWith('/partner-portal')
    ? partnerSections
    : (user?.role?.name === 'admin' || user?.role?.name === 'super_admin')
      ? adminSections
      : clientSections;

  const handleLogout = () => {
    dispatch(logout());
  };

  const getNavContent = (gradientId) => (
    <div className="flex flex-col h-full bg-surface-950 border-r border-white/5">
      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2 group" onClick={isMobile ? closeMobileSidebar : undefined}>
          {branding?.logoUrl ? (
            <img src={branding.logoUrl} alt="Logo" className="w-8 h-8 rounded shrink-0" />
          ) : (
            <div className="w-8 h-8 flex items-center justify-center group-hover:shadow-glow-primary rounded-xl transition-shadow duration-300 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <polygon points="50 5, 90 25, 90 75, 50 95, 10 75, 10 25" fill={`url(#${gradientId})`} />
                <path d="M 50 28 L 72 45 L 63 54 L 55 48 L 55 72 L 45 72 L 45 48 L 37 54 L 28 45 Z" fill="white" />
              </svg>
            </div>
          )}
          <span className="text-xl font-display font-extrabold tracking-wide ml-1 truncate">
            {branding?.companyName ? (
              <span className="text-white">{branding.companyName}</span>
            ) : (
              <>
                <span className="text-white">TARK</span>
                <span className="text-primary-500">KO</span>
              </>
            )}
          </span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">{user?.name}</h3>
            <p className="text-xs text-surface-400 truncate">{user?.role?.name}</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title}>
            <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2 px-3">
              {section.title}
            </h4>
            <div className="space-y-1">
              {section.links.map((link) => {
                const isActive = location.pathname === link.path || (link.path !== '/dashboard' && link.path !== '/admin' && location.pathname.startsWith(link.path));
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
                    <link.icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : 'text-surface-400'} shrink-0`} />
                    <span className="truncate">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          to={(user?.role?.name === 'admin' || user?.role?.name === 'super_admin') ? '/admin/settings' : '/dashboard/settings'}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-300 hover:text-white hover:bg-white/5 transition-all"
        >
          <HiCog className="w-5 h-5 text-surface-400 shrink-0" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <HiLogout className="w-5 h-5 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 z-40">
        {getNavContent('desktop-grad')}
      </aside>

      {/* Mobile Sidebar overlay */}
      {isMobile && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-surface-950/80 backdrop-blur-sm"
            onClick={closeMobileSidebar}
          />
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            {getNavContent('mobile-grad')}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
