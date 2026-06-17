import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import {
  HiArrowRight, HiX, HiExternalLink, HiStar,
  HiCode, HiDeviceMobile, HiLightningBolt, HiCloud,
  HiColorSwatch, HiSpeakerphone, HiDatabase, HiCube,
  HiChartBar, HiShieldCheck, HiGlobe, HiClock,
  HiCheck, HiUserGroup, HiSparkles, HiBriefcase
} from 'react-icons/hi';

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
    <div ref={ref} className="text-center group">
      <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-500">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">{count.toLocaleString()}</span>{suffix}
      </div>
      <div className="text-surface-400 font-medium tracking-wide uppercase text-xs">{label}</div>
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

/* ───────────── Premium Project Card ───────────── */

const ProjectCard = ({ project, index, onClick }) => {
  const gradient = gradientPalettes[index % gradientPalettes.length];
  const IconComponent = categoryIcons[project.category] || HiCube;

  return (
    <FadeInSection delay={(index % 3) * 0.1}>
      <motion.div
        layoutId={`project-card-${project.id}`}
        onClick={() => onClick(project)}
        className="group relative h-[480px] rounded-[32px] overflow-hidden cursor-pointer"
        whileHover={{ y: -10 }}
        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        {/* Background Gradient & Texture */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 transition-opacity duration-500 group-hover:opacity-100`} />
        <div className="absolute inset-0 bg-surface-950/40 mix-blend-multiply" />
        <div className="absolute inset-0 dot-pattern opacity-30 mix-blend-overlay" />
        
        {/* Animated Abstract Shapes */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2 group-hover:bg-white/20 transition-colors duration-500" />

        {/* Content Container */}
        <div className="absolute inset-0 p-8 flex flex-col z-10">
          
          {/* Top Header */}
          <div className="flex items-start justify-between">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
              <IconComponent className="w-7 h-7 text-white" />
            </div>
            <div className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-xs font-bold uppercase tracking-wider">
              {project.year}
            </div>
          </div>

          <div className="mt-auto">
            <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold">
              {project.category}
            </div>
            <h3 className="text-3xl font-display font-bold text-white mb-3 leading-tight group-hover:translate-x-2 transition-transform duration-500">
              {project.title}
            </h3>
            <p className="text-white/70 line-clamp-2 mb-6 group-hover:translate-x-2 transition-transform duration-500 delay-75">
              {project.description}
            </p>
            
            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2 mb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
              {project.techStack.slice(0, 3).map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium">
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/50 text-xs font-medium">
                  +{project.techStack.length - 3}
                </span>
              )}
            </div>

            {/* View Case Study Button */}
            <div className="flex items-center gap-2 text-white font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-150">
              View Case Study <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      </motion.div>
    </FadeInSection>
  );
};

/* ───────────── Premium Case Study Modal ───────────── */

const CaseStudyModal = ({ project, onClose }) => {
  if (!project) return null;

  const gradient = gradientPalettes[(project.id - 1) % gradientPalettes.length];
  const IconComponent = categoryIcons[project.category] || HiCube;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      {/* Heavy Blur Backdrop */}
      <div className="fixed inset-0 bg-surface-950/80 backdrop-blur-xl" />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative w-full max-w-5xl bg-surface-900 rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors shadow-2xl"
        >
          <HiX className="w-6 h-6" />
        </button>

        <div className="overflow-y-auto custom-scrollbar">
          {/* Stunning Header */}
          <div className={`relative min-h-[40vh] bg-gradient-to-br ${gradient} flex items-end p-6 md:p-16`}>
            <div className="absolute inset-0 bg-surface-950/20 mix-blend-multiply" />
            <div className="absolute inset-0 dot-pattern opacity-20 mix-blend-overlay" />
            
            {/* Big Background Icon */}
            <IconComponent className="absolute -right-10 -bottom-10 w-96 h-96 text-white/10 mix-blend-overlay rotate-12 pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold tracking-wide">
                  {project.category}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-sm font-bold tracking-wide">
                  {project.year}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white leading-tight mb-4 drop-shadow-2xl">
                {project.title}
              </h2>
              <p className="text-xl text-white/90 font-medium max-w-2xl">
                {project.client}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-900 to-transparent" />
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-16 bg-surface-900">
            
            {/* Bento Grid layout for details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              
              {/* Challenge & Solution (2/3 width) */}
              <div className="md:col-span-2 space-y-8">
                <div className="bg-surface-800/50 rounded-[32px] p-6 md:p-8 border border-white/5">
                  <h3 className="text-lg font-bold text-white flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                      <HiLightningBolt className="w-5 h-5" />
                    </div>
                    The Challenge
                  </h3>
                  <p className="text-surface-300 text-lg leading-relaxed">
                    {project.challenge}
                  </p>
                </div>
                
                <div className="bg-surface-800/50 rounded-[32px] p-6 md:p-8 border border-white/5 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${gradient} opacity-5 blur-3xl`} />
                  <h3 className="text-lg font-bold text-white flex items-center gap-3 mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-400">
                      <HiCheck className="w-5 h-5" />
                    </div>
                    The Solution
                  </h3>
                  <p className="text-surface-300 text-lg leading-relaxed relative z-10">
                    {project.solution}
                  </p>
                </div>
              </div>

              {/* Tech Stack & Meta (1/3 width) */}
              <div className="space-y-6">
                <div className="bg-surface-800/50 rounded-[32px] p-6 md:p-8 border border-white/5 h-full">
                  <h3 className="text-sm font-bold text-surface-400 uppercase tracking-wider mb-6">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2 mb-10">
                    {project.techStack.map(tech => (
                      <span key={tech} className="px-4 py-2 rounded-xl bg-surface-950 border border-white/5 text-surface-200 text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-sm font-bold text-surface-400 uppercase tracking-wider mb-2">Duration</h3>
                  <p className="text-white font-semibold text-lg mb-8">{project.duration}</p>

                  <h3 className="text-sm font-bold text-surface-400 uppercase tracking-wider mb-2">Live URL</h3>
                  <a href="#" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-bold transition-colors">
                    Visit Project <HiExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Key Results Section */}
            <div className="mb-16">
              <h3 className="text-2xl font-display font-bold text-white mb-8 text-center">Business Impact</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {project.results.map((r, i) => (
                  <div key={i} className={`bg-gradient-to-br ${gradient} p-[1px] rounded-[24px]`}>
                    <div className="bg-surface-900 h-full rounded-[23px] p-6 text-center flex flex-col justify-center items-center">
                      <div className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{r.metric}</div>
                      <div className="text-sm text-surface-400 font-medium uppercase tracking-wider">{r.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            {project.testimonial && (
              <div className="bg-gradient-to-r from-surface-800 to-surface-800/50 rounded-[32px] p-6 md:p-10 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <HiChartBar className="w-32 h-32 text-surface-700/30" />
                </div>
                <div className="relative z-10">
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <HiStar key={s} className="w-6 h-6 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8 max-w-3xl">
                    "{project.testimonial.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                      {project.testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">{project.testimonial.author}</div>
                      <div className="text-surface-400">{project.testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ───────────── Main Portfolio Page ───────────── */

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  useEffect(() => {
    if (selectedProject) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  return (
    <>
      <Helmet>
        <title>Portfolio — TechNova Solutions</title>
        <meta name="description" content="Explore TechNova's portfolio of 500+ successful projects across web development, mobile apps, AI/ML, cloud infrastructure, UI/UX design, and digital marketing." />
      </Helmet>

      {/* ═══════════════ PREMIUM HERO ═══════════════ */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-20" id="portfolio-hero">
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900 via-[#020617] to-[#020617]" />
        <div className="absolute inset-0 grid-pattern opacity-10 mix-blend-screen" />
        
        <motion.div style={{ y: y1 }} className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px]" />
        <motion.div style={{ y: y2 }} className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-accent-600/15 rounded-full blur-[150px]" />

        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-surface-900/80 border border-white/10 backdrop-blur-xl mb-8 shadow-xl shadow-primary-500/10"
          >
            <HiSparkles className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-medium text-surface-200">Award-Winning Digital Products</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-5xl md:text-7xl lg:text-[84px] font-display font-extrabold text-white leading-[1.1] tracking-tight mb-8"
          >
            Work that <br className="hidden md:block" />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-300 to-primary-300">
                redefines industry.
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-4 bg-primary-500/20 blur-xl z-0" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-surface-300 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Real projects. Real results. Explore how we've helped startups and enterprises transform their ideas into world-class digital products that dominate markets.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════ FLOATING FILTER BAR ═══════════════ */}
      <section className="sticky top-20 z-40 bg-surface-950/80 backdrop-blur-xl border-y border-white/10 py-4 shadow-xl" id="portfolio-filters">
        <div className="container-max mx-auto px-4 overflow-x-auto custom-scrollbar pb-2">
          <div className="flex justify-start md:justify-center gap-3 min-w-max">
            {categories.map((cat) => (
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

      {/* ═══════════════ BENTO PROJECT GRID ═══════════════ */}
      <section className="py-24 bg-[#020617]" id="portfolio-grid">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
            <div className="text-center py-32 glass-card rounded-[40px]">
              <HiCube className="w-20 h-20 text-surface-700 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">No projects found</h3>
              <p className="text-surface-400 text-lg max-w-md mx-auto">We don't have any public case studies in this category yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ IMPACT STATS ═══════════════ */}
      <section className="py-24 relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-surface-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-600/10 via-transparent to-transparent rounded-full pointer-events-none" />
        
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter end={500} suffix="+" label="Projects Delivered" />
            <StatCounter end={98} suffix="%" label="Client Satisfaction" />
            <StatCounter end={25} suffix="+" label="Countries Served" />
            <StatCounter end={99} suffix=".9%" label="Avg Uptime Delivered" />
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-32 relative overflow-hidden bg-surface-900 border-b border-white/5">
        <div className="absolute inset-0 grid-pattern opacity-30 mix-blend-overlay" />
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeInSection>
            <div className="w-20 h-20 mx-auto bg-primary-500/10 rounded-3xl border border-primary-500/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(108,92,231,0.2)]">
              <HiBriefcase className="w-10 h-10 text-primary-400" />
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Let's build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">success story.</span>
            </h2>
            <p className="text-xl text-surface-400 max-w-2xl mx-auto mb-10">
              Join the hundreds of companies that have already transformed their digital presence with TechNova.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-surface-950 font-bold rounded-2xl hover:bg-surface-100 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] hover:-translate-y-1"
            >
              Start a Project <HiArrowRight className="w-6 h-6" />
            </Link>
          </FadeInSection>
        </div>
      </section>

      {/* Case Study Modal Overlay */}
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
