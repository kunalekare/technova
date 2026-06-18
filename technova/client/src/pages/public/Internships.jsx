import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiSearch, HiBriefcase, HiClock, HiCurrencyRupee, HiLocationMarker } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    fetchInternships();
  }, [search, department]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      let query = '';
      if (search) query += `?search=${search}`;
      if (department) query += `${query ? '&' : '?'}department=${department}`;
      
      const res = await api.get(`/internships${query}`);
      setInternships(res.data.data);
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Internships — Velixora</title>
        <meta name="description" content="Find premium internships in software, design, and marketing. Launch your career with Velixora and our partner companies." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Launch Your <span className="gradient-text">Tech Career</span>
            </h1>
            <p className="text-lg text-surface-400">
              Apply for exclusive internships at Velixora and our partner companies. Learn from industry experts and build real-world products.
            </p>
          </motion.div>

          <div className="glass-card p-4 mb-10 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative w-full">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search internships by role or keyword..." 
                className="input-field pl-12 bg-surface-900 border-none w-full"
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <select 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="input-field bg-surface-900 border-none w-full"
              >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Product">Product</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : internships.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiBriefcase className="w-10 h-10 text-surface-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No internships found</h3>
              <p className="text-surface-400">We couldn't find any internships matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {internships.map((internship, i) => (
                <motion.div 
                  key={internship._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 flex flex-col sm:flex-row gap-6 hover:border-primary-500/30 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex flex-shrink-0 items-center justify-center group-hover:scale-105 transition-transform">
                    <HiBriefcase className="w-8 h-8 text-primary-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">{internship.title}</h3>
                        <p className="text-primary-400/80 text-sm font-medium">{internship.company}</p>
                      </div>
                      <span className="badge-primary !bg-surface-800 text-xs">{internship.department}</span>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-surface-300 bg-surface-950/50 p-2.5 rounded-lg border border-white/5">
                        <HiCurrencyRupee className="w-4 h-4 text-emerald-400" />
                        <span className="whitespace-nowrap">{internship.stipend}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-surface-300 bg-surface-950/50 p-2.5 rounded-lg border border-white/5">
                        <HiClock className="w-4 h-4 text-blue-400" />
                        <span className="whitespace-nowrap">{internship.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-surface-300 bg-surface-950/50 p-2.5 rounded-lg border border-white/5">
                        <HiLocationMarker className="w-4 h-4 text-purple-400" />
                        <span className="whitespace-nowrap">{internship.mode}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-white/5 pt-4 gap-4">
                      <span className="text-xs text-surface-500">
                        Apply by: {internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'Ongoing'}
                      </span>
                      <Link to={`/internships/${internship._id}`} className="btn-primary w-full sm:w-auto text-center !px-6 py-2 text-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Post Internship CTA */}
          <div className="mt-20 p-10 rounded-3xl bg-gradient-to-r from-surface-800 to-surface-900 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Are you a company looking for interns?</h2>
              <p className="text-surface-400">Post your internship opportunities and hire from our pool of vetted talent.</p>
            </div>
            <Link to="/contact" className="btn-secondary whitespace-nowrap">Contact Us</Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default Internships;
