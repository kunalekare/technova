import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiLightningBolt, HiUserGroup, HiGlobe, HiShieldCheck, HiArrowRight } from 'react-icons/hi';

const values = [
  { icon: HiLightningBolt, title: 'Innovation First', desc: 'We leverage cutting-edge technologies — AI, cloud, and modern frameworks — to deliver solutions that keep you ahead of the curve.' },
  { icon: HiUserGroup, title: 'Client-Centric', desc: 'Every project starts with understanding your unique needs. We assign dedicated teams and provide transparent progress tracking throughout.' },
  { icon: HiGlobe, title: 'Global Reach', desc: 'Serving 150+ clients across 25+ countries, we bring diverse industry experience and 24/7 support to every engagement.' },
  { icon: HiShieldCheck, title: 'Quality Assurance', desc: 'Rigorous testing, code reviews, and milestone-based delivery ensure every project meets the highest standards of quality.' },
];

const timeline = [
  { year: '2020', title: 'Founded', desc: 'TechNova Solutions was born from a vision to make enterprise-grade technology services accessible to businesses of all sizes.' },
  { year: '2021', title: 'Expanded to 10 Service Categories', desc: 'Grew from software development to include AI, cloud, design, and digital marketing services.' },
  { year: '2022', title: 'AI Integration', desc: 'Launched AI-powered project estimation, requirement analysis, and proposal generation tools.' },
  { year: '2023', title: '500+ Projects Milestone', desc: 'Reached 500 completed projects serving clients across 25 countries.' },
  { year: '2024', title: 'Marketplace Launch', desc: 'Evolved into a full marketplace platform with 16 service categories and real-time project management.' },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us — TechNova Solutions</title>
        <meta name="description" content="Learn about TechNova Solutions — your one-stop technology partner delivering AI, software, cloud, design, and marketing services to 150+ clients worldwide." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        {/* Hero */}
        <section className="relative section-padding overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 dot-pattern opacity-20" />
          <div className="container-max mx-auto relative z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
            >
              We Build <span className="gradient-text">Technology</span> That Matters
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-surface-300 max-w-2xl mx-auto"
            >
              TechNova Solutions is a full-stack technology services marketplace and managed agency. We connect businesses with expert teams across 16 service categories.
            </motion.p>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding">
          <div className="container-max mx-auto">
            <h2 className="text-3xl font-display font-bold text-white text-center mb-12">
              Our <span className="gradient-text">Values</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 flex gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                    <v.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{v.title}</h3>
                    <p className="text-sm text-surface-400 leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-padding">
          <div className="container-max mx-auto">
            <h2 className="text-3xl font-display font-bold text-white text-center mb-12">
              Our <span className="gradient-text">Journey</span>
            </h2>
            <div className="max-w-2xl mx-auto">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 mb-8 last:mb-0"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {item.year.slice(2)}
                    </div>
                    {i < timeline.length - 1 && <div className="w-px flex-1 bg-gradient-to-b from-primary-500/50 to-transparent mt-2" />}
                  </div>
                  <div className="pb-8">
                    <span className="text-xs text-primary-400 font-mono">{item.year}</span>
                    <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-surface-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding">
          <div className="container-max mx-auto text-center">
            <div className="glass-card p-12">
              <h2 className="text-3xl font-display font-bold text-white mb-4">Ready to Work With Us?</h2>
              <p className="text-surface-400 mb-8 max-w-md mx-auto">Join 150+ businesses who trust TechNova for their technology needs.</p>
              <Link to="/contact" className="btn-primary gap-2 group">
                Get in Touch <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
