import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  HiArrowRight, HiClock, HiEye, HiHeart, HiBookmark,
  HiSearch, HiCode, HiLightningBolt, HiCloud,
  HiColorSwatch, HiSpeakerphone, HiShieldCheck,
  HiChartBar, HiCube, HiUser, HiCalendar,
  HiArrowNarrowRight, HiShare, HiChevronLeft, HiChevronRight,
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

/* ───────────── Data ───────────── */

const blogCategories = [
  'All',
  'Engineering',
  'AI & Machine Learning',
  'Cloud & DevOps',
  'Design',
  'Business',
  'Tutorials',
  'Case Studies',
];

const categoryColors = {
  'Engineering': 'from-neon-blue to-primary-500',
  'AI & Machine Learning': 'from-neon-purple to-neon-pink',
  'Cloud & DevOps': 'from-accent-500 to-neon-cyan',
  'Design': 'from-neon-pink to-neon-orange',
  'Business': 'from-primary-500 to-accent-400',
  'Tutorials': 'from-neon-cyan to-neon-blue',
  'Case Studies': 'from-neon-orange to-primary-500',
};

const categoryBadgeStyles = {
  'Engineering': 'bg-neon-blue/15 text-blue-300 border-neon-blue/30',
  'AI & Machine Learning': 'bg-neon-purple/15 text-purple-300 border-neon-purple/30',
  'Cloud & DevOps': 'bg-accent-500/15 text-accent-300 border-accent-500/30',
  'Design': 'bg-neon-pink/15 text-pink-300 border-neon-pink/30',
  'Business': 'bg-primary-500/15 text-primary-300 border-primary-500/30',
  'Tutorials': 'bg-neon-cyan/15 text-cyan-300 border-neon-cyan/30',
  'Case Studies': 'bg-neon-orange/15 text-orange-300 border-neon-orange/30',
};

