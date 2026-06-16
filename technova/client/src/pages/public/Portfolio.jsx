import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  HiArrowRight, HiX, HiExternalLink, HiStar,
  HiCode, HiDeviceMobile, HiLightningBolt, HiCloud,
  HiColorSwatch, HiSpeakerphone, HiDatabase, HiCube,
  HiChartBar, HiShieldCheck, HiGlobe, HiClock,
  HiCheck, HiUserGroup,
} from 'react-icons/hi';

/* ───────────── Shared Components ───────────── */

const FadeInSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
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
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
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

/* ───────────── Data ───────────── */

const categories = [
  'All',
  'Web Development',
  'Mobile Apps',
  'AI / ML',
  'Cloud & DevOps',
  'UI/UX Design',
  'Digital Marketing',
  'Data Analytics',
  'Cybersecurity',
];

const categoryIcons = {
  'Web Development': HiCode,
  'Mobile Apps': HiDeviceMobile,
  'AI / ML': HiLightningBolt,
  'Cloud & DevOps': HiCloud,
  'UI/UX Design': HiColorSwatch,
  'Digital Marketing': HiSpeakerphone,
  'Data Analytics': HiChartBar,
  'Cybersecurity': HiShieldCheck,
};

const gradientPalettes = [
  'from-primary-600 via-primary-500 to-accent-500',
  'from-neon-purple via-primary-500 to-neon-blue',
  'from-accent-500 via-accent-400 to-neon-cyan',
  'from-neon-blue via-primary-400 to-neon-purple',
  'from-neon-pink via-neon-purple to-primary-500',
  'from-neon-orange via-neon-pink to-primary-500',
  'from-primary-500 via-neon-blue to-neon-cyan',
  'from-accent-400 via-neon-cyan to-neon-blue',
  'from-neon-purple via-neon-pink to-neon-orange',
  'from-neon-blue via-accent-400 to-accent-500',
  'from-primary-600 via-neon-purple to-neon-pink',
  'from-neon-cyan via-accent-500 to-primary-500',
];

