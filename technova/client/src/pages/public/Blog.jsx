import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import {
  HiArrowRight, HiClock, HiEye, HiHeart, HiBookmark,
  HiSearch, HiCode, HiLightningBolt, HiCloud,
  HiColorSwatch, HiSpeakerphone, HiShieldCheck,
  HiChartBar, HiCube, HiUser, HiCalendar,
  HiArrowNarrowRight, HiShare, HiChevronLeft, HiChevronRight,
  HiSparkles
} from 'react-icons/hi';
import { blogCategories, categoryColors, categoryBadgeStyles, blogPosts } from '../../data/blogData';

/* ───────────── Shared Components ───────────── */

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

/* ───────────── Premium Blog Components ───────────── */

const FeaturedPostCard = ({ post, index }) => {
  const navigate = useNavigate();
  const gradient = categoryColors[post.category] || 'from-primary-500 to-accent-500';
  const badgeStyle = categoryBadgeStyles[post.category] || 'bg-primary-500/15 text-primary-300 border-primary-500/30';

  // Make the first featured post massive, others smaller
  const isMain = index === 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      onClick={() => navigate(`/blog/${post.id}`)}
      className={`group relative overflow-hidden rounded-[32px] cursor-pointer ${isMain ? 'lg:col-span-2 lg:row-span-2 h-[400px] md:h-[600px]' : 'h-[285px]'}`}
    >
      {/* Dynamic Background Image / Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 transition-opacity duration-500 group-hover:opacity-100`} />
      <div className="absolute inset-0 bg-surface-950/40 mix-blend-multiply" />
      <div className="absolute inset-0 dot-pattern opacity-30 mix-blend-overlay" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 group-hover:bg-white/20 transition-colors duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Content */}
      <div className={`absolute inset-0 p-6 md:p-10 flex flex-col z-10 ${isMain ? 'justify-end' : 'justify-end'}`}>
        <div className="flex items-center gap-3 mb-4">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${badgeStyle}`}>
            {post.category}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-xs font-bold uppercase tracking-wider">
            {post.readTime}
          </span>
        </div>

        <h2 className={`${isMain ? 'text-3xl md:text-5xl mb-4' : 'text-xl md:text-2xl mb-2'} font-display font-extrabold text-white leading-tight group-hover:text-primary-300 transition-colors`}>
          {post.title}
        </h2>

        {isMain && (
          <p className="text-lg text-white/70 mb-6 line-clamp-2 max-w-2xl leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-bold text-white">{post.author.name}</div>
              <div className="text-xs text-white/60">{post.date}</div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-500">
            <HiArrowRight className="w-5 h-5 -rotate-45" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BlogPostCard = ({ post, index }) => {
  const navigate = useNavigate();
  const gradient = categoryColors[post.category] || 'from-primary-500 to-accent-500';
  const badgeStyle = categoryBadgeStyles[post.category] || 'bg-primary-500/15 text-primary-300 border-primary-500/30';

  return (
    <FadeInSection delay={(index % 3) * 0.1}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        onClick={() => navigate(`/blog/${post.id}`)}
        className="group relative h-[420px] rounded-[32px] bg-surface-900 border border-white/5 overflow-hidden cursor-pointer"
      >
        {/* Header Image Area */}
        <div className={`relative h-48 bg-gradient-to-br ${gradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-surface-950/20 mix-blend-multiply" />
          <div className="absolute inset-0 dot-pattern opacity-30 mix-blend-overlay" />
          <div className="absolute inset-0 flex items-center justify-center scale-100 group-hover:scale-110 transition-transform duration-700">
            <HiCube className="w-20 h-20 text-white/10 rotate-12" />
          </div>
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-xs font-bold">
            {post.readTime}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 flex flex-col h-[calc(100%-12rem)] relative z-10 bg-surface-900">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start mb-4 border ${badgeStyle}`}>
            {post.category}
          </span>

          <h3 className="text-xl font-display font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-primary-400 transition-colors">
            {post.title}
          </h3>

          <p className="text-surface-400 text-sm line-clamp-2 leading-relaxed mb-auto">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-6">
            <div className="flex items-center gap-3">
              <div className="text-xs text-surface-500 font-medium">By <span className="text-surface-300">{post.author.name}</span></div>
            </div>
            <div className="flex items-center gap-3 text-xs text-surface-500 font-medium">
              <span className="flex items-center gap-1.5"><HiEye className="w-4 h-4 text-primary-500/70" /> {post.views}</span>
              <span className="flex items-center gap-1.5"><HiHeart className="w-4 h-4 text-accent-500/70" /> {post.likes}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </FadeInSection>
  );
};