const blogPosts = [
  {
    id: 1,
    title: 'Building Scalable Microservices: A Complete Architecture Guide for 2024',
    excerpt: 'Learn how to design and implement production-ready microservices architecture with event-driven patterns, service mesh, and observability from day one.',
    category: 'Engineering',
    author: { name: 'Alex Thompson', role: 'Lead Architect' },
    date: 'Dec 15, 2024',
    readTime: '12 min read',
    views: '15.2K',
    likes: 842,
    featured: true,
    tags: ['Microservices', 'Architecture', 'Node.js', 'Kubernetes'],
    content: `Microservices architecture has evolved significantly in recent years. In this comprehensive guide, we'll explore the patterns and practices that have proven most effective in production environments serving millions of users.

**Key Topics Covered:**
- Event-driven architecture with Apache Kafka
- Service mesh implementation with Istio
- Distributed tracing and observability
- Circuit breaker patterns for resilience
- Database per service vs shared databases
- API gateway design patterns

The journey from monolith to microservices isn't just a technical decision — it's an organizational one. Conway's Law tells us that system design mirrors team structure, and this has profound implications for how we decompose services.

**Starting with Domain-Driven Design:**
Before writing any code, invest time in event storming sessions with domain experts. Map out bounded contexts, identify aggregate roots, and define clear service boundaries. This upfront investment pays dividends in reduced coupling and clearer ownership.

**Event-Driven Communication:**
Synchronous REST calls between services create tight coupling and cascading failures. Instead, adopt an event-driven approach using Apache Kafka or RabbitMQ. Services publish domain events, and interested consumers react accordingly. This decoupling makes your system more resilient and scalable.

**Observability from Day One:**
Don't treat observability as an afterthought. Implement structured logging, distributed tracing (OpenTelemetry), and metrics collection (Prometheus) from the very first service. When issues arise in production, you'll be grateful for the visibility.`,
  },
  {
    id: 2,
    title: 'How We Built an AI-Powered Code Review System That Catches 94% of Bugs',
    excerpt: 'Deep dive into the machine learning pipeline behind our automated code review tool — from training data collection to production deployment.',
    category: 'AI & Machine Learning',
    author: { name: 'Dr. Priya Sharma', role: 'AI Research Lead' },
    date: 'Dec 10, 2024',
    readTime: '15 min read',
    views: '22.8K',
    likes: 1247,
    featured: true,
    tags: ['AI', 'Code Review', 'NLP', 'PyTorch'],
    content: `Building an AI system that understands code semantics requires a fundamentally different approach from traditional NLP. Code has structure, syntax, and implicit contracts that models must learn to reason about.

**The Challenge:**
Manual code reviews are time-consuming and inconsistent. We set out to build a system that could identify bugs, security vulnerabilities, and code quality issues with high accuracy.

**Our Approach:**
We fine-tuned a transformer-based model on 2 million code review comments from open-source repositories. The model learned to identify common patterns that indicate bugs, from null pointer exceptions to race conditions.

**Training Pipeline:**
1. Data collection from GitHub PR reviews
2. Annotation and labeling with domain experts
3. Model architecture: CodeBERT + custom classification heads
4. Multi-task learning for bug detection + severity classification
5. Human-in-the-loop validation and active learning

**Results:**
- 94% bug detection rate (compared to 67% for senior reviewers)
- 3.2x faster review turnaround
- 40% reduction in production incidents

The model excels at catching subtle issues like resource leaks, error handling gaps, and concurrency bugs that even experienced developers miss under time pressure.`,
  },
  {
    id: 3,
    title: 'Zero-Downtime Cloud Migration: Moving a 10-Year-Old Monolith to AWS',
    excerpt: 'A step-by-step account of how we migrated a legacy enterprise application to cloud-native architecture without a single minute of downtime.',
    category: 'Cloud & DevOps',
    author: { name: 'Marcus Lee', role: 'Cloud Solutions Architect' },
    date: 'Dec 5, 2024',
    readTime: '10 min read',
    views: '18.4K',
    likes: 963,
    featured: false,
    tags: ['AWS', 'Migration', 'Terraform', 'Docker'],
    content: `When ScaleUp SaaS approached us with a 10-year-old Java monolith running on bare metal servers, the challenge was clear: modernize without disruption.

**The Legacy System:**
- 2 million lines of Java code
- Single PostgreSQL database (3TB)
- 15 integration points with external systems
- 99.9% uptime SLA requirement

**The Strangler Fig Approach:**
We used the strangler fig pattern to gradually replace functionality. An API gateway routed traffic between old and new systems, allowing us to migrate feature-by-feature while maintaining full backward compatibility.

**Infrastructure as Code:**
Every piece of AWS infrastructure was defined in Terraform modules, enabling reproducible deployments across dev, staging, and production environments. This approach eliminated configuration drift and made rollbacks trivial.

**The Results:**
Zero downtime during migration. Infrastructure costs dropped 65%. Deployment frequency increased from monthly to multiple times daily. The team went from dreading releases to shipping with confidence.`,
  },
  {
    id: 4,
    title: 'Design Systems That Scale: Building a Component Library for 50+ Products',
    excerpt: 'How we created a design system serving 50+ products across 12 teams — balancing consistency with flexibility.',
    category: 'Design',
    author: { name: 'Isabella Marquez', role: 'Design Systems Lead' },
    date: 'Nov 28, 2024',
    readTime: '8 min read',
    views: '12.1K',
    likes: 654,
    featured: false,
    tags: ['Design Systems', 'React', 'Figma', 'Accessibility'],
    content: `A design system is more than a component library — it's a shared language that aligns design and engineering teams across an organization.

**Foundation First:**
We started with design tokens: colors, typography, spacing, and elevation scales defined in a platform-agnostic format. These tokens are the DNA of the system, ensuring visual consistency across web, iOS, and Android.

**Component Architecture:**
Each component follows a composition pattern — small, focused primitives that compose into complex patterns. A Button, for example, composes Icon + Label + LoadingSpinner + Ripple. This approach makes components infinitely flexible while maintaining consistency.

**Accessibility by Default:**
Every component meets WCAG 2.1 AA standards out of the box. Screen reader support, keyboard navigation, focus management, and color contrast are baked in, not bolted on.

**Adoption Strategy:**
The best design system is one that teams actually use. We invested heavily in documentation, Figma integration, and migration tools that made adoption painless. Within 6 months, all 50+ products were using the system.`,
  },
  {
    id: 5,
    title: 'From $0 to $10M ARR: Technical Decisions That Scaled Our SaaS',
    excerpt: 'The infrastructure, architecture, and engineering culture decisions that enabled our client to grow from MVP to 10M ARR in 18 months.',
    category: 'Business',
    author: { name: 'Raj Patel', role: 'VP of Engineering' },
    date: 'Nov 22, 2024',
    readTime: '11 min read',
    views: '31.5K',
    likes: 1823,
    featured: false,
    tags: ['SaaS', 'Scaling', 'Startups', 'Architecture'],
    content: `Scaling a SaaS from zero to $10M ARR in 18 months requires making the right technical bets early. Here's what worked for us and what we'd do differently.

**The Right Foundation:**
We chose a boring tech stack: Next.js, Node.js, PostgreSQL, Redis. No fancy frameworks, no bleeding-edge databases. Boring is good when you need to ship fast and hire quickly.

**Multi-Tenancy from Day One:**
We implemented row-level security in PostgreSQL from the start. Adding multi-tenancy later is exponentially harder than building it in. Every query includes a tenant_id filter, enforced at the ORM level.

**Infrastructure That Grows With You:**
We containerized early and deployed on AWS ECS. Auto-scaling policies based on CPU, memory, and request count let us handle 100x traffic spikes during product launches without manual intervention.

**The Team:**
Technical decisions matter less than the people making them. We hired for curiosity and ownership over specific tech skills. Our best architecture decisions came from engineers who questioned assumptions and proposed simpler alternatives.`,
  },
  {
    id: 6,
    title: 'Building Real-Time Features with WebSockets: A Practical Tutorial',
    excerpt: 'Step-by-step guide to implementing real-time notifications, live cursors, and collaborative editing using Socket.io and React.',
    category: 'Tutorials',
    author: { name: 'Sarah Chen', role: 'Senior Engineer' },
    date: 'Nov 15, 2024',
    readTime: '14 min read',
    views: '27.3K',
    likes: 1456,
    featured: false,
    tags: ['WebSocket', 'Socket.io', 'React', 'Real-Time'],
    content: `WebSockets enable bidirectional communication between client and server, making them perfect for real-time features. In this tutorial, we'll build three real-world features from scratch.

**What We'll Build:**
1. Live notification system with read receipts
2. Collaborative cursor presence (like Google Docs)
3. Real-time document editing with conflict resolution

**Setting Up Socket.io:**
Socket.io adds reliability features on top of WebSockets: automatic reconnection, room-based broadcasting, and fallback to long-polling when WebSockets aren't available.

**Presence System:**
Track which users are online and what they're doing. We use Redis adapter for horizontal scaling across multiple server instances, ensuring presence state is consistent.

**Conflict Resolution:**
When two users edit the same document simultaneously, we use Operational Transformation (OT) to merge changes. The server acts as the authoritative source, transforming operations to maintain document consistency.

**Performance at Scale:**
We tested our implementation with 10,000 concurrent connections on a single server instance. With proper connection pooling and Redis pub/sub, we maintained sub-50ms message delivery.`,
  },
  {
    id: 7,
    title: 'How FinStack Achieved 99.99% Uptime: A Case Study in Reliability Engineering',
    excerpt: 'An inside look at the architecture, processes, and culture that enabled FinStack to achieve four-nines uptime for their digital banking platform.',
    category: 'Case Studies',
    author: { name: 'David Kim', role: 'SRE Lead' },
    date: 'Nov 8, 2024',
    readTime: '9 min read',
    views: '14.7K',
    likes: 789,
    featured: false,
    tags: ['Reliability', 'SRE', 'FinTech', 'Monitoring'],
    content: `FinStack processes over 200,000 financial transactions daily. When your platform handles money, downtime isn't just inconvenient — it's unacceptable. Here's how we achieved 99.99% uptime.

**The Architecture:**
Multi-region active-active deployment across two AWS regions. Every write goes to both regions simultaneously via CRDT-based replication. If one region fails, traffic automatically routes to the healthy region within seconds.

**Chaos Engineering:**
We regularly inject failures into production: kill instances, introduce network latency, corrupt data. Each chaos experiment validates our resilience mechanisms and reveals blind spots.

**Incident Response:**
Our on-call rotation uses a tiered escalation model. L1 responders handle known issues with runbooks. L2 handles novel incidents. Every incident produces a blameless post-mortem with concrete action items.

**The Result:**
52 minutes of total downtime in 12 months — and most of that was a planned database migration window. Our error budget model ensures we invest in reliability when needed while shipping features at pace.`,
  },
  {
    id: 8,
    title: 'The Complete Guide to Securing Your Node.js API in Production',
    excerpt: 'From authentication to rate limiting, input validation to dependency scanning — every security measure your Node.js API needs.',
    category: 'Engineering',
    author: { name: 'Alex Novak', role: 'Security Engineer' },
    date: 'Oct 30, 2024',
    readTime: '13 min read',
    views: '19.6K',
    likes: 1089,
    featured: false,
    tags: ['Security', 'Node.js', 'API', 'Authentication'],
    content: `Security isn't a feature you add later — it's a practice you embed from line one. This guide covers every security measure your Node.js API needs in production.

**Authentication & Authorization:**
Use JWT with short-lived access tokens (15 min) and long-lived refresh tokens (7 days) stored in httpOnly cookies. Implement role-based access control (RBAC) with fine-grained permissions.

**Input Validation:**
Never trust user input. Use express-validator or Joi to validate every request body, query parameter, and URL parameter. Sanitize inputs to prevent XSS and NoSQL injection.

**Rate Limiting:**
Implement tiered rate limiting: global limits to prevent DDoS, per-user limits to prevent abuse, and per-endpoint limits for sensitive operations like login and password reset.

**Dependency Security:**
Run npm audit in CI/CD. Use Snyk or Dependabot for automated vulnerability scanning. Pin dependency versions and review updates before merging.

**Headers & CORS:**
Use Helmet.js for secure HTTP headers. Configure CORS with explicit origin whitelisting — never use wildcard in production.`,
  },
  {
    id: 9,
    title: 'Implementing RAG: Building an AI Assistant That Actually Knows Your Docs',
    excerpt: 'How to build a Retrieval-Augmented Generation system that gives accurate answers from your company\'s documentation and knowledge base.',
    category: 'AI & Machine Learning',
    author: { name: 'Dr. Priya Sharma', role: 'AI Research Lead' },
    date: 'Oct 22, 2024',
    readTime: '16 min read',
    views: '35.1K',
    likes: 2134,
    featured: false,
    tags: ['RAG', 'LLM', 'Vector Database', 'OpenAI'],
    content: `Large Language Models are powerful, but they hallucinate when asked about your specific domain. Retrieval-Augmented Generation (RAG) solves this by grounding LLM responses in your actual documentation.

**The RAG Pipeline:**
1. Document ingestion and chunking
2. Embedding generation with text-embedding-3-small
3. Vector storage in Pinecone/Weaviate
4. Semantic search at query time
5. Context injection into LLM prompt
6. Answer generation with source citations

**Chunking Strategy:**
How you split documents matters enormously. We use recursive text splitting with 512 token chunks and 50 token overlap. Headers and section boundaries are preserved to maintain context.

**Embedding Quality:**
We experimented with multiple embedding models. OpenAI's text-embedding-3-small offers the best accuracy-to-cost ratio for most use cases. For specialized domains, fine-tuned embeddings improve retrieval accuracy by 15-20%.

**Evaluation:**
We built an automated evaluation framework that tests answer accuracy, source attribution, and hallucination rates across 500 curated question-answer pairs. Our current system achieves 91% accuracy with 97% proper source citation.`,
  },
];