const projects = [
  {
    id: 1,
    title: 'FinStack Banking Platform',
    category: 'Web Development',
    client: 'FinStack Inc.',
    description: 'A complete digital banking platform with real-time transaction processing, KYC verification, and multi-currency support serving 200K+ users.',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe API'],
    challenge: 'FinStack needed a scalable, PCI-compliant digital banking platform capable of processing 10,000+ concurrent transactions while maintaining sub-200ms response times.',
    solution: 'We architected a microservices-based platform using event-driven architecture with CQRS pattern. Implemented real-time fraud detection using ML models, multi-currency ledger system, and automated KYC pipeline with identity verification APIs.',
    results: [
      { metric: '200K+', label: 'Active Users' },
      { metric: '99.99%', label: 'Uptime' },
      { metric: '< 150ms', label: 'Avg Response' },
      { metric: '45%', label: 'Cost Reduction' },
    ],
    testimonial: { text: 'TechNova delivered our banking platform 2 weeks ahead of schedule. The quality and communication were exceptional.', author: 'Sarah Chen', role: 'CTO, FinStack' },
    duration: '6 months',
    year: '2024',
  },
  {
    id: 2,
    title: 'MediTrack Health App',
    category: 'Mobile Apps',
    client: 'MediTrack Health',
    description: 'Cross-platform health monitoring app with wearable device integration, appointment scheduling, and AI-powered symptom checker used by 50K+ patients.',
    techStack: ['React Native', 'Firebase', 'TensorFlow Lite', 'HealthKit', 'FHIR API'],
    challenge: 'MediTrack needed an app that could integrate with 15+ wearable devices, provide real-time health monitoring, and comply with HIPAA regulations across iOS and Android.',
    solution: 'Built a unified React Native app with native Bluetooth modules for wearable integration. Implemented on-device ML for real-time anomaly detection, encrypted data sync with HIPAA-compliant cloud infrastructure, and FHIR-standard patient records API.',
    results: [
      { metric: '50K+', label: 'Active Patients' },
      { metric: '4.8/5', label: 'App Store Rating' },
      { metric: '15+', label: 'Device Integrations' },
      { metric: '30%', label: 'Reduced ER Visits' },
    ],
    testimonial: { text: 'The app transformed how our patients manage their health. Wearable integration is flawless.', author: 'Dr. James Wu', role: 'CEO, MediTrack Health' },
    duration: '5 months',
    year: '2024',
  },
  {
    id: 3,
    title: 'InsightAI Analytics Engine',
    category: 'AI / ML',
    client: 'DataLens Corp.',
    description: 'Enterprise AI analytics engine that processes 10M+ data points daily, delivering predictive insights and anomaly detection for Fortune 500 clients.',
    techStack: ['Python', 'PyTorch', 'Apache Spark', 'Kubernetes', 'Elasticsearch'],
    challenge: 'DataLens needed an ML pipeline capable of ingesting and analyzing terabytes of structured and unstructured data daily, with real-time anomaly detection and predictive forecasting accurate to within 5%.',
    solution: 'Designed a distributed ML pipeline using Apache Spark for ETL, custom PyTorch models for time-series forecasting, and real-time streaming anomaly detection. Deployed on auto-scaling Kubernetes clusters with GPU nodes for model inference.',
    results: [
      { metric: '10M+', label: 'Data Points / Day' },
      { metric: '94%', label: 'Prediction Accuracy' },
      { metric: '60%', label: 'Faster Insights' },
      { metric: '3.2x', label: 'ROI in Year 1' },
    ],
    testimonial: { text: 'The AI-powered estimation saved us weeks of back-and-forth. Project tracking dashboard is best-in-class.', author: 'Emily Rodriguez', role: 'VP Product, DataLens' },
    duration: '8 months',
    year: '2024',
  },
  {
    id: 4,
    title: 'CloudScale Infrastructure',
    category: 'Cloud & DevOps',
    client: 'ScaleUp SaaS',
    description: 'Complete cloud migration and DevOps transformation — zero-downtime migration of legacy monolith to cloud-native microservices on AWS.',
    techStack: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'GitHub Actions'],
    challenge: 'ScaleUp was running a legacy monolith on bare metal servers costing $40K/month with frequent outages. They needed a cloud migration with zero downtime and immediate cost savings.',
    solution: 'Executed a phased strangler fig migration, decomposing the monolith into 12 microservices. Built IaC with Terraform, CI/CD pipelines with GitHub Actions, and comprehensive observability with Prometheus and Grafana.',
    results: [
      { metric: '0 min', label: 'Downtime During Migration' },
      { metric: '65%', label: 'Infrastructure Cost Savings' },
      { metric: '10x', label: 'Deployment Frequency' },
      { metric: '99.99%', label: 'Uptime SLA Met' },
    ],
    testimonial: { text: 'Our infrastructure costs dropped by 65% and we now deploy 10x more frequently. TechNova made cloud migration painless.', author: 'Marcus Lee', role: 'CTO, ScaleUp SaaS' },
    duration: '4 months',
    year: '2023',
  },
  {
    id: 5,
    title: 'Luxe Brand Experience',
    category: 'UI/UX Design',
    client: 'Luxe Retail Group',
    description: 'Award-winning e-commerce redesign with immersive 3D product visualizations, personalized shopping experience, and accessibility-first design.',
    techStack: ['Figma', 'Three.js', 'Next.js', 'Framer Motion', 'WCAG 2.1'],
    challenge: 'Luxe\'s existing website had a 78% bounce rate and poor mobile conversion. They needed a premium digital experience matching their luxury brand identity while achieving WCAG 2.1 AA compliance.',
    solution: 'Conducted extensive user research and designed a mobile-first luxury experience with interactive 3D product viewers, personalized recommendations, micro-animations for engagement, and full accessibility compliance.',
    results: [
      { metric: '156%', label: 'Conversion Increase' },
      { metric: '-52%', label: 'Bounce Rate' },
      { metric: '4.9/5', label: 'User Satisfaction' },
      { metric: 'AA', label: 'WCAG Compliance' },
    ],
    testimonial: { text: 'Our customers say the shopping experience now feels as premium as our products. Conversions doubled.', author: 'Isabella Marquez', role: 'CMO, Luxe Retail' },
    duration: '3 months',
    year: '2024',
  },
  {
    id: 6,
    title: 'GrowthOS Marketing Suite',
    category: 'Digital Marketing',
    client: 'GrowthOS',
    description: 'Full-stack digital marketing platform with SEO automation, content pipeline, social media management, and AI-powered ad optimization.',
    techStack: ['Next.js', 'OpenAI API', 'Google Ads API', 'Meta API', 'Mixpanel'],
    challenge: 'GrowthOS was managing marketing for 50+ clients across 8 channels using disconnected tools. They needed a unified platform with AI-driven optimization and automated reporting.',
    solution: 'Built a centralized marketing command center with AI-powered content generation, automated SEO auditing, cross-channel ad bidding optimization, and real-time dashboards. Integrated with Google, Meta, LinkedIn, and TikTok Ads APIs.',
    results: [
      { metric: '340%', label: 'Organic Traffic Growth' },
      { metric: '28%', label: 'Lower CPA' },
      { metric: '50+', label: 'Clients Managed' },
      { metric: '12hrs', label: 'Saved Weekly / Client' },
    ],
    testimonial: { text: 'We\'ve used TechNova for 3 projects now — SaaS development, cloud setup, and SEO. They\'re our one-stop tech partner.', author: 'Raj Patel', role: 'Founder, GrowthOS' },
    duration: '5 months',
    year: '2023',
  },
  {
    id: 7,
    title: 'QuantumLeap Trading Platform',
    category: 'Web Development',
    client: 'QuantumLeap Finance',
    description: 'High-frequency trading dashboard with real-time WebSocket data feeds, advanced charting, and algorithmic trading strategy builder.',
    techStack: ['React', 'WebSocket', 'D3.js', 'Go', 'TimescaleDB'],
    challenge: 'QuantumLeap needed a trading platform capable of rendering 50,000+ real-time price updates per second with sub-10ms latency, while supporting complex charting and strategy backtesting.',
    solution: 'Engineered a Go-based WebSocket gateway for ultra-low-latency data delivery, custom D3.js charting engine with canvas rendering for performance, and a visual strategy builder with backtesting against 10+ years of historical data.',
    results: [
      { metric: '< 8ms', label: 'Data Latency' },
      { metric: '50K+', label: 'Updates / Second' },
      { metric: '5K+', label: 'Active Traders' },
      { metric: '99.97%', label: 'Uptime' },
    ],
    testimonial: { text: 'The performance is incredible. Our traders can\'t believe how fast and smooth the platform is.', author: 'David Kim', role: 'Head of Product, QuantumLeap' },
    duration: '7 months',
    year: '2024',
  },
  {
    id: 8,
    title: 'EduVerse Learning Platform',
    category: 'Mobile Apps',
    client: 'EduVerse',
    description: 'Gamified mobile learning platform with adaptive AI curriculum, live video classrooms, and offline content sync for emerging markets.',
    techStack: ['Flutter', 'Node.js', 'MongoDB', 'WebRTC', 'TensorFlow'],
    challenge: 'EduVerse needed a learning app that works in low-bandwidth regions, supports offline access, and adapts curriculum difficulty in real-time based on student performance.',
    solution: 'Built a Flutter app with intelligent offline sync, compressed video streaming for low bandwidth, adaptive learning algorithm using TensorFlow, and a gamification system with streaks, badges, and leaderboards to boost retention.',
    results: [
      { metric: '120K+', label: 'Students' },
      { metric: '85%', label: 'Completion Rate' },
      { metric: '4.9/5', label: 'Play Store Rating' },
      { metric: '40%', label: 'Better Test Scores' },
    ],
    testimonial: { text: 'Student engagement is through the roof. The offline mode was a game-changer for our rural users.', author: 'Priya Sharma', role: 'Co-founder, EduVerse' },
    duration: '6 months',
    year: '2023',
  },
  {
    id: 9,
    title: 'SecureVault Enterprise',
    category: 'Cybersecurity',
    client: 'VaultTech Systems',
    description: 'Enterprise-grade cybersecurity platform with real-time threat detection, automated incident response, and compliance management for SOC 2 / ISO 27001.',
    techStack: ['Python', 'Elasticsearch', 'Kafka', 'React', 'YARA Rules'],
    challenge: 'VaultTech needed to monitor 10,000+ endpoints across 50+ enterprise clients, detect threats in real-time, and automate incident response workflows while maintaining SOC 2 Type II compliance.',
    solution: 'Architected a SIEM platform with Kafka-based real-time event streaming, custom YARA rules engine for threat detection, ML-based anomaly scoring, automated playbook execution for incident response, and compliance report generation.',
    results: [
      { metric: '10K+', label: 'Endpoints Monitored' },
      { metric: '< 30s', label: 'Threat Detection Time' },
      { metric: '97%', label: 'Threats Auto-Resolved' },
      { metric: 'SOC 2', label: 'Compliance Achieved' },
    ],
    testimonial: { text: 'Our mean time to detect dropped from hours to seconds. The automated response playbooks are brilliant.', author: 'Alex Novak', role: 'CISO, VaultTech Systems' },
    duration: '9 months',
    year: '2024',
  },
  {
    id: 10,
    title: 'RetailIQ Analytics',
    category: 'Data Analytics',
    client: 'RetailIQ',
    description: 'Real-time retail analytics platform with demand forecasting, inventory optimization, and customer behavior analysis across 500+ store locations.',
    techStack: ['Python', 'Apache Airflow', 'Snowflake', 'Tableau', 'scikit-learn'],
    challenge: 'RetailIQ managed 500+ stores with siloed data systems, leading to $2M+ in annual losses from overstock and stockouts. They needed unified analytics with predictive demand forecasting.',
    solution: 'Built an end-to-end data pipeline using Apache Airflow for orchestration, Snowflake as the data warehouse, ML-based demand forecasting models, and interactive Tableau dashboards for store managers with drill-down capabilities.',
    results: [
      { metric: '500+', label: 'Stores Connected' },
      { metric: '$2.1M', label: 'Annual Savings' },
      { metric: '92%', label: 'Forecast Accuracy' },
      { metric: '35%', label: 'Less Overstock' },
    ],
    testimonial: { text: 'We finally have a single source of truth. The demand forecasting has virtually eliminated our overstock problems.', author: 'Lisa Chen', role: 'VP Operations, RetailIQ' },
    duration: '4 months',
    year: '2023',
  },
  {
    id: 11,
    title: 'NexGen SaaS Platform',
    category: 'Cloud & DevOps',
    client: 'NexGen Solutions',
    description: 'Multi-tenant SaaS platform with auto-scaling infrastructure, feature flag management, and blue-green deployment pipeline serving enterprise clients.',
    techStack: ['AWS ECS', 'Terraform', 'ArgoCD', 'Datadog', 'LaunchDarkly'],
    challenge: 'NexGen needed to transform their single-tenant architecture into a multi-tenant SaaS platform capable of onboarding enterprise clients with custom configurations, while maintaining data isolation and sub-second deployments.',
    solution: 'Designed a multi-tenant architecture with namespace-based isolation on ECS, implemented feature flags for per-tenant customization, built blue-green deployment pipelines with ArgoCD, and comprehensive observability with Datadog.',
    results: [
      { metric: '200+', label: 'Enterprise Tenants' },
      { metric: '< 45s', label: 'Deployment Time' },
      { metric: '99.99%', label: 'Uptime' },
      { metric: '80%', label: 'Faster Onboarding' },
    ],
    testimonial: { text: 'Going from single-tenant to multi-tenant seemed impossible. TechNova made it look easy.', author: 'Jordan Blake', role: 'CEO, NexGen Solutions' },
    duration: '6 months',
    year: '2024',
  },
  {
    id: 12,
    title: 'Artisan E-Commerce',
    category: 'UI/UX Design',
    client: 'Artisan Collective',
    description: 'Bespoke e-commerce experience for handcrafted goods with AR product preview, storytelling-driven product pages, and seamless checkout flow.',
    techStack: ['Figma', 'Next.js', 'Shopify API', 'AR.js', 'Lottie'],
    challenge: 'Artisan Collective needed an online store that conveyed the craftsmanship behind each product. Their existing Shopify theme had a 3% conversion rate and failed to differentiate them from mass-market competitors.',
    solution: 'Designed a storytelling-first e-commerce experience with artisan video profiles, AR-powered "view in your space" product preview, narrative product pages with process photography, and a frictionless one-page checkout.',
    results: [
      { metric: '210%', label: 'Revenue Increase' },
      { metric: '8.2%', label: 'Conversion Rate' },
      { metric: '4.5min', label: 'Avg. Session Duration' },
      { metric: '-40%', label: 'Cart Abandonment' },
    ],
    testimonial: { text: 'Our website now tells the story behind every product. Customers feel connected to the artisans.', author: 'Maya Johnson', role: 'Founder, Artisan Collective' },
    duration: '3 months',
    year: '2023',
  },
];