/* ───────────── Newsletter Component ───────────── */

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
      <div className="relative overflow-hidden rounded-[40px] bg-surface-900 border border-white/10 p-6 sm:p-10 md:p-16 text-center shadow-2xl">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-600/20 via-accent-500/5 to-transparent rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-30 mix-blend-overlay pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-surface-800 border border-white/10 flex items-center justify-center mb-8 shadow-xl">
          <HiSpeakerphone className="w-10 h-10 text-primary-400" />
        </div>
        <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
          Stay Ahead of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Curve</span>
        </h3>
        <p className="text-lg text-surface-400 mb-10">
          Get elite insights on engineering, AI, design, and scaling businesses delivered straight to your inbox. Join 15,000+ tech leaders.
        </p>

        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 font-bold text-lg"
          >
            <HiShieldCheck className="w-6 h-6" /> You're on the list!
          </motion.div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email..."
              className="flex-1 px-8 py-5 rounded-2xl bg-surface-950 border border-white/10 text-white placeholder:text-surface-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all text-lg"
              required
            />
            <button type="submit" className="px-10 py-5 bg-white text-surface-950 font-bold rounded-2xl hover:bg-surface-100 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:-translate-y-1 whitespace-nowrap text-lg">
              Subscribe Now
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

/* ───────────── Main Blog Page ───────────── */

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  const featuredPosts = blogPosts.filter((p) => p.featured);

  const filteredPosts = blogPosts.filter((post) => {
    const matchCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const regularPosts = filteredPosts.filter((p) => !p.featured);

  return (
    <>
      <Helmet>
        <title>Insights & Engineering Blog — TechNova Solutions</title>
        <meta name="description" content="Elite insights on software engineering, AI, cloud infrastructure, design systems, and scaling startups from industry leaders." />
      </Helmet>

      {/* ═══════════════ PREMIUM HERO ═══════════════ */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-20 bg-[#020617]" id="blog-hero">
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-purple/40 via-[#020617] to-[#020617]" />
        <div className="absolute inset-0 grid-pattern opacity-10 mix-blend-screen" />
        
        <motion.div style={{ y: y1 }} className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px]" />
        <motion.div style={{ y: y2 }} className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-neon-blue/15 rounded-full blur-[150px]" />

        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-surface-900/80 border border-white/10 backdrop-blur-xl mb-8 shadow-xl"
          >
            <HiSparkles className="w-4 h-4 text-neon-purple" />
            <span className="text-sm font-medium text-surface-200">The Engineering & Innovation Publication</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-5xl md:text-7xl lg:text-[84px] font-display font-extrabold text-white leading-[1.1] tracking-tight mb-8"
          >
            Insights that <br className="hidden md:block" />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink">
                shape the future.
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-4 bg-neon-purple/20 blur-xl z-0" />
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl mx-auto mt-12 relative"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center bg-surface-900 border border-white/10 rounded-full p-2 pl-6">
                <HiSearch className="w-6 h-6 text-surface-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, technical guides, case studies..."
                  className="w-full bg-transparent border-none text-white placeholder:text-surface-500 focus:outline-none focus:ring-0 px-4 text-lg"
                />
                <button className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-surface-200 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FLOATING FILTER BAR ═══════════════ */}
      <section className="sticky top-20 z-40 bg-surface-950/80 backdrop-blur-xl border-y border-white/10 py-4 shadow-xl">
        <div className="container-max mx-auto px-4 overflow-x-auto custom-scrollbar pb-2">
          <div className="flex justify-start md:justify-center gap-3 min-w-max">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-white text-surface-950 shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                    : 'bg-surface-800/50 text-surface-400 hover:text-white hover:bg-surface-700 border border-white/5 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED GRID ═══════════════ */}
      {activeCategory === 'All' && searchQuery === '' && (
        <section className="py-24 bg-[#020617]">
          <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
                <HiLightningBolt className="w-6 h-6 text-accent-400" />
                Editor's Picks
              </h2>
            </FadeInSection>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post, i) => (
                <FeaturedPostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ LATEST ARTICLES GRID ═══════════════ */}
      <section className="py-24 bg-surface-950 border-t border-white/5">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <h2 className="text-2xl font-display font-bold text-white mb-8">
              {activeCategory === 'All' && searchQuery === '' ? 'Latest Articles' : 'Search Results'}
            </h2>
          </FadeInSection>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {regularPosts.map((post, i) => (
                <BlogPostCard key={post.id} post={post} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <div className="text-center py-32 glass-card rounded-[40px]">
              <HiSearch className="w-20 h-20 text-surface-700 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">No articles found</h3>
              <p className="text-surface-400 text-lg max-w-md mx-auto">We couldn't find any articles matching your criteria. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ NEWSLETTER ═══════════════ */}
      <section className="py-32 bg-[#020617]">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <NewsletterSignup />
          </FadeInSection>
        </div>
      </section>
    </>
  );
};

export default Blog;
