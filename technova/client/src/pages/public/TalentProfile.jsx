import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { HiBadgeCheck, HiStar, HiLocationMarker, HiBriefcase, HiMail } from 'react-icons/hi';

const TalentProfile = () => {
  const { id } = useParams();

  // Mock data
  const talent = {
    id,
    name: 'Sarah Jenkins',
    title: 'Senior React Native Developer',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    location: 'San Francisco, CA',
    bio: 'Passionate and results-driven Senior Mobile Engineer with 8+ years of experience building high-performance mobile applications. Specialized in React Native, TypeScript, and native modules. Successfully delivered 15+ apps for enterprise clients across fintech and healthcare sectors.',
    skills: ['React Native', 'TypeScript', 'Node.js', 'Redux', 'GraphQL', 'Swift', 'Kotlin'],
    hourlyRate: 45,
    rating: 4.9,
    reviews: 24,
    verified: true,
    availability: 'Available Now',
    experience: [
      {
        role: 'Senior Mobile Engineer',
        company: 'FinTech Solutions',
        duration: '2022 - Present',
        description: 'Lead mobile development team of 5 engineers. Re-architected legacy Swift app to React Native, improving development speed by 40%.'
      },
      {
        role: 'Frontend Developer',
        company: 'HealthNova Inc.',
        duration: '2019 - 2022',
        description: 'Built cross-platform patient portal app used by 50k+ active users monthly.'
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{talent.name} - {talent.title} | TechNova Hire</title>
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Profile Card */}
            <div className="w-full lg:w-1/3">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 sticky top-24">
                <div className="text-center mb-6">
                  <img src={talent.avatar} alt={talent.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-surface-800" />
                  <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                    {talent.name}
                    {talent.verified && <HiBadgeCheck className="w-6 h-6 text-primary-400" title="Verified Expert" />}
                  </h1>
                  <p className="text-primary-400 font-medium mb-2">{talent.title}</p>
                  <p className="text-sm text-surface-400 flex items-center justify-center gap-1">
                    <HiLocationMarker /> {talent.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">${talent.hourlyRate}</p>
                    <p className="text-xs text-surface-500">Hourly Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                      <HiStar className="text-yellow-400 w-5 h-5" /> {talent.rating}
                    </p>
                    <p className="text-xs text-surface-500">{talent.reviews} Jobs</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-surface-300 mb-2">Availability</p>
                  <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full">
                    {talent.availability}
                  </span>
                </div>

                <button className="btn-primary w-full mb-3 flex items-center justify-center gap-2">
                  <HiBriefcase className="w-5 h-5" /> Hire {talent.name.split(' ')[0]}
                </button>
                <button className="btn-secondary w-full flex items-center justify-center gap-2">
                  <HiMail className="w-5 h-5" /> Message
                </button>
              </motion.div>
            </div>

            {/* Right Column: Details */}
            <div className="w-full lg:w-2/3 space-y-6">
              
              {/* Bio */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
                <h2 className="text-xl font-bold text-white mb-4">About Me</h2>
                <p className="text-surface-300 leading-relaxed">{talent.bio}</p>
              </motion.div>

              {/* Skills */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8">
                <h2 className="text-xl font-bold text-white mb-4">Skills & Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {talent.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-surface-800 border border-white/5 rounded-lg text-sm text-surface-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Experience */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8">
                <h2 className="text-xl font-bold text-white mb-6">Work Experience</h2>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[1.2rem] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary-500/20 before:to-transparent">
                  {talent.experience.map((exp, i) => (
                    <div key={i} className="relative flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-900 border-2 border-primary-500/50 flex-shrink-0 flex items-center justify-center z-10 mt-1">
                        <HiBriefcase className="w-4 h-4 text-primary-400" />
                      </div>
                      <div className="glass-card p-5 flex-1 hover:border-primary-500/30 transition-colors">
                        <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                        <p className="text-primary-400 text-sm mb-2">{exp.company} • {exp.duration}</p>
                        <p className="text-surface-300 text-sm">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default TalentProfile;
