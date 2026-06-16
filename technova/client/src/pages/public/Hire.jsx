import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiSearch, HiFilter, HiBadgeCheck, HiStar } from 'react-icons/hi';
import { Link } from 'react-router-dom';

// Temporary mock data for UI testing
const mockTalent = [
  {
    id: 't1',
    name: 'Sarah Jenkins',
    title: 'Senior React Native Developer',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    skills: ['React Native', 'TypeScript', 'Node.js'],
    hourlyRate: 45,
    rating: 4.9,
    verified: true,
    availability: 'Available Now'
  },
  {
    id: 't2',
    name: 'David Chen',
    title: 'Machine Learning Engineer',
    avatar: 'https://i.pravatar.cc/150?u=david',
    skills: ['Python', 'TensorFlow', 'PyTorch'],
    hourlyRate: 60,
    rating: 5.0,
    verified: true,
    availability: 'Part-time'
  },
  {
    id: 't3',
    name: 'Elena Rodriguez',
    title: 'UI/UX Lead Designer',
    avatar: 'https://i.pravatar.cc/150?u=elena',
    skills: ['Figma', 'User Research', 'Prototyping'],
    hourlyRate: 40,
    rating: 4.8,
    verified: false,
    availability: 'Available Now'
  }
];

const Hire = () => {
  return (
    <>
      <Helmet>
        <title>Hire Top Tech Talent — TechNova</title>
        <meta name="description" content="Hire verified professionals directly from TechNova. Full Stack Developers, AI Engineers, UX Designers and more." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Hire <span className="gradient-text">World-Class</span> Tech Talent
            </h1>
            <p className="text-lg text-surface-400">
              Skip the agency middleman. Hire verified developers, designers, and engineers directly on your terms.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <div className="glass-card p-4 mb-10 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input 
                type="text" 
                placeholder="Search by skill, title, or keywords (e.g. React Developer)..." 
                className="input-field pl-12 bg-surface-900 border-none"
              />
            </div>
            <div className="flex gap-4">
              <select className="input-field bg-surface-900 border-none !w-auto">
                <option value="">All Categories</option>
                <option value="dev">Development</option>
                <option value="ai">AI & Data</option>
                <option value="design">Design</option>
              </select>
              <button className="btn-secondary flex items-center gap-2">
                <HiFilter /> Filters
              </button>
            </div>
          </div>

          {/* Talent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTalent.map((talent, i) => (
              <motion.div 
                key={talent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img src={talent.avatar} alt={talent.name} className="w-16 h-16 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white flex items-center gap-1">
                      {talent.name}
                      {talent.verified && <HiBadgeCheck className="w-5 h-5 text-primary-400" title="Verified Expert" />}
                    </h3>
                    <p className="text-sm text-primary-400 font-medium">{talent.title}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {talent.skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-surface-800 rounded-md text-xs text-surface-300">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
                  <div>
                    <p className="text-xs text-surface-500 mb-1">Hourly Rate</p>
                    <p className="text-white font-bold">${talent.hourlyRate}/hr</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 mb-1">Rating</p>
                    <p className="text-white font-bold flex items-center gap-1">
                      <HiStar className="text-yellow-400" /> {talent.rating}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5">
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                    {talent.availability}
                  </span>
                  <div className="flex gap-2">
                    <Link to={`/hire/${talent.id}`} className="btn-secondary !px-4 !py-2 text-sm">Profile</Link>
                    <button className="btn-primary !px-4 !py-2 text-sm">Hire</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Become an expert CTA */}
          <div className="mt-20 p-10 rounded-3xl bg-gradient-to-br from-surface-800 to-surface-900 border border-white/5 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Are you a tech professional?</h2>
            <p className="text-surface-400 mb-8 max-w-2xl mx-auto">
              Join our network of elite freelancers and experts. Set your own rates, choose your projects, and build your career on TechNova.
            </p>
            <button className="btn-primary">Apply as Talent</button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Hire;