/* ───────────── Project Card ───────────── */

const ProjectCard = ({ project, index, onClick }) => {
  const gradient = gradientPalettes[index % gradientPalettes.length];
  const IconComponent = categoryIcons[project.category] || HiCube;

  return (
    <FadeInSection delay={index * 0.08}>
      <motion.div
        layoutId={`project-card-${project.id}`}
        onClick={() => onClick(project)}
        className="glass-card-hover cursor-pointer group flex flex-col h-full overflow-hidden"
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        id={`portfolio-project-${project.id}`}
      >
        {/* Thumbnail */}
        <div className={`relative h-48 bg-gradient-to-br ${gradient} overflow-hidden`}>
          <div className="absolute inset-0 dot-pattern opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <IconComponent className="w-16 h-16 text-white/30" />
          </div>
          {/* Year badge */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-white text-xs font-semibold">
            {project.year}
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-surface-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl text-white text-sm font-semibold border border-white/20">
              View Case Study <HiExternalLink className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          {/* Category */}
          <div className="badge-primary mb-3 self-start">
            {project.category}
          </div>

          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors">
            {project.title}
          </h3>

          <p className="text-sm text-surface-400 mb-4 flex-1 line-clamp-2">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 3).map((tech) => (
              <span key={tech} className="px-2 py-0.5 rounded-md bg-surface-800/80 text-surface-300 text-xs border border-surface-700/50">
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="px-2 py-0.5 rounded-md bg-surface-800/80 text-surface-500 text-xs border border-surface-700/50">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-xs text-surface-500">{project.client}</span>
            <span className="text-primary-400 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Details <HiArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </motion.div>
    </FadeInSection>
  );
};

/* ───────────── Case Study Modal ───────────── */

const CaseStudyModal = ({ project, onClose }) => {
  if (!project) return null;

  const gradient = gradientPalettes[(project.id - 1) % gradientPalettes.length];
  const IconComponent = categoryIcons[project.category] || HiCube;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 pb-8 overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-surface-950/80 backdrop-blur-md" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-4xl glass-card overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        id="portfolio-case-study-modal"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/30 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/50 transition-all"
          id="case-study-close-btn"
        >
          <HiX className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className={`relative h-56 md:h-64 bg-gradient-to-br ${gradient} overflow-hidden`}>
          <div className="absolute inset-0 dot-pattern opacity-15" />
          <div className="absolute inset-0 flex items-center justify-center">
            <IconComponent className="w-24 h-24 text-white/20" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-surface-950/90 to-transparent h-24" />
          <div className="absolute bottom-6 left-8 right-8">
            <div className="badge-primary mb-2">{project.category}</div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">{project.title}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Meta row */}
          <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-white/10">
            <div>
              <div className="text-xs text-surface-500 mb-1">Client</div>
              <div className="text-sm font-semibold text-white">{project.client}</div>
            </div>
            <div>
              <div className="text-xs text-surface-500 mb-1">Duration</div>
              <div className="text-sm font-semibold text-white">{project.duration}</div>
            </div>
            <div>
              <div className="text-xs text-surface-500 mb-1">Year</div>
              <div className="text-sm font-semibold text-white">{project.year}</div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="text-xs text-surface-500 mb-1">Tech Stack</div>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded-md bg-surface-800 text-surface-300 text-xs border border-surface-700/50">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Challenge / Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-accent-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <HiLightningBolt className="w-4 h-4" /> The Challenge
              </h3>
              <p className="text-sm text-surface-300 leading-relaxed">{project.challenge}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <HiCheck className="w-4 h-4" /> Our Solution
              </h3>
              <p className="text-sm text-surface-300 leading-relaxed">{project.solution}</p>
            </div>
          </div>

          {/* Results */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <HiChartBar className="w-4 h-4 text-accent-400" /> Key Results
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.results.map((r, i) => (
                <div key={i} className="glass-card p-4 text-center">
                  <div className="text-2xl font-display font-bold gradient-text mb-1">{r.metric}</div>
                  <div className="text-xs text-surface-400">{r.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          {project.testimonial && (
            <div className="glass-card p-6 border-l-4 border-primary-500">
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <HiStar key={s} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-surface-300 italic leading-relaxed mb-4">
                "{project.testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                  {project.testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{project.testimonial.author}</div>
                  <div className="text-xs text-surface-400">{project.testimonial.role}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ───────────── Main Portfolio Page ───────────── */

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  return (
    <>
      <Helmet>
        <title>Portfolio — TechNova Solutions</title>
        <meta name="description" content="Explore TechNova's portfolio of 500+ successful projects across web development, mobile apps, AI/ML, cloud infrastructure, UI/UX design, and digital marketing." />
      </Helmet>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden" id="portfolio-hero">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent-500/15 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-sm mb-8"
            >
              <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
              500+ projects delivered across 25+ countries
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-tight mb-6"
            >
              Our <span className="gradient-text">Portfolio</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-surface-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Real projects. Real results. Explore how we've helped startups and enterprises
              transform their ideas into world-class digital products.
            </motion.p>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
            >
              {[
                { value: '500+', label: 'Projects Delivered' },
                { value: '150+', label: 'Happy Clients' },
                { value: '98%', label: 'Client Satisfaction' },
                { value: '16+', label: 'Service Categories' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-display font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-surface-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-950 to-transparent" />
      </section>

      {/* ═══════════════ FILTER BAR ═══════════════ */}
      <section className="section-padding !pt-8 !pb-0" id="portfolio-filters">
        <div className="container-max mx-auto">
          <FadeInSection>
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                    activeCategory === cat
                      ? 'bg-primary-500/20 border-primary-500/40 text-primary-300 shadow-glow-primary'
                      : 'bg-white/5 border-white/10 text-surface-400 hover:text-white hover:border-white/20 hover:bg-white/10'
                  }`}
                  id={`portfolio-filter-${cat.replace(/[\s/]+/g, '-').toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══════════════ PROJECT GRID ═══════════════ */}
      <section className="section-padding !pt-0" id="portfolio-grid">
        <div className="container-max mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onClick={setSelectedProject}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <HiCube className="w-16 h-16 text-surface-600 mx-auto mb-4" />
              <p className="text-surface-400 text-lg">No projects found in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ RESULTS STATS ═══════════════ */}
      <section className="section-padding relative" id="portfolio-stats">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />
        <div className="container-max mx-auto relative z-10">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Proven <span className="gradient-text">Results</span>
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              Numbers don't lie. Here's the impact we've delivered across all our projects.
            </p>
          </FadeInSection>

          <FadeInSection>
            <div className="glass-card p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCounter end={500} suffix="+" label="Projects Delivered" />
              <StatCounter end={98} suffix="%" label="Client Satisfaction" />
              <StatCounter end={25} suffix="+" label="Countries Served" />
              <StatCounter end={99} suffix=".9%" label="Avg Uptime Delivered" />
            </div>
          </FadeInSection>

          {/* Trust badges */}
          <FadeInSection className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: HiShieldCheck, title: 'Enterprise-Grade Security', desc: 'SOC 2, ISO 27001, and HIPAA-compliant development practices for every project.' },
                { icon: HiGlobe, title: 'Global Delivery', desc: 'Distributed teams across 5 time zones ensuring round-the-clock progress on your project.' },
                { icon: HiClock, title: 'On-Time Guarantee', desc: '95% of our projects are delivered on or ahead of schedule with transparent milestone tracking.' },
              ].map((item, i) => (
                <div key={i} className="glass-card p-6 group hover:border-accent-500/30 transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-4 group-hover:bg-accent-500/20 transition-colors">
                    <item.icon className="w-6 h-6 text-accent-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-surface-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="section-padding" id="portfolio-testimonials">
        <div className="container-max mx-auto">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Client <span className="gradient-text">Testimonials</span>
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              Hear directly from the founders and executives who trusted us with their vision.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: 'TechNova delivered our banking platform 2 weeks ahead of schedule. The quality and communication were exceptional.', author: 'Sarah Chen', role: 'CTO, FinStack Inc.', rating: 5 },
              { text: 'We\'ve used TechNova for 3 projects now — SaaS development, cloud setup, and SEO. They\'re our one-stop tech partner.', author: 'Raj Patel', role: 'Founder, GrowthOS', rating: 5 },
              { text: 'Our infrastructure costs dropped by 65% and we now deploy 10x more frequently. TechNova made cloud migration painless.', author: 'Marcus Lee', role: 'CTO, ScaleUp SaaS', rating: 5 },
            ].map((t, i) => (
              <FadeInSection key={i} delay={i * 0.15}>
                <div className="glass-card p-6 flex flex-col h-full">
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
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.author}</div>
                      <div className="text-xs text-surface-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ INDUSTRIES ═══════════════ */}
      <section className="section-padding relative overflow-hidden" id="portfolio-industries">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="container-max mx-auto relative z-10">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Industries We <span className="gradient-text">Serve</span>
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              Deep domain expertise across verticals that matter.
            </p>
          </FadeInSection>

          <FadeInSection>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'FinTech & Banking', 'Healthcare & MedTech', 'E-Commerce & Retail',
                'EdTech & Learning', 'SaaS & Enterprise', 'Real Estate & PropTech',
                'Logistics & Supply Chain', 'Media & Entertainment', 'Travel & Hospitality',
                'Legal & Compliance', 'Agriculture & AgriTech', 'Energy & CleanTech',
              ].map((industry) => (
                <span
                  key={industry}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-surface-300 text-sm font-medium hover:border-primary-500/30 hover:text-primary-300 hover:bg-primary-500/5 transition-all duration-300 cursor-default"
                >
                  {industry}
                </span>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section className="section-padding" id="portfolio-cta">
        <div className="container-max mx-auto">
          <FadeInSection>
            <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/90 to-accent-600/80" />
              <div className="absolute inset-0 dot-pattern opacity-10" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-400/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/20 rounded-full blur-[100px]" />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
                  Ready to build something amazing?
                </h2>
                <p className="text-primary-100/80 text-lg mb-8 max-w-xl mx-auto">
                  Let's add your success story to our portfolio. Get a free consultation and AI-powered project estimate.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300 hover:shadow-lg group"
                    id="portfolio-cta-start-btn"
                  >
                    Start Your Project
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                    id="portfolio-cta-services-btn"
                  >
                    Explore Services
                  </Link>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══════════════ CASE STUDY MODAL ═══════════════ */}
      <AnimatePresence>
        {selectedProject && (
          <CaseStudyModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Portfolio;
