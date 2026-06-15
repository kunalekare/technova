import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  return (
    <>
      <Helmet>
        <title>Forgot Password — TechNova Solutions</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-card p-8 text-center">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Forgot Password?</h2>
          <p className="text-surface-400 text-sm mb-6">Enter your email address and we'll send you a link to reset your password.</p>
          <form className="space-y-4">
            <input type="email" placeholder="Your email address" className="input-field w-full" required />
            <button type="submit" className="btn-primary w-full">Send Reset Link</button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword;
