import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Blog — TechNova Solutions</title>
      </Helmet>
      <div className="min-h-screen pt-24 pb-16 text-center">
        <div className="container-max mx-auto px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-display font-bold text-white mb-4">
            Our <span className="gradient-text">Blog</span>
          </motion.h1>
          <p className="text-surface-400 max-w-2xl mx-auto mb-12">Coming soon. Read our latest insights on technology, design, and business.</p>
        </div>
      </div>
    </>
  );
};

export default Blog;
