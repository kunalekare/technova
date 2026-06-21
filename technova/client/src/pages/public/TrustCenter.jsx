import { Helmet } from 'react-helmet-async';
import { HiShieldCheck, HiLockClosed, HiDocumentText, HiCurrencyRupee } from 'react-icons/hi';
import { motion } from 'framer-motion';

const TrustCenter = () => {
  return (
    <>
      <Helmet>
        <title>Trust Center — Tarkko Solutions</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 font-medium text-sm mb-6 border border-emerald-500/20">
            <HiShieldCheck className="w-5 h-5" />
            Enterprise-Grade Security
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            The Tarkko Solutions Trust Center
          </h1>
          <p className="text-xl text-surface-300">
            Learn how we protect your data, guarantee your payments, and ensure a compliant development process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8 hover:border-primary-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/20 text-primary-400 flex items-center justify-center mb-6">
              <HiCurrencyRupee className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Escrow Payments</h3>
            <p className="text-surface-400 leading-relaxed">
              Your funds are held securely in escrow. We only release milestone payments to the agency once you have reviewed and approved the deliverables.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8 hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
              <HiDocumentText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Legally Binding Contracts</h3>
            <p className="text-surface-400 leading-relaxed">
              All projects are backed by legally binding e-signatures. Our integrated compliance engine ensures all NDAs and MSA agreements are tracked.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-8 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
              <HiLockClosed className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Immutable Audit Trails</h3>
            <p className="text-surface-400 leading-relaxed">
              Every action, from contract signing to fund releases, is permanently logged. We guarantee full transparency into platform operations.
            </p>
          </motion.div>
        </div>

        <div className="mt-20 glass-card p-12 text-center border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 to-transparent">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to start building securely?</h2>
          <p className="text-surface-300 max-w-2xl mx-auto mb-8">
            Complete your business verification today to unlock enterprise tier features, including custom MSAs and priority support.
          </p>
          <a href="/dashboard/verification" className="btn-primary py-3 px-8 text-base">
            Verify Your Business
          </a>
        </div>
      </div>
    </>
  );
};

export default TrustCenter;
