import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  HiCode, HiDeviceMobile, HiLightningBolt, HiChartBar,
  HiPresentationChartBar, HiTable, HiDatabase, HiCloud,
  HiColorSwatch, HiPhotograph, HiFilm, HiSpeakerphone,
  HiPencilAlt, HiCube, HiCog, HiBriefcase,
  HiArrowRight, HiStar, HiCheck, HiChat, HiPlay,
  HiShieldCheck, HiClock, HiGlobe, HiUserGroup, HiSparkles,
  HiSearch, HiX, HiChevronRight, HiTrendingUp, HiBadgeCheck, HiShieldExclamation
} from 'react-icons/hi';
import { fetchCategories, fetchServices } from '../../redux/slices/serviceSlice';

const iconMap = {
  HiCode, HiDeviceMobile, HiLightningBolt, HiChartBar,
  HiPresentationChartBar, HiTable, HiDatabase, HiCloud,
  HiColorSwatch, HiPhotograph, HiFilm, HiSpeakerphone,
  HiPencilAlt, HiCube, HiCog, HiBriefcase,
};

const FadeInSection = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const yOffset = direction === 'up' ? 40 : direction === 'down' ? -40 : 0;
  const xOffset = direction === 'left' ? 40 : direction === 'right' ? -40 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset, x: xOffset }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StatCounter = ({ end, suffix = '', label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <div ref={ref} className="text-center group">
      <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-500">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">{count.toLocaleString()}</span>{suffix}
      </div>
      <div className="text-surface-400 font-medium tracking-wide uppercase text-xs">{label}</div>
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const { categories, services } = useSelector((state) => state.services);

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchServices({ featured: true, limit: 6 }));
  }, [dispatch]);

  const steps = [
    { icon: HiSearch, title: 'Discover & Match', desc: 'Browse curated services or let our AI instantly match your specific requirements to top-tier experts.' },
    { icon: HiSparkles, title: 'AI Scoping', desc: 'Our advanced AI Engine generates a complete project scope, timeline, and accurate cost estimate in seconds.' },
    { icon: HiGlobe, title: 'Collaborate', desc: 'Execute flawlessly with real-time tracking, embedded chat, and milestone-based transparent deliveries.' },
    { icon: HiShieldCheck, title: 'Secure Delivery', desc: 'Your funds are held securely until you approve the final, high-quality deliverables.' },
  ];

  const differentiators = [
    { title: 'AI-Powered Estimation', desc: 'Get instant project cost and timeline estimates powered by advanced AI models.', badge: 'AI Native' },
    { title: 'Transparent Pricing', desc: 'Clear Basic/Standard/Premium tiers with absolutely no hidden costs.', badge: 'No Surprises' },
    { title: '16+ Categories', desc: 'One platform for software, AI, design, marketing, cloud, and more.', badge: 'All-in-One' },
    { title: 'Live Tracking', desc: 'Live project updates, milestone tracking, and instant communication.', badge: 'Real-time' },
  ];

  return (
    <>
      <Helmet>
        <title>Velixora Solutions — Premium Technology Services & AI Solutions</title>
        <meta name="description" content="Discover 16+ categories of technology services with transparent pricing, AI-powered estimation, and real-time project tracking." />
      </Helmet>

      <div className="bg-surface-950 overflow-hidden">
        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="relative min-h-[100vh] flex items-center pt-20" id="hero-section">
          {/* Advanced Background Gradients */}
          <div className="absolute inset-0 bg-[#020617]" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900 via-[#020617] to-[#020617]" />
          <div className="absolute inset-0 grid-pattern opacity-10 mix-blend-screen" />

          {/* Animated Orbs */}
          <motion.div style={{ y: y1 }} className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px]" />
          <motion.div style={{ y: y2 }} className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-accent-600/15 rounded-full blur-[150px]" />

          <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-5xl mx-auto text-center flex flex-col items-center">

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-surface-900/80 border border-white/10 backdrop-blur-xl mb-10 shadow-xl shadow-primary-500/10"
              >
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500"></span>
                </div>
                <span className="text-sm font-medium text-surface-200">Velixora AI Engine 2.0 is now live</span>
                <HiChevronRight className="w-4 h-4 text-surface-400" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="text-5xl md:text-7xl lg:text-[84px] font-display font-extrabold text-white leading-[1.1] tracking-tight mb-8"
              >
                Build the future <br className="hidden md:block" />
                <span className="relative inline-block mt-2">
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-300 to-primary-300">
                    faster with AI.
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-4 bg-primary-500/20 blur-xl z-0" />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-surface-300 max-w-2xl text-center leading-relaxed mb-12"
              >
                Instantly connect with world-class experts across Software, AI, Design, and Marketing. Get AI-powered estimates, track progress, and scale your business effortlessly.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
              >
                <Link to="/services" className="w-full sm:w-auto px-8 py-4 bg-white text-surface-950 hover:bg-surface-100 font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] hover:-translate-y-1">
                  Explore Services
                  <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-surface-800/50 hover:bg-surface-800 border border-surface-600/50 hover:border-surface-500 text-white font-semibold rounded-2xl transition-all duration-300 backdrop-blur-xl flex items-center justify-center gap-2">
                  <HiSparkles className="w-5 h-5 text-accent-400" />
                  Try AI Estimator
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            style={{ opacity }}
            className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs text-surface-500 font-medium tracking-widest uppercase">
              Scroll to explore
            </span>

            <div className="w-[1px] h-12 bg-gradient-to-b from-surface-500 to-transparent" />
          </motion.div>
        </section>

        {/* ═══════════════ TRUSTED BY MARQUEE ═══════════════ */}
        <section className="py-12 border-y border-white/5 bg-surface-900/30 overflow-hidden relative backdrop-blur-sm">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface-950 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-surface-950 to-transparent z-10" />

          <div className="flex w-[200%] animate-marquee">
            <div className="flex w-1/2 justify-around items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {['Acme Corp', 'GlobalTech', 'Nexus Systems', 'Quantum AI', 'Nova Labs', 'Stellar Media', 'CloudSync'].map((logo, i) => (
                <div key={i} className="text-xl md:text-2xl font-display font-bold text-surface-300 mx-8 flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-surface-700/50 flex items-center justify-center text-sm">{logo[0]}</div>
                  {logo}
                </div>
              ))}
            </div>
            <div className="flex w-1/2 justify-around items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {['Acme Corp', 'GlobalTech', 'Nexus Systems', 'Quantum AI', 'Nova Labs', 'Stellar Media', 'CloudSync'].map((logo, i) => (
                <div key={`dup-${i}`} className="text-xl md:text-2xl font-display font-bold text-surface-300 mx-8 flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-surface-700/50 flex items-center justify-center text-sm">{logo[0]}</div>
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ PREMIUM BENTO GRID (HOW IT WORKS) ═══════════════ */}
        <section className="py-32 relative">
          <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection className="text-center mb-20 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Excellence</span>
              </h2>
              <p className="text-lg text-surface-400">
                Experience a completely reimagined workflow. Our platform blends human expertise with AI intelligence to deliver perfect results every time.
              </p>
            </FadeInSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Box 1: Large */}
              <FadeInSection delay={0.1} className="md:col-span-2 relative group overflow-hidden rounded-[32px] bg-surface-900 border border-white/10 p-6 md:p-10 h-auto md:h-[320px] transition-all duration-500 hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/10">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-500/20 transition-colors duration-500" />
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-primary-500/20 flex items-center justify-center mb-6 border border-primary-500/30 text-primary-400">
                    <HiSparkles className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">AI-Powered Scoping</h3>
                  <p className="text-surface-400 max-w-sm text-lg leading-relaxed">
                    Say goodbye to endless negotiations. Our AI analyzes your brief and instantly generates precise timelines, technical requirements, and fair pricing.
                  </p>
                </div>
              </FadeInSection>

              {/* Box 2: Tall */}
              <FadeInSection delay={0.2} direction="left" className="md:col-span-1 md:row-span-2 relative group overflow-hidden rounded-[32px] bg-gradient-to-b from-surface-900 to-surface-950 border border-white/10 p-6 md:p-10 h-auto md:h-full transition-all duration-500 hover:border-accent-500/30 hover:shadow-2xl hover:shadow-accent-500/10">
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-accent-500/20 transition-colors duration-500" />
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-accent-500/20 flex items-center justify-center mb-6 border border-accent-500/30 text-accent-400">
                    <HiShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Enterprise Security</h3>
                  <p className="text-surface-400 text-lg leading-relaxed mb-10">
                    Your intellectual property is protected by enterprise-grade NDAs. Payments are securely held in escrow until you approve the final delivery.
                  </p>

                  <div className="mt-auto space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-12 w-full rounded-xl bg-surface-800 border border-white/5 flex items-center px-4 gap-3 relative overflow-hidden group/item">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/item:animate-shimmer" />
                        <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center">
                          <HiCheck className="w-4 h-4 text-accent-400" />
                        </div>
                        <div className="h-2 w-24 bg-surface-600 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInSection>

              {/* Box 3: Small */}
              <FadeInSection delay={0.3} className="md:col-span-1 relative group overflow-hidden rounded-[32px] bg-surface-900 border border-white/10 p-6 md:p-8 h-auto md:h-[280px] transition-all duration-500 hover:border-white/20">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-surface-800 flex items-center justify-center mb-5 border border-white/10 text-white">
                    <HiGlobe className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Vetted Global Talent</h3>
                  <p className="text-surface-400">Only the top 1% of applicants pass our rigorous technical and communication assessments.</p>
                </div>
              </FadeInSection>

              {/* Box 4: Small */}
              <FadeInSection delay={0.4} className="md:col-span-1 relative group overflow-hidden rounded-[32px] bg-surface-900 border border-white/10 p-6 md:p-8 h-auto md:h-[280px] transition-all duration-500 hover:border-white/20">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-surface-800 flex items-center justify-center mb-5 border border-white/10 text-white">
                    <HiTrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Real-time Analytics</h3>
                  <p className="text-surface-400">Monitor project milestones, burn rates, and team velocity directly from your unified dashboard.</p>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* ═══════════════ PREMIUM CATEGORIES SHOWCASE ═══════════════ */}
        <section className="py-24 relative bg-surface-900/50 border-y border-white/5">
          <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <FadeInSection className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                  Explore by <span className="text-surface-500">Expertise</span>
                </h2>
                <p className="text-lg text-surface-400">
                  Over 16 specialized categories meticulously curated to transform your concepts into production-ready realities.
                </p>
              </FadeInSection>
              <FadeInSection delay={0.2} direction="left">
                <Link to="/services" className="inline-flex items-center gap-2 text-primary-400 font-bold hover:text-primary-300 transition-colors text-lg group">
                  View All 16+ Categories
                  <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </FadeInSection>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(categories || []).slice(0, 6).map((cat, i) => {
                const IconComponent = iconMap[cat.icon] || HiCode;
                return (
                  <FadeInSection key={cat._id || i} delay={i * 0.1}>
                    <Link
                      to={`/services?category=${cat.slug}`}
                      className="group block relative overflow-hidden rounded-[24px] bg-surface-900 border border-white/5 p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-surface-800 hover:border-primary-500/30 hover:shadow-[0_20px_40px_-15px_rgba(108,92,231,0.15)]"
                    >
                      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md">
                          <HiArrowRight className="w-5 h-5 text-white -rotate-45" />
                        </div>
                      </div>

                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-surface-800 to-surface-900 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <IconComponent className="w-8 h-8 text-white group-hover:text-primary-400 transition-colors duration-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">{cat.name}</h3>
                      <p className="text-surface-400 leading-relaxed group-hover:text-surface-300 transition-colors">
                        {cat.description || "Discover premium solutions tailored to your unique business requirements."}
                      </p>

                      {cat.subCategories && (
                        <div className="mt-6 flex flex-wrap gap-2">
                          {cat.subCategories.slice(0, 2).map((sub, idx) => (
                            <span key={idx} className="px-3 py-1 text-xs font-medium bg-surface-950 text-surface-400 rounded-lg border border-white/5">
                              {sub}
                            </span>
                          ))}
                          {cat.subCategories.length > 2 && (
                            <span className="px-3 py-1 text-xs font-medium bg-surface-950 text-surface-500 rounded-lg border border-white/5">
                              +{cat.subCategories.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  </FadeInSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════ INTERACTIVE FEATURE TABS ═══════════════ */}
        <section className="py-32 relative overflow-hidden">
          <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-center">

              <div className="w-full lg:w-1/2 space-y-8">
                <FadeInSection>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-8">
                    Why the best teams choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Velixora</span>
                  </h2>
                </FadeInSection>

                <div className="space-y-4">
                  {differentiators.map((item, i) => (
                    <FadeInSection key={i} delay={i * 0.1}>
                      <button
                        onClick={() => setActiveTab(i)}
                        className={`w-full text-left p-6 rounded-[24px] transition-all duration-300 border ${activeTab === i
                          ? 'bg-surface-800 border-primary-500/30 shadow-lg shadow-primary-500/5'
                          : 'bg-transparent border-transparent hover:bg-surface-900 hover:border-white/5'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`text-xl font-bold transition-colors ${activeTab === i ? 'text-white' : 'text-surface-300'}`}>
                            {item.title}
                          </h3>
                          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${activeTab === i ? 'bg-primary-500/20 text-primary-300 border-primary-500/30' : 'bg-surface-800 text-surface-500 border-white/5'
                            }`}>
                            {item.badge}
                          </span>
                        </div>
                        <AnimatePresence>
                          {activeTab === i && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-surface-400 mt-3 leading-relaxed"
                            >
                              {item.desc}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </button>
                    </FadeInSection>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-1/2 relative">
                <FadeInSection direction="left">
                  <div className="aspect-square relative rounded-[40px] border border-white/10 bg-surface-900 overflow-hidden flex items-center justify-center p-12 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5" />

                    {/* Abstract Representation of active tab */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 w-full h-full flex items-center justify-center"
                      >
                        {activeTab === 0 && (
                          <div className="relative w-64 h-64">
                            <div className="absolute inset-0 border-4 border-primary-500/30 rounded-full animate-spin-slow" style={{ animationDuration: '8s' }} />
                            <div className="absolute inset-4 border-4 border-accent-500/30 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '6s' }} />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <HiLightningBolt className="w-24 h-24 text-primary-400" />
                            </div>
                          </div>
                        )}
                        {activeTab === 1 && (
                          <div className="relative w-full max-w-sm space-y-4">
                            {[1, 2, 3].map(n => (
                              <div key={n} className={`h-20 w-full rounded-2xl border ${n === 2 ? 'bg-primary-500/10 border-primary-500/30 scale-105' : 'bg-surface-800 border-white/5'} p-4 flex items-center justify-between transition-all`}>
                                <div className="flex flex-col gap-2">
                                  <div className="w-20 h-3 bg-surface-600 rounded" />
                                  <div className="w-12 h-2 bg-surface-700 rounded" />
                                </div>
                                <div className={`font-display font-bold text-2xl ${n === 2 ? 'text-primary-400' : 'text-surface-500'}`}>$99</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {activeTab === 2 && (
                          <div className="grid grid-cols-3 gap-4 w-full">
                            {[...Array(9)].map((_, n) => (
                              <div key={n} className={`aspect-square rounded-2xl border border-white/5 flex items-center justify-center ${n === 4 ? 'bg-gradient-to-br from-primary-500 to-accent-500 scale-110 shadow-lg shadow-primary-500/20' : 'bg-surface-800'}`}>
                                {n === 4 ? <HiSparkles className="w-8 h-8 text-white" /> : <HiCube className="w-6 h-6 text-surface-600" />}
                              </div>
                            ))}
                          </div>
                        )}
                        {activeTab === 3 && (
                          <div className="w-full relative h-64 border-l-2 border-b-2 border-surface-700">
                            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                              <path d="M 0,100 L 20,80 L 40,85 L 60,40 L 80,45 L 100,10" fill="none" stroke="url(#grad)" strokeWidth="3" />
                              <defs>
                                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#6c5ce7" />
                                  <stop offset="100%" stopColor="#00b894" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute top-[10%] right-0 w-4 h-4 bg-accent-400 rounded-full shadow-[0_0_15px_#00b894] translate-x-1/2 -translate-y-1/2" />
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </FadeInSection>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ GLOBAL STATS ═══════════════ */}
        <section className="py-20 border-y border-white/5 bg-surface-900/50">
          <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
              <StatCounter end={500} suffix="+" label="Enterprise Projects" />
              <StatCounter end={16} suffix="+" label="Service Categories" />
              <StatCounter end={99} suffix="%" label="Client Satisfaction" />
              <StatCounter end={24} suffix="/7" label="Global Support" />
            </div>
          </div>
        </section>

        {/* ═══════════════ ULTIMATE CTA BANNER ═══════════════ */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-surface-950" />
          {/* Huge Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-600/30 via-accent-500/10 to-transparent blur-3xl rounded-full" />

          <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <FadeInSection>
              <div className="w-20 h-20 mx-auto bg-surface-900 rounded-3xl border border-white/10 flex items-center justify-center mb-8 shadow-2xl">
                <HiBriefcase className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight">
                Ready to <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">transform</span> <br className="hidden md:block" /> your ideas?
              </h2>
              <p className="text-xl text-surface-400 max-w-2xl mx-auto mb-12">
                Join hundreds of innovative companies scaling their technology infrastructure with Velixora. Get your AI-powered estimate in minutes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-10 py-5 bg-white text-surface-950 font-bold rounded-2xl hover:bg-surface-100 transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:-translate-y-1"
                >
                  Start Your Project
                  <HiArrowRight className="w-6 h-6" />
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-10 py-5 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/5 transition-all duration-300 flex items-center justify-center"
                >
                  Contact Sales
                </Link>
              </div>
            </FadeInSection>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;