/* ───────────── Blog Card Components ───────────── */

const FeaturedPostCard = ({ post, onClick }) => {
  const gradient = categoryColors[post.category] || 'from-primary-500 to-accent-500';
  const badgeStyle = categoryBadgeStyles[post.category] || 'bg-primary-500/15 text-primary-300 border-primary-500/30';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={() => onClick(post)}
      className="glass-card-hover cursor-pointer group overflow-hidden lg:col-span-2 lg:grid lg:grid-cols-2"
      id={`featured-post-${post.id}`}
    >
      {/* Thumbnail */}
      <div className={`relative h-64 lg:h-full bg-gradient-to-br ${gradient} overflow-hidden`}>
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <HiCube className="w-20 h-20 text-white/20" />
        </div>
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
            ⭐ Featured
          </span>
        </div>
        <div className="absolute inset-0 bg-surface-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col justify-center">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border self-start mb-4 ${badgeStyle}`}>
          {post.category}
        </span>

        <h2 className="text-xl lg:text-2xl font-display font-bold text-white mb-3 group-hover:text-primary-300 transition-colors leading-snug">
          {post.title}
        </h2>

        <p className="text-sm text-surface-400 mb-6 leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {/* Author & Meta */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-white">{post.author.name}</div>
              <div className="text-xs text-surface-500">{post.author.role}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-surface-500">
          <span className="flex items-center gap-1"><HiCalendar className="w-3.5 h-3.5" /> {post.date}</span>
          <span className="flex items-center gap-1"><HiClock className="w-3.5 h-3.5" /> {post.readTime}</span>
          <span className="flex items-center gap-1"><HiEye className="w-3.5 h-3.5" /> {post.views}</span>
          <span className="flex items-center gap-1"><HiHeart className="w-3.5 h-3.5" /> {post.likes.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

const BlogPostCard = ({ post, index, onClick }) => {
  const gradient = categoryColors[post.category] || 'from-primary-500 to-accent-500';
  const badgeStyle = categoryBadgeStyles[post.category] || 'bg-primary-500/15 text-primary-300 border-primary-500/30';

  return (
    <FadeInSection delay={index * 0.08}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={() => onClick(post)}
        className="glass-card-hover cursor-pointer group flex flex-col h-full overflow-hidden"
        id={`blog-post-${post.id}`}
      >
        {/* Thumbnail */}
        <div className={`relative h-44 bg-gradient-to-br ${gradient} overflow-hidden`}>
          <div className="absolute inset-0 dot-pattern opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <HiCube className="w-14 h-14 text-white/20" />
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-white text-xs font-medium">
              {post.readTime}
            </span>
          </div>
          <div className="absolute inset-0 bg-surface-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-white text-sm font-semibold border border-white/20">
              Read Article <HiArrowNarrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border self-start mb-3 ${badgeStyle}`}>
            {post.category}
          </span>

          <h3 className="text-base font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors leading-snug line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sm text-surface-400 mb-4 flex-1 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-md bg-surface-800/80 text-surface-400 text-xs border border-surface-700/50">
                #{tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-[10px] font-bold">
                {post.author.name.charAt(0)}
              </div>
              <span className="text-xs text-surface-400">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-surface-500">
              <span className="flex items-center gap-1"><HiEye className="w-3 h-3" /> {post.views}</span>
              <span className="flex items-center gap-1"><HiHeart className="w-3 h-3" /> {post.likes.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </FadeInSection>
  );
};

