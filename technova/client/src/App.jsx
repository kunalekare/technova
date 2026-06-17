import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMe, setInitialized } from './redux/slices/authSlice';

import AuthCallback from './pages/auth/AuthCallback';

// Layout & UI
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ChatbotWidget from './components/ai/ChatbotWidget';

// Public Pages
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import ServiceDetail from './pages/public/ServiceDetail';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Portfolio from './pages/public/Portfolio';
import Blog from './pages/public/Blog';
import Careers from './pages/public/Careers';
import JobDetail from './pages/public/JobDetail';
import Internships from './pages/public/Internships';
import InternshipDetail from './pages/public/InternshipDetail';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard Pages & Routes
import DashboardLayout from './components/layout/DashboardLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import Dashboard from './pages/user/Dashboard';
import Profile from './pages/user/Profile';
import Wishlist from './pages/user/Wishlist';
import Projects from './pages/user/Projects';
import ProjectDetail from './pages/user/ProjectDetail';
import Orders from './pages/user/Orders';
import Tickets from './pages/user/Tickets';
import Notifications from './pages/user/Notifications';
import ProjectScoper from './components/ai/ProjectScoper';
import MyJobApplications from './pages/user/MyJobApplications';
import MyInternships from './pages/user/MyInternships';
import Settings from './pages/user/Settings';

// Admin Pages
import { AdminRoute } from './routes/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import LeadsCRM from './pages/admin/LeadsCRM';
import UsersManager from './pages/admin/UsersManager';
import ServicesManager from './pages/admin/ServicesManager';
import ProjectsManager from './pages/admin/ProjectsManager';
import AdminProjectDetail from './pages/admin/AdminProjectDetail';
import TeamManager from './pages/admin/TeamManager';
import PaymentsManager from './pages/admin/PaymentsManager';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import BlogManager from './pages/admin/BlogManager';
import PortfolioManager from './pages/admin/PortfolioManager';
import ReviewModerator from './pages/admin/ReviewModerator';
import SupportTickets from './pages/admin/SupportTickets';
import BroadcastNotifications from './pages/admin/BroadcastNotifications';
import AdminJobs from './pages/admin/AdminJobs';
import AdminInternships from './pages/admin/AdminInternships';
import AdminCustomRequests from './pages/admin/AdminCustomRequests';

import { Outlet } from 'react-router-dom';

const PublicLayout = () => (
  <div className="min-h-screen bg-surface-950 flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Apply saved theme
    const savedTheme = localStorage.getItem('technova_theme') || 'purple';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(getMe());
    } else {
      dispatch(setInitialized());
    }
  }, [dispatch]);

  return (
    <>
      <Routes>
        {/* Public routes wrapped in PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/blog" element={<Blog />} />

          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:id" element={<JobDetail />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/internships/:id" element={<InternshipDetail />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-8xl font-display font-bold gradient-text mb-4">404</h1>
                  <p className="text-surface-400 text-xl mb-8">Page not found</p>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              </div>
            }
          />
        </Route>

        {/* Dashboard routes wrapped in ProtectedRoute and DashboardLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="jobs" element={<MyJobApplications />} />
          <Route path="internships" element={<MyInternships />} />
          <Route path="orders" element={<Orders />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="scoper" element={
            <div className="max-w-4xl mx-auto"><ProjectScoper /></div>
          } />
        </Route>

        {/* Admin routes wrapped in AdminRoute and DashboardLayout */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <DashboardLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="leads" element={<LeadsCRM />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="custom-requests" element={<AdminCustomRequests />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="projects/:id" element={<AdminProjectDetail />} />
          <Route path="team" element={<TeamManager />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="internships" element={<AdminInternships />} />
          <Route path="payments" element={<PaymentsManager />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="portfolio" element={<PortfolioManager />} />
          <Route path="reviews" element={<ReviewModerator />} />
          <Route path="tickets" element={<SupportTickets />} />
          <Route path="broadcasts" element={<BroadcastNotifications />} />
        </Route>
      </Routes>
      <ChatbotWidget />
    </>
  );
};

export default App;
