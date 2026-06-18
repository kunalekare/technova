import { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  HiClock, HiEye, HiHeart, HiBookmark,
  HiShare, HiCube, HiArrowLeft, HiCalendar
} from 'react-icons/hi';
import { blogPosts, categoryColors, categoryBadgeStyles } from '../../data/blogData';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.id === parseInt(id));

  // Scroll animations for parallax
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white">
        <HiCube className="w-20 h-20 text-surface-700 mb-6" />
        <h1 className="text-4xl font-display font-bold mb-4">Article Not Found</h1>
        <p className="text-surface-400 mb-8">The article you're looking for doesn't exist or has been moved.</p>
        <button onClick={() => navigate('/blog')} className="btn-primary">
          Return to Blog
        </button>
      </div>
    );
  }

  const gradient = categoryColors[post.category] || 'from-primary-500 to-accent-500';
  const badgeStyle = categoryBadgeStyles[post.category] || 'bg-primary-500/15 text-primary-300 border-primary-500/30';

  return (
    <>
      <Helmet>
        <title>{post.title} — Velixora Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      {/* ═══════════════ MASSIVE HEADER ═══════════════ */}
      <section className="relative min-h-[60vh] flex flex-col justify-end overflow-hidden pt-32 pb-16 bg-[#020617]">
        {/* Parallax Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 mix-blend-screen`} />
        <div className="absolute inset-0 bg-surface-950/40 mix-blend-multiply" />
        <div className="absolute inset-0 dot-pattern opacity-30 mix-blend-overlay" />
        
        <motion.div style={{ y: y1 }} className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px]" />
        <motion.div style={{ y: y2 }} className="absolute bottom-0 -left-32 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px]" />

        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-surface-400 hover:text-white transition-colors mb-10 font-medium">
            <HiArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`px-4 py-1.5 rounded-full backdrop-blur-md border text-sm font-bold uppercase tracking-wider ${badgeStyle}`}>
                {post.category}
              </span>
              <span className="flex items-center gap-2 text-white/90 text-sm font-bold uppercase tracking-wider bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20">
                <HiClock className="w-4 h-4" /> {post.readTime}
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-3xl md:text-6xl lg:text-7xl font-display font-extrabold text-white leading-[1.1] mb-6 md:mb-8 drop-shadow-2xl"
            >
              {post.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex items-center gap-3 md:gap-4 border-t border-white/10 pt-6 md:pt-8"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-lg md:text-xl font-bold shadow-lg shrink-0">
                {post.author.avatar || post.author.name.charAt(0)}
              </div>
              <div>
                <div className="text-base md:text-lg font-bold text-white">{post.author.name}</div>
                <div className="text-xs md:text-sm text-white/80">{post.author.role} • {post.date}</div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Fade into body */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-950 to-transparent" />
      </section>

      {/* ═══════════════ ARTICLE BODY ═══════════════ */}
      <section className="py-16 bg-surface-950 relative">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto">
            
            {/* Sticky Sidebar Actions */}
            <div className="hidden md:flex flex-col items-center gap-4 sticky top-32 h-fit">
              <button className="w-14 h-14 rounded-full bg-surface-900 border border-white/10 flex items-center justify-center text-surface-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all group shadow-lg">
                <HiHeart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
              <div className="text-sm text-surface-500 font-bold">{post.likes}</div>
              
              <div className="w-8 h-[1px] bg-white/10 my-4" />
              
              <button className="w-14 h-14 rounded-full bg-surface-900 border border-white/10 flex items-center justify-center text-surface-400 hover:text-primary-400 hover:border-primary-500/30 hover:bg-primary-500/10 transition-all group shadow-lg">
                <HiBookmark className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
              
              <button className="w-14 h-14 rounded-full bg-surface-900 border border-white/10 flex items-center justify-center text-surface-400 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all group mt-2 shadow-lg">
                <HiShare className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-4xl">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-12">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-4 py-1.5 rounded-xl bg-surface-900 border border-white/5 text-surface-300 text-sm font-medium hover:border-white/20 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Prose Content */}
              <div className="prose prose-invert md:prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary-400 hover:prose-a:text-primary-300 prose-p:text-surface-300 prose-p:leading-relaxed prose-li:text-surface-300">
                {post.content.split('\n\n').map((paragraph, i) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return <h3 key={i} className="text-2xl md:text-3xl text-white mt-12 md:mt-16 mb-6 md:mb-8">{paragraph.replace(/\*\*/g, '')}</h3>;
                  }
                  if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                    const title = paragraph.match(/\*\*(.*?)\*\*/)?.[1] || '';
                    const rest = paragraph.replace(/\*\*.*?\*\*/, '');
                    return (
                      <div key={i} className="mt-8 md:mt-10 mb-6 bg-surface-900/50 border border-white/5 p-6 md:p-8 rounded-[24px] md:rounded-[32px] shadow-lg">
                        <h3 className="text-xl md:text-2xl text-white mb-3 md:mb-4 !mt-0">{title}</h3>
                        {rest && <p className="!mb-0 text-base md:text-lg">{rest}</p>}
                      </div>
                    );
                  }
                  if (paragraph.match(/^\d+\./)) {
                    const items = paragraph.split('\n').filter(Boolean);
                    return (
                      <ol key={i} className="my-10 space-y-4 bg-surface-900/30 p-6 md:p-10 rounded-[32px] border border-white/5">
                        {items.map((item, j) => <li key={j} className="pl-2 text-lg">{item.replace(/^\d+\.\s*/, '')}</li>)}
                      </ol>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').filter(Boolean);
                    return (
                      <ul key={i} className="my-10 space-y-4">
                        {items.map((item, j) => <li key={j} className="text-lg">{item.replace(/^-\s*/, '')}</li>)}
                      </ul>
                    );
                  }
                  return <p key={i} className="mb-8 text-[1.125rem] leading-[1.8]">{paragraph}</p>;
                })}
              </div>

              {/* Mobile Engagement Footer */}
              <div className="md:hidden mt-16 pt-8 border-t border-white/10 flex items-center justify-between sticky bottom-4 z-50 bg-surface-950/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface-900 border border-white/10 text-surface-300 font-bold hover:text-red-400">
                    <HiHeart className="w-5 h-5 text-red-400" /> {post.likes}
                  </button>
                  <button className="p-3 rounded-2xl bg-surface-900 border border-white/10 text-surface-300 hover:text-primary-400">
                    <HiBookmark className="w-5 h-5" />
                  </button>
                </div>
                <button className="p-3 rounded-2xl bg-surface-900 border border-white/10 text-surface-300 hover:text-white">
                  <HiShare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ READ MORE ═══════════════ */}
      <section className="py-16 md:py-24 bg-[#020617] border-t border-white/5">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8 md:mb-10">More from {post.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts
              .filter(p => p.category === post.category && p.id !== post.id)
              .slice(0, 2)
              .map((relatedPost) => {
                const grad = categoryColors[relatedPost.category] || 'from-primary-500 to-accent-500';
                return (
                  <div key={relatedPost.id} onClick={() => navigate(`/blog/${relatedPost.id}`)} className="group cursor-pointer bg-surface-900 rounded-[32px] overflow-hidden border border-white/5 hover:border-white/10 transition-colors">
                    <div className={`h-40 bg-gradient-to-br ${grad} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                       <HiCube className="w-12 h-12 text-white/20" />
                    </div>
                    <div className="p-6 md:p-8">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">{relatedPost.title}</h3>
                      <p className="text-surface-400 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetail;
