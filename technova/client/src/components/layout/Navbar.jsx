import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiSearch, HiChevronDown, HiUser, HiLogout, HiViewGrid } from 'react-icons/hi';
import { logout } from '../../redux/slices/authSlice';

const navLinks = [
  { name: 'Services', path: '/services' },
  { 
    name: 'Careers', 
    path: '/careers',
    dropdown: [
      { name: 'Internships', path: '/internships' }
    ]
  },
  {
    name: 'Partners',
    path: '/partners/apply'
  },
  { 
    name: 'Portfolio', 
    path: '/portfolio',
    dropdown: [
      { name: 'Blog', path: '/blog' }
    ]
  },
  { 
    name: 'Contact Us', 
    path: '/contact',
    dropdown: [
      { name: 'About', path: '/about' },
      { name: 'Trust Center', path: '/trust' }
    ]
  },
];

const DropdownItem = ({ link, location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={link.path}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          location.pathname === link.path
            ? 'text-primary-400 bg-primary-500/10'
            : 'text-surface-300 hover:text-white'
        }`}
      >
        {link.name}
        <HiChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-48 glass-card p-2 border border-white/10"
          >
            {link.dropdown.map((subLink) => (
              <Link
                key={subLink.name}
                to={subLink.path}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === subLink.path
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-surface-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {subLink.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-surface-950/80 backdrop-blur-xl border-b border-white/5 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 flex items-center justify-center group-hover:shadow-glow-primary rounded-xl transition-shadow duration-300">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="tarkkoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <polygon points="50 5, 90 25, 90 75, 50 95, 10 75, 10 25" fill="url(#tarkkoGrad)" />
                <path d="M 50 28 L 72 45 L 63 54 L 55 48 L 55 72 L 45 72 L 45 48 L 37 54 L 28 45 Z" fill="white" />
              </svg>
            </div>
            <span className="text-2xl font-display font-extrabold tracking-wide ml-1.5">
              <span className="text-white">TARK</span>
              <span className="text-primary-500">KO</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              link.dropdown ? (
                <DropdownItem key={link.name} link={link} location={location} />
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 animated-underline ${
                    location.pathname === link.path
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-surface-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-white/5 transition-all duration-300"
              id="nav-search-btn"
            >
              <HiSearch className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              /* Authenticated Menu */
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all duration-300"
                  id="nav-profile-btn"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <HiChevronDown className={`w-4 h-4 text-surface-400 transition-transform duration-300 hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 glass-card p-2 origin-top-right border border-white/10"
                    >
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-surface-400 truncate">{user?.email}</p>
                      </div>
                      <Link to={user?.role?.name === 'admin' || user?.role?.name === 'super_admin' ? '/admin' : '/dashboard'} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-surface-300 hover:text-white hover:bg-white/5 transition-all">
                        <HiViewGrid className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-surface-300 hover:text-white hover:bg-white/5 transition-all">
                        <HiUser className="w-4 h-4" /> Profile
                      </Link>
                      <button
                         onClick={handleLogout}
                         className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                      >
                        <HiLogout className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Guest Buttons */
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-surface-300 hover:text-white transition-colors" id="nav-login-btn">
                  Login
                </Link>
                <Link to="/register" className="btn-primary !px-5 !py-2 text-sm" id="nav-register-btn">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-lg text-surface-400 hover:text-white hover:bg-white/5 transition-all"
              id="nav-mobile-btn"
            >
              {isMobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-surface-900/95 backdrop-blur-xl border-b border-white/10 p-4"
          >
            <form onSubmit={handleSearch} className="container-max mx-auto">
              <div className="relative">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services, categories..."
                  className="input-field pl-12 pr-4"
                  autoFocus
                  id="nav-search-input"
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface-900/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    to={link.path}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? 'text-primary-400 bg-primary-500/10'
                        : 'text-surface-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <div className="pl-6 pr-4 py-1 space-y-1 border-l-2 border-white/5 ml-4">
                      {link.dropdown.map(subLink => (
                        <Link
                          key={subLink.name}
                          to={subLink.path}
                          className={`block px-4 py-2 rounded-lg text-sm transition-all ${
                            location.pathname === subLink.path
                              ? 'text-primary-400 bg-primary-500/10'
                              : 'text-surface-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {subLink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {!isAuthenticated && (
                <div className="pt-3 border-t border-white/10 flex gap-3">
                  <Link to="/login" className="flex-1 text-center py-3 rounded-lg text-sm font-medium text-surface-300 border border-surface-600/50 hover:border-primary-500/50 transition-all">
                    Login
                  </Link>
                  <Link to="/register" className="flex-1 btn-primary text-center !py-3 text-sm">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