/* ───────────── Article Reader Modal ───────────── */

const ArticleModal = ({ post, onClose }) => {
  if (!post) return null;
  const gradient = categoryColors[post.category] || 'from-primary-500 to-accent-500';
  const badgeStyle = categoryBadgeStyles[post.category] || 'bg-primary-500/15 text-primary-300 border-primary-500/30';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 pb-8 overflow-y-auto"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-surface-950/80 backdrop-blur-md" />

      <motion.article
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-3xl glass-card overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        id="blog-article-modal"
      >
        {/* Header image */}
        <div className={`relative h-48 md:h-56 bg-gradient-to-br ${gradient} overflow-hidden`}>
          <div className="absolute inset-0 dot-pattern opacity-15" />
          <div className="absolute inset-0 flex items-center justify-center">
            <HiCube className="w-20 h-20 text-white/20" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-surface-950/90 to-transparent h-24" />

          {/* Close & Share */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-2 rounded-xl bg-black/30 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/50 transition-all">
              <HiShare className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl bg-black/30 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/50 transition-all">
              <HiBookmark className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/30 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/50 transition-all"
              id="blog-article-close-btn"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Category badge */}
          <div className="absolute bottom-6 left-8">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
              {post.category}
            </span>
          </div>
        </div>

        {/* Article content */}
        <div className="p-8 md:p-10">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 leading-snug">
            {post.title}
          </h1>

          {/* Author & Meta */}
          <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{post.author.name}</div>
                <div className="text-xs text-surface-400">{post.author.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-surface-500">
              <span className="flex items-center gap-1"><HiCalendar className="w-3.5 h-3.5" /> {post.date}</span>
              <span className="flex items-center gap-1"><HiClock className="w-3.5 h-3.5" /> {post.readTime}</span>
              <span className="flex items-center gap-1"><HiEye className="w-3.5 h-3.5" /> {post.views} views</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-lg bg-surface-800/80 text-surface-300 text-xs border border-surface-700/50">
                #{tag}
              </span>
            ))}
          </div>

          {/* Article body */}
          <div className="prose prose-invert prose-sm max-w-none">
            {post.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return <h3 key={i} className="text-lg font-display font-bold text-white mt-8 mb-3">{paragraph.replace(/\*\*/g, '')}</h3>;
              }
              if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                const title = paragraph.match(/\*\*(.*?)\*\*/)?.[1] || '';
                const rest = paragraph.replace(/\*\*.*?\*\*/, '');
                return (
                  <div key={i} className="mt-6 mb-3">
                    <h3 className="text-lg font-display font-bold text-white mb-2">{title}</h3>
                    {rest && <p className="text-surface-300 leading-relaxed">{rest}</p>}
                  </div>
                );
              }
              if (paragraph.match(/^\d+\./)) {
                const items = paragraph.split('\n').filter(Boolean);
                return (
                  <ol key={i} className="list-decimal list-inside space-y-1.5 my-4 text-surface-300 text-sm">
                    {items.map((item, j) => <li key={j}>{item.replace(/^\d+\.\s*/, '')}</li>)}
                  </ol>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(Boolean);
                return (
                  <ul key={i} className="list-disc list-inside space-y-1.5 my-4 text-surface-300 text-sm">
                    {items.map((item, j) => <li key={j}>{item.replace(/^-\s*/, '')}</li>)}
                  </ul>
                );
              }
              return <p key={i} className="text-surface-300 text-sm leading-relaxed mb-4">{paragraph}</p>;
            })}
          </div>

          {/* Engagement footer */}
          <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-surface-300 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all text-sm">
                <HiHeart className="w-4 h-4" /> {post.likes.toLocaleString()}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-surface-300 hover:text-primary-400 hover:border-primary-500/30 hover:bg-primary-500/5 transition-all text-sm">
                <HiBookmark className="w-4 h-4" /> Save
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-surface-300 hover:text-white hover:border-white/20 transition-all text-sm">
              <HiShare className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </motion.article>
    </motion.div>
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
    <div className="glass-card p-8 md:p-10 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-500/10 rounded-full blur-[80px]" />

      <div className="relative z-10">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/10 flex items-center justify-center mb-4">
          <HiSpeakerphone className="w-7 h-7 text-primary-400" />
        </div>
        <h3 className="text-xl font-display font-bold text-white mb-2">
          Subscribe to Our Newsletter
        </h3>
        <p className="text-sm text-surface-400 mb-6 max-w-md mx-auto">
          Get weekly insights on engineering, AI, design, and business delivered straight to your inbox. Join 5,000+ tech leaders.
        </p>

        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 text-accent-400 font-medium"
          >
            <HiShieldCheck className="w-5 h-5" /> You're subscribed! Check your inbox.
          </motion.div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input-field flex-1 text-sm"
              required
              id="newsletter-email-input"
            />
            <button type="submit" className="btn-primary !px-6 !py-3 text-sm whitespace-nowrap" id="newsletter-subscribe-btn">
              Subscribe
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
  const [selectedPost, setSelectedPost] = useState(null);

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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedPost]);

  return (
    <>
      <Helmet>
        <title>Blog — TechNova Solutions</title>
        <meta name="description" content="Insights on software engineering, AI, cloud infrastructure, design systems, and scaling startups. Written by practitioners who build production systems." />
      </Helmet>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden" id="blog-hero">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-neon-purple/15 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-neon-blue/10 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-purple-300 text-sm mb-8"
            >
              <span className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" />
              Insights from practitioners who build production systems
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-tight mb-6"
            >
              The TechNova <span className="gradient-text">Blog</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-surface-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Deep dives into engineering, AI, cloud, and design. No fluff — just battle-tested
              insights from building real products at scale.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="max-w-xl mx-auto"
            >
              <div className="relative">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, topics, tags..."
                  className="input-field pl-12 pr-4"
                  id="blog-search-input"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-950 to-transparent" />
      </section>

      {/* ═══════════════ CATEGORY FILTER ═══════════════ */}
      <section className="section-padding !pt-8 !pb-0" id="blog-filters">
        <div className="container-max mx-auto">
          <FadeInSection>
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {blogCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                    activeCategory === cat
                      ? 'bg-primary-500/20 border-primary-500/40 text-primary-300 shadow-glow-primary'
                      : 'bg-white/5 border-white/10 text-surface-400 hover:text-white hover:border-white/20 hover:bg-white/10'
                  }`}
                  id={`blog-filter-${cat.replace(/[\s&/]+/g, '-').toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══════════════ FEATURED POSTS ═══════════════ */}
      {activeCategory === 'All' && searchQuery === '' && (
        <section className="section-padding !pt-0 !pb-8" id="blog-featured">
          <div className="container-max mx-auto">
            <FadeInSection className="mb-8">
              <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-8 h-px bg-gradient-to-r from-primary-500 to-transparent" />
                Featured Articles
              </h2>
            </FadeInSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPosts.map((post, i) => (
                <FadeInSection key={post.id} delay={i * 0.1}>
                  <FeaturedPostCard post={post} onClick={setSelectedPost} />
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ ALL POSTS GRID ═══════════════ */}
      <section className="section-padding !pt-8" id="blog-posts-grid">
        <div className="container-max mx-auto">
          {(activeCategory !== 'All' || searchQuery !== '') && (
            <FadeInSection className="mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-8 h-px bg-gradient-to-r from-primary-500 to-transparent" />
                  {activeCategory === 'All' ? 'Search Results' : activeCategory} ({filteredPosts.length})
                </h2>
                {(activeCategory !== 'All' || searchQuery !== '') && (
                  <button
                    onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                    className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
                  >
                    Clear filters <HiArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </FadeInSection>
          )}

          {activeCategory === 'All' && searchQuery === '' && (
            <FadeInSection className="mb-8">
              <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-8 h-px bg-gradient-to-r from-primary-500 to-transparent" />
                Latest Articles
              </h2>
            </FadeInSection>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {(activeCategory !== 'All' || searchQuery !== '' ? filteredPosts : regularPosts).map((post, i) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  index={i}
                  onClick={setSelectedPost}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <HiSearch className="w-16 h-16 text-surface-600 mx-auto mb-4" />
              <p className="text-surface-400 text-lg mb-2">No articles found</p>
              <p className="text-surface-500 text-sm">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ NEWSLETTER ═══════════════ */}
      <section className="section-padding !pt-0" id="blog-newsletter">
        <div className="container-max mx-auto max-w-3xl">
          <FadeInSection>
            <NewsletterSignup />
          </FadeInSection>
        </div>
      </section>

      {/* ═══════════════ TOPICS CLOUD ═══════════════ */}
      <section className="section-padding relative overflow-hidden" id="blog-topics">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="container-max mx-auto relative z-10">
          <FadeInSection className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
              Popular <span className="gradient-text">Topics</span>
            </h2>
            <p className="text-surface-400 text-sm max-w-lg mx-auto">
              Explore our most popular tags and dive deep into the topics that matter to you.
            </p>
          </FadeInSection>

          <FadeInSection>
            <div className="flex flex-wrap justify-center gap-2.5">
              {[
                'React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Kubernetes',
                'Docker', 'AI', 'Machine Learning', 'LLM', 'RAG', 'Architecture',
                'Microservices', 'DevOps', 'CI/CD', 'Security', 'Performance',
                'Design Systems', 'Accessibility', 'WebSocket', 'GraphQL', 'PostgreSQL',
                'Redis', 'Terraform', 'Startups', 'SaaS', 'Scaling',
              ].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSearchQuery(topic)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-surface-300 text-sm font-medium hover:border-primary-500/30 hover:text-primary-300 hover:bg-primary-500/5 transition-all duration-300 cursor-pointer"
                >
                  #{topic}
                </button>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section className="section-padding" id="blog-cta">
        <div className="container-max mx-auto">
          <FadeInSection>
            <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/90 to-accent-600/80" />
              <div className="absolute inset-0 dot-pattern opacity-10" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-400/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/20 rounded-full blur-[100px]" />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                  Want to work with us?
                </h2>
                <p className="text-primary-100/80 text-lg mb-8 max-w-xl mx-auto">
                  Turn these insights into real results. Let's build your next product together.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300 hover:shadow-lg group"
                    id="blog-cta-contact-btn"
                  >
                    Get in Touch
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/portfolio"
                    className="inline-flex items-center gap-2 px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                    id="blog-cta-portfolio-btn"
                  >
                    View Portfolio
                  </Link>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══════════════ ARTICLE MODAL ═══════════════ */}
      <AnimatePresence>
        {selectedPost && (
          <ArticleModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Blog;
