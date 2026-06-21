import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

const IndustryLandingPage = () => {
  const { slug } = useParams();
  const [industry, setIndustry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndustry = async () => {
      try {
        const res = await api.get(`/industries/${slug}`);
        setIndustry(res.data.data);
      } catch (err) {
        console.error('Failed to load industry page', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIndustry();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen pt-32 pb-16 text-center text-surface-400">Loading industry profile...</div>;
  }

  if (!industry) {
    return (
      <div className="min-h-screen pt-32 pb-16 text-center">
        <h1 className="text-4xl font-display font-bold text-white mb-4">Industry Not Found</h1>
        <Link to="/" className="text-primary-400 hover:text-primary-300">Return Home</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{industry.seoMeta?.title || `${industry.industryName} Solutions | TechNova`}</title>
        <meta name="description" content={industry.seoMeta?.description || industry.heroText} />
        {industry.seoMeta?.keywords && <meta name="keywords" content={industry.seoMeta.keywords} />}
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative pt-20 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 to-transparent pointer-events-none" />
          <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="badge-primary mb-6 mx-auto">Tailored for {industry.industryName}</div>
              <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white tracking-tight mb-8">
                Transforming the <br /> <span className="gradient-text">{industry.industryName}</span> Industry
              </h1>
              <p className="text-xl text-surface-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                {industry.heroText || `Explore our cutting-edge tech solutions built specifically for the ${industry.industryName} sector.`}
              </p>
              <Link to="/services" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
                Explore Solutions <HiArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-20 bg-surface-900/50">
          <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-display font-bold text-white mb-4">Success Stories in {industry.industryName}</h2>
              <p className="text-surface-400">See how we've helped others in your industry.</p>
            </div>

            {industry.caseStudyRefs?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {industry.caseStudyRefs.map((portfolio) => (
                  <Link key={portfolio._id} to={`/portfolio/${portfolio._id}`} className="group glass-card rounded-2xl overflow-hidden block">
                    <div className="aspect-video bg-surface-800 relative overflow-hidden">
                      {portfolio.coverImage ? (
                        <img src={portfolio.coverImage} alt={portfolio.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-surface-600">No Image</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-950 to-transparent opacity-60" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{portfolio.title}</h3>
                      <p className="text-surface-400 text-sm line-clamp-2">{portfolio.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center p-12 glass-card rounded-2xl border border-white/5">
                <p className="text-surface-400">No case studies published yet for this industry.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default IndustryLandingPage;
