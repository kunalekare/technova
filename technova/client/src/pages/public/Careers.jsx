import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiSearch, HiCurrencyDollar, HiLocationMarker, HiBriefcase } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [search, department]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs', {
        params: { search, department, limit: 20 }
      });
      setJobs(res.data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load open positions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Careers — Join TechNova</title>
        <meta name="description" content="Explore open positions at TechNova. We are hiring talented engineers, designers, and marketers." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Join the <span className="gradient-text">TechNova</span> Team
            </h1>
            <p className="text-lg text-surface-400">
              We're on a mission to build the future of digital products. Help us shape the next generation of software solutions.
            </p>
          </motion.div>

          <div className="bg-surface-900 border border-white/10 rounded-2xl p-2 mb-10 flex flex-col md:flex-row gap-2 backdrop-blur-md relative z-10 shadow-2xl">
            <div className="flex-1 relative flex items-center">
              <HiSearch className="absolute left-4 w-5 h-5 text-primary-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search open positions..." 
                className="w-full bg-transparent border-none focus:ring-0 text-white pl-12 pr-4 py-3 placeholder-surface-500 outline-none"
              />
            </div>
            <div className="h-full w-px bg-white/10 hidden md:block mx-2" />
            <div className="flex gap-2">
              <select 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-transparent text-surface-300 focus:ring-0 border-none py-3 px-4 cursor-pointer hover:text-white transition outline-none"
              >
                <option value="" className="bg-surface-900">All Departments</option>
                <option value="Engineering" className="bg-surface-900">Engineering</option>
                <option value="Design" className="bg-surface-900">Design</option>
                <option value="Marketing" className="bg-surface-900">Marketing</option>
                <option value="Product" className="bg-surface-900">Product</option>
                <option value="Sales" className="bg-surface-900">Sales</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-surface-800/50 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-500/10 text-red-400 p-6 rounded-2xl border border-red-500/20 text-center">
              {error}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 bg-surface-900/50 rounded-3xl border border-white/5">
              <HiBriefcase className="w-16 h-16 text-surface-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Openings Found</h3>
              <p className="text-surface-400">There are no jobs matching your criteria right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job, i) => (
                <motion.div 
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-surface-900 border border-white/5 p-8 rounded-3xl flex flex-col hover:border-primary-500/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/10 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-accent-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{job.title}</h3>
                      <p className="text-primary-400 font-medium">{job.department}</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-surface-800 text-surface-300 text-xs font-semibold border border-white/5">
                      {job.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-auto mb-8 pt-6 border-t border-white/5 relative z-10">
                    <div className="flex items-center gap-3 text-sm text-surface-300 bg-surface-950 p-3 rounded-xl border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <HiCurrencyDollar className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="font-medium">{job.salaryRange || 'Competitive'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-surface-300 bg-surface-950 p-3 rounded-xl border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <HiLocationMarker className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="font-medium">{job.mode} {job.location && <span className="text-surface-500">({job.location})</span>}</span>
                    </div>
                  </div>

                  <Link to={`/careers/${job._id}`} className="btn-secondary w-full py-3.5 !rounded-xl text-center relative z-10 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500 transition-all font-bold">
                    View Role Details
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Careers;
