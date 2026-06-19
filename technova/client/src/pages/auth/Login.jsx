import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { loginUser, clearError, setCredentials } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading, error, user } = useSelector((state) => state.auth);

  const fromPath = location.state?.from?.pathname || '/dashboard';
  const fromSearch = location.state?.from?.search || '';
  const from = fromPath + fromSearch;

  // Handle Google OAuth callback
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      dispatch(setCredentials({ accessToken: token }));
      navigate(from, { replace: true });
    }
  }, [searchParams, dispatch, navigate, from]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const isAdmin = user.role?.name === 'admin' || user.role?.name === 'super_admin';
      const defaultRoute = isAdmin ? '/admin' : '/dashboard';
      const targetPath = location.state?.from?.pathname || defaultRoute;
      const targetSearch = location.state?.from?.search || '';
      navigate(targetPath + targetSearch, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || '/api/v1'}/auth/google`;
  };

  return (
    <>
      <Helmet>
        <title>Login — Tarkko Solutions</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background effects */}
        <div className="fixed inset-0 bg-hero-gradient -z-10" />
        <div className="fixed inset-0 dot-pattern opacity-20 -z-10" />
        <div className="fixed top-1/3 -left-32 w-72 h-72 bg-primary-500/15 rounded-full blur-[100px] -z-10" />
        <div className="fixed bottom-1/3 -right-32 w-72 h-72 bg-accent-500/10 rounded-full blur-[100px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8 md:p-10">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9L12 4L18 9V18L12 22L6 18Z" />
                    <circle cx="12" cy="13" r="3" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-2xl font-display font-bold">
                  <span className="text-white">Tark</span>
                  <span className="gradient-text">ko</span>
                </span>
              </Link>
              <h1 className="text-2xl font-display font-bold text-white mb-1">Welcome Back</h1>
              <p className="text-surface-400 text-sm">Sign in to your account to continue</p>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all duration-300 mb-6"
              id="login-google-btn"
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-surface-500">or sign in with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-surface-300 mb-1.5 block">Email</label>
                <div className="relative">
                  <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-12"
                    placeholder="you@email.com"
                    id="login-email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm text-surface-300">Password</label>
                  <Link to="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-12 pr-12"
                    placeholder="••••••••"
                    id="login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300"
                  >
                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
                id="login-submit-btn"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-surface-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
