import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useInView } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  HiCode, HiDeviceMobile, HiLightningBolt, HiChartBar,
  HiPresentationChartBar, HiTable, HiDatabase, HiCloud,
  HiColorSwatch, HiPhotograph, HiFilm, HiSpeakerphone,
  HiPencilAlt, HiCube, HiCog, HiBriefcase,
  HiArrowRight, HiStar, HiCheck, HiChat, HiPlay,
  HiShieldCheck, HiClock, HiGlobe, HiUserGroup,
} from 'react-icons/hi';
import { fetchCategories, fetchServices } from '../../redux/slices/serviceSlice';

const iconMap = {
  HiCode, HiDeviceMobile, HiLightningBolt, HiChartBar,
  HiPresentationChartBar, HiTable, HiDatabase, HiCloud,
  HiColorSwatch, HiPhotograph, HiFilm, HiSpeakerphone,
  HiPencilAlt, HiCube, HiCog, HiBriefcase,
};

const FadeInSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
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
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-display font-bold gradient-text mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-surface-400 text-sm">{label}</div>
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, services } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchServices({ featured: true, limit: 6 }));
  }, [dispatch]);

  const steps = [
    { icon: HiPlay, title: 'Browse & Describe', desc: 'Explore 16 service categories or describe your unique requirement' },
    { icon: HiPencilAlt, title: 'Submit Request', desc: 'Fill out a project brief with requirements, timeline, and budget' },
    { icon: HiLightningBolt, title: 'AI-Powered Estimate', desc: 'Receive an instant AI-generated cost and timeline estimate' },
    { icon: HiShieldCheck, title: 'Pay & Track', desc: 'Approve the proposal, pay securely, and track progress in real time' },
    { icon: HiStar, title: 'Deliver & Review', desc: 'Get deliverables, request revisions, and leave your review' },
  ];

  const differentiators = [
    { icon: HiLightningBolt, title: 'AI-Powered Estimation', desc: 'Get instant project cost and timeline estimates powered by advanced AI models' },
    { icon: HiShieldCheck, title: 'Transparent Pricing', desc: 'Clear Basic/Standard/Premium tiers with no hidden costs or surprises' },
    { icon: HiGlobe, title: '16+ Service Categories', desc: 'One platform for software, AI, design, marketing, cloud, and more' },
    { icon: HiClock, title: 'Real-time Tracking', desc: 'Live project updates, milestone tracking, and instant communication' },
    { icon: HiUserGroup, title: 'Dedicated Teams', desc: 'Vetted experts assigned to your project with full accountability' },
    { icon: HiChat, title: 'In-App Communication', desc: 'Chat directly with your team, share files, and get instant responses' },
  ];

  const testimonials = [
    { name: 'Sarah Chen', role: 'CTO, FinStack', text: 'TechNova delivered our AI chatbot 2 weeks ahead of schedule. The quality and communication were exceptional.', rating: 5 },
    { name: 'Raj Patel', role: 'Founder, GrowthOS', text: 'We\'ve used TechNova for 3 projects now — SaaS development, cloud setup, and SEO. They\'re our one-stop tech partner.', rating: 5 },
    { name: 'Emily Rodriguez', role: 'VP Product, DataLens', text: 'The AI-powered estimation feature saved us weeks of back-and-forth. Project tracking dashboard is best-in-class.', rating: 5 },
  ];

  return (
    <>
      <Helmet>
        <title>TechNova Solutions — Your One-Stop Technology Partner</title>
        <meta name="description" content="From AI to Enterprise Software. Discover 16+ categories of technology services with transparent pricing, AI-powered estimation, and real-time project tracking." />
      </Helmet>

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden" id="hero-section">
        {/* Background effects */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-500/15 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm mb-8"
            >
              <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
              Trusted by 500+ businesses worldwide
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
            >
              Your One-Stop{' '}
              <span className="gradient-text">Technology</span>{' '}
              Partner
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-surface-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              From AI & Machine Learning to Software Development, Cloud Infrastructure, and Digital Marketing — discover 16+ service categories with transparent pricing and real-time project tracking.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/services" className="btn-primary text-base gap-2 group" id="hero-explore-btn">
                Explore Services
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="btn-secondary text-base" id="hero-quote-btn">
                Get a Free Quote
              </Link>
            </motion.div>

            {/* Trust Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
            >
              {[
                { value: '500+', label: 'Projects Delivered' },
                { value: '150+', label: 'Happy Clients' },
                { value: '25+', label: 'Countries Served' },
                { value: '4.9/5', label: 'Average Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-display font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-surface-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-950 to-transparent" />
      </section>

      {/* ═══════════════ SERVICE CATEGORIES GRID ═══════════════ */}
      <section className="section-padding relative" id="categories-section">
        <div className="container-max mx-auto">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              16 Service <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-surface-400 max-w-2xl mx-auto">
              Everything your business needs under one roof — from cutting-edge AI solutions to stunning design and strategic marketing.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => {
              const IconComponent = iconMap[cat.icon] || HiCode;
              return (
                <FadeInSection key={cat._id || i} delay={i * 0.05}>
                  <Link
                    to={`/services?category=${cat.slug}`}
                    className="glass-card-hover p-5 group cursor-pointer block"
                    id={`category-card-${cat.slug}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/10 flex items-center justify-center mb-3 group-hover:shadow-glow-primary transition-all duration-500">
                      <IconComponent className="w-6 h-6 text-primary-400 group-hover:text-primary-300 transition-colors" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-primary-300 transition-colors">{cat.name}</h3>
                    <p className="text-xs text-surface-500 line-clamp-2">{cat.subCategories?.slice(0, 3).join(' • ')}</p>
                  </Link>
                </FadeInSection>
              );
            })}
          </div>

          <FadeInSection className="text-center mt-10">
            <Link to="/services" className="btn-secondary gap-2 group">
              View All Services
              <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeInSection>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="section-padding relative overflow-hidden" id="how-it-works-section">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="container-max mx-auto relative z-10">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              From idea to delivery in 5 simple steps — powered by AI for speed and transparency.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="glass-card p-6 text-center relative group hover:border-primary-500/30 transition-all duration-500">
                  {/* Step number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="w-14 h-14 mx-auto rounded-xl bg-primary-500/10 flex items-center justify-center mt-2 mb-4 group-hover:bg-primary-500/20 transition-colors">
                    <step.icon className="w-7 h-7 text-primary-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-surface-400 leading-relaxed">{step.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED SERVICES ═══════════════ */}
      <section className="section-padding" id="featured-section">
        <div className="container-max mx-auto">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Featured <span className="gradient-text">Services</span>
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              Our most popular services — handpicked for startups and businesses ready to scale.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(services || []).slice(0, 6).map((service, i) => (
              <FadeInSection key={service._id || i} delay={i * 0.1}>
                <Link
                  to={`/services/${service._id}`}
                  className="glass-card-hover p-6 flex flex-col h-full group block"
                  id={`featured-service-${i}`}
                >
                  {/* Category badge */}
                  <div className="badge-primary mb-4 self-start">
                    {service.category?.name || 'Service'}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-surface-400 mb-4 flex-1 line-clamp-3">
                    {service.shortDescription || service.description?.substring(0, 120) + '...'}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <HiStar
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(service.avgRating || 5) ? 'text-yellow-400' : 'text-surface-600'}`}
                      />
                    ))}
                    <span className="text-xs text-surface-400 ml-1">
                      {service.avgRating || '5.0'} ({service.totalReviews || 0})
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <span className="text-xs text-surface-500">Starting at</span>
                      <div className="text-xl font-display font-bold text-white">
                        ${service.pricingTiers?.[0]?.price || '99'}
                      </div>
                    </div>
                    <span className="text-primary-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details <HiArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ WHY CHOOSE US ═══════════════ */}
      <section className="section-padding relative" id="why-us-section">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />
        <div className="container-max mx-auto relative z-10">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Why Choose <span className="gradient-text">TechNova</span>
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              We combine agency-quality delivery with marketplace transparency and AI-powered efficiency.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((item, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="glass-card p-6 group hover:border-accent-500/30 transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-4 group-hover:bg-accent-500/20 transition-colors">
                    <item.icon className="w-6 h-6 text-accent-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-surface-400 leading-relaxed">{item.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>

          {/* Stats */}
          <FadeInSection className="mt-16">
            <div className="glass-card p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCounter end={500} suffix="+" label="Projects Completed" />
              <StatCounter end={150} suffix="+" label="Clients Served" />
              <StatCounter end={25} suffix="+" label="Countries" />
              <StatCounter end={49} suffix="/5" label="Average Rating" />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="section-padding" id="testimonials-section">
        <div className="container-max mx-auto">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              What Our Clients <span className="gradient-text">Say</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeInSection key={i} delay={i * 0.15}>
                <div className="glass-card p-6 flex flex-col h-full">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, s) => (
                      <HiStar key={s} className="w-5 h-5 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-surface-300 text-sm leading-relaxed flex-1 mb-6">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-surface-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section className="section-padding" id="cta-section">
        <div className="container-max mx-auto">
          <FadeInSection>
            <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/90 to-accent-600/80" />
              <div className="absolute inset-0 dot-pattern opacity-10" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-400/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/20 rounded-full blur-[100px]" />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
                  Have a project in mind?
                </h2>
                <p className="text-primary-100/80 text-lg mb-8 max-w-xl mx-auto">
                  Let's build it together. Get a free consultation and AI-powered project estimate in minutes.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300 hover:shadow-lg group"
                    id="cta-get-started-btn"
                  >
                    Get Started
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                    id="cta-contact-btn"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  );
};

export default Home;
