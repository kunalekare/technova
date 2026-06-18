import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiLightningBolt, HiUserGroup, HiGlobe, HiShieldCheck, HiArrowRight, HiCode, HiChip, HiCubeTransparent } from 'react-icons/hi';

const stats = [
  { label: 'Global Clients', value: '150+' },
  { label: 'Projects Delivered', value: '500+' },
  { label: 'Countries Served', value: '25+' },
  { label: 'Expert Team', value: '40+' },
];

const values = [
  { icon: HiLightningBolt, title: 'Innovation First', desc: 'We leverage cutting-edge technologies — AI, cloud, and modern frameworks — to deliver solutions that keep you ahead of the curve.' },
  { icon: HiUserGroup, title: 'Client-Centric', desc: 'Every project starts with understanding your unique needs. We assign dedicated teams and provide transparent progress tracking throughout.' },
  { icon: HiGlobe, title: 'Global Reach', desc: 'Serving 150+ clients across 25+ countries, we bring diverse industry experience and 24/7 support to every engagement.' },
  { icon: HiShieldCheck, title: 'Quality Assurance', desc: 'Rigorous testing, code reviews, and milestone-based delivery ensure every project meets the highest standards of quality.' },
];

const capabilities = [
  { icon: HiCode, title: 'Software Engineering', desc: 'Scalable web and mobile applications built with React, Node.js, and cloud-native architectures.' },
  { icon: HiChip, title: 'AI & Data Science', desc: 'Intelligent solutions including predictive modeling, NLP, and computer vision integration.' },
  { icon: HiCubeTransparent, title: 'Cloud Infrastructure', desc: 'Robust AWS/GCP deployments, DevOps pipelines, and high-availability systems.' },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Velixora Solutions</title>
        <meta name="description" content="Velixora Solutions is a premium technology agency delivering scalable software, AI integration, and cloud infrastructure to global enterprises." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16 bg-surface-950">
        
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 lg:py-32">
          <div className="absolute inset-0 bg-hero-gradient opacity-40 pointer-events-none" />
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-800 border border-white/5 text-sm text-primary-400 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              Empowering Digital Transformation
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl md:text-7xl font-display font-bold text-white mb-6 md:mb-8 leading-tight tracking-tight"
            >
              Building the <span className="gradient-text">Architecture</span> of Tomorrow.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg md:text-xl text-surface-400 leading-relaxed mb-8 md:mb-10"
            >
              We are an elite collective of engineers, designers, and strategists. Velixora partners with ambitious brands to build scalable software and integrate transformative AI solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/contact" className="btn-primary px-6 py-3 md:px-8 md:py-4 text-base md:text-lg">Partner With Us</Link>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-white/5 bg-surface-900/50 backdrop-blur-sm relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 md:gap-12 md:divide-x md:divide-white/5">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center px-2 md:px-4"
                >
                  <div className="text-3xl md:text-5xl font-display font-bold text-white mb-2 tracking-tighter">
                    {stat.value}
                  </div>
                  <div className="text-[10px] md:text-sm font-medium text-primary-400 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Capabilities */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Our Expertise</h2>
            <p className="text-surface-400 max-w-2xl mx-auto">We don't just write code; we solve complex engineering challenges.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-surface-800 to-surface-900 border border-white/5 hover:border-primary-500/30 transition-colors group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-6 group-hover:bg-primary-500/20 transition-colors">
                  <cap.icon className="w-7 h-7 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{cap.title}</h3>
                <p className="text-surface-400 leading-relaxed">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-surface-900 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/3">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                  Driven by <span className="gradient-text">Excellence</span>
                </h2>
                <p className="text-surface-400 leading-relaxed mb-8">
                  Our core values are embedded in every line of code we write and every interaction we have with our partners. We believe in transparency, rigorous quality control, and pushing the boundaries of what is technically possible.
                </p>
                <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
              </div>
              
              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-2xl bg-surface-800 border border-white/5"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-700 flex items-center justify-center flex-shrink-0">
                        <v.icon className="w-5 h-5 text-primary-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{v.title}</h3>
                    </div>
                    <p className="text-sm text-surface-400 leading-relaxed">{v.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-8 md:p-20 text-center border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-accent-900/40" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 md:mb-6">
                Ready to accelerate your roadmap?
              </h2>
              <p className="text-lg md:text-xl text-surface-300 mb-8 md:mb-10 max-w-2xl mx-auto">
                Join the fastest-growing enterprises that trust Velixora to scale their digital infrastructure.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                <Link to="/contact" className="btn-primary px-6 py-3 md:px-8 md:py-4 text-base md:text-lg">
                  Start a Conversation
                </Link>
                <Link to="/portfolio" className="btn-secondary px-6 py-3 md:px-8 md:py-4 text-base md:text-lg bg-surface-900/50">
                  View Our Work
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default About;
