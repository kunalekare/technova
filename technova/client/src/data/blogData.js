export const blogCategories = [
  'All',
  'Engineering',
  'AI & Machine Learning',
  'Cloud & DevOps',
  'Design',
  'Business',
  'Tutorials',
  'Case Studies',
];

export const categoryColors = {
  'Engineering': 'from-neon-blue to-primary-500',
  'AI & Machine Learning': 'from-neon-purple to-neon-pink',
  'Cloud & DevOps': 'from-accent-500 to-neon-cyan',
  'Design': 'from-neon-pink to-neon-orange',
  'Business': 'from-primary-500 to-accent-400',
  'Tutorials': 'from-neon-cyan to-neon-blue',
  'Case Studies': 'from-neon-orange to-primary-500',
};

export const categoryBadgeStyles = {
  'Engineering': 'bg-neon-blue/15 text-blue-300 border-neon-blue/30',
  'AI & Machine Learning': 'bg-neon-purple/15 text-purple-300 border-neon-purple/30',
  'Cloud & DevOps': 'bg-accent-500/15 text-accent-300 border-accent-500/30',
  'Design': 'bg-neon-pink/15 text-pink-300 border-neon-pink/30',
  'Business': 'bg-primary-500/15 text-primary-300 border-primary-500/30',
  'Tutorials': 'bg-neon-cyan/15 text-cyan-300 border-neon-cyan/30',
  'Case Studies': 'bg-neon-orange/15 text-orange-300 border-neon-orange/30',
};

export const blogPosts = [
  {
    id: 1,
    title: 'Building Scalable Microservices: A Complete Architecture Guide for 2024',
    excerpt: 'Learn how to design and implement production-ready microservices architecture with event-driven patterns, service mesh, and observability from day one.',
    category: 'Engineering',
    author: { name: 'Alex Thompson', role: 'Lead Architect', avatar: 'A' },
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
    author: { name: 'Dr. Priya Sharma', role: 'AI Research Lead', avatar: 'P' },
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
    author: { name: 'Marcus Lee', role: 'Cloud Solutions Architect', avatar: 'M' },
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
    author: { name: 'Isabella Marquez', role: 'Design Systems Lead', avatar: 'I' },
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
    author: { name: 'Raj Patel', role: 'VP of Engineering', avatar: 'R' },
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
    author: { name: 'Sarah Chen', role: 'Senior Engineer', avatar: 'S' },
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
    author: { name: 'David Kim', role: 'SRE Lead', avatar: 'D' },
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
    author: { name: 'Alex Novak', role: 'Security Engineer', avatar: 'A' },
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
    author: { name: 'Dr. Priya Sharma', role: 'AI Research Lead', avatar: 'P' },
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
