import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { HiBriefcase, HiCurrencyDollar, HiBadgeCheck, HiStar } from 'react-icons/hi';

const PartnerDashboard = () => {
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalEarnings: 0,
    pendingPayouts: 0,
    score: 0
  });

  useEffect(() => {
    // We could fetch dashboard stats here
    api.get('/commissions/my').then(res => {
      const ledgers = res.data.data;
      const earnings = ledgers.filter(l => l.status === 'paid').reduce((acc, l) => acc + l.netPayout, 0);
      const pending = ledgers.filter(l => l.status === 'pending').reduce((acc, l) => acc + l.netPayout, 0);
      
      setStats(prev => ({ ...prev, totalEarnings: earnings, pendingPayouts: pending }));
    });
    
    api.get('/partners/my').then(res => {
      if (res.data.data?.partner) {
        setStats(prev => ({ ...prev, score: res.data.data.partner.pastPerformanceScore }));
      }
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Partner Portal | TechNova</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Partner Portal</h1>
        <p className="text-surface-400 mb-8">Manage your marketplace projects, earnings, and badges.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <HiBriefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-surface-400 text-sm font-medium">Active Projects</p>
                <h3 className="text-2xl font-bold text-white">0</h3>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <HiCurrencyDollar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-surface-400 text-sm font-medium">Total Earnings</p>
                <h3 className="text-2xl font-bold text-white">${stats.totalEarnings}</h3>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <HiStar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-surface-400 text-sm font-medium">Pending Payouts</p>
                <h3 className="text-2xl font-bold text-white">${stats.pendingPayouts}</h3>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <HiBadgeCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-surface-400 text-sm font-medium">Performance Score</p>
                <h3 className="text-2xl font-bold text-white">{stats.score}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerDashboard;
