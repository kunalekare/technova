import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaTwitter, FaLinkedinIn, FaGithub, FaInstagram } from 'react-icons/fa';
import toast from 'react-hot-toast';

const serviceLinks = [
  { name: 'Software Development', path: '/services?category=software-development' },
  { name: 'Mobile Apps', path: '/services?category=mobile-app-development' },
  { name: 'AI & ML Solutions', path: '/services?category=artificial-intelligence' },
  { name: 'Cloud & DevOps', path: '/services?category=cloud-devops' },
  { name: 'UI/UX Design', path: '/services?category=ui-ux-design' },
  { name: 'Digital Marketing', path: '/services?category=digital-marketing' },
];

const quickLinks = [
  { name: 'Services', path: '/services' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Blog', path: '/blog' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Careers', path: '/careers' },
];

const socialLinks = [
  { Icon: FaTwitter, href: '#', label: 'Twitter' },
  { Icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  { Icon: FaGithub, href: '#', label: 'GitHub' },
  { Icon: FaInstagram, href: '#', label: 'Instagram' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-surface-950 border-t border-white/5">
      {/* Gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl">
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
            <p className="text-surface-400 text-sm leading-relaxed mb-6">
              Your one-stop technology partner. From AI to enterprise software, we deliver exceptional digital solutions across 16+ service categories.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href !== '#' ? "_blank" : undefined}
                  rel={href !== '#' ? "noopener noreferrer" : undefined}
                  onClick={(e) => { if(href === '#') { e.preventDefault(); toast('Coming soon!', { icon: '🚀' }); } }}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-surface-400 hover:text-primary-400 hover:border-primary-500/30 hover:bg-primary-500/10 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4">Services</h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-surface-400 hover:text-primary-400 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-surface-400 hover:text-primary-400 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-surface-400 select-all">
                <HiMail className="w-4 h-4 flex-shrink-0" />
                tarkkodigital@gmail.com
              </div>
              <a href="tel:+919876543210" className="flex items-center gap-3 text-sm text-surface-400 hover:text-primary-400 transition-colors">
                <HiPhone className="w-4 h-4 flex-shrink-0" />
                +91 98765 43210
              </a>
              <div className="flex items-start gap-3 text-sm text-surface-400">
                <HiLocationMarker className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Nagpur, India</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm text-surface-300 font-medium mb-2">Stay Updated</p>
              <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); toast.success('Subscribed successfully!'); e.target.reset(); }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input-field !py-2 text-sm flex-1"
                  required
                  id="footer-newsletter-input"
                />
                <button type="submit" className="btn-primary !px-4 !py-2 text-sm" id="footer-newsletter-btn">
                  →
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500">
            © {currentYear} Tarkko Solutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-surface-500 hover:text-surface-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-surface-500 hover:text-surface-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
