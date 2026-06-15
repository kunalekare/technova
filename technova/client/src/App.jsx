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
import ProjectScoper from './components/ai/ProjectScoper';

// Admin Pages
import { AdminRoute } from './routes/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import LeadsCRM from './pages/admin/LeadsCRM';
import UsersManager from './pages/admin/UsersManager';
import ServicesManager from './pages/admin/ServicesManager';
import ProjectsManager from './pages/admin/ProjectsManager';

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
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="orders" element={<Orders />} />
          <Route path="tickets" element={<Tickets />} />
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
          <Route path="leads" element={<LeadsCRM />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="projects" element={<ProjectsManager />} />
        </Route>
      </Routes>
      <ChatbotWidget />
    </>
  );
};

export default App;
