import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Role from '../models/Role.js';
import Category from '../models/Category.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import JobListing from '../models/JobListing.js';
import InternshipListing from '../models/InternshipListing.js';

const roles = [
  {
    name: 'client',
    permissions: ['view_services', 'create_projects', 'manage_profile', 'create_tickets', 'view_invoices'],
  },
  {
    name: 'admin',
    permissions: [
      'manage_services', 'manage_users', 'manage_projects', 'manage_orders',
      'manage_payments', 'manage_leads', 'manage_team', 'manage_blogs',
      'manage_portfolio', 'manage_reviews', 'manage_tickets', 'view_analytics',
    ],
  },
  {
    name: 'team_member',
    permissions: ['view_projects', 'update_milestones', 'manage_tickets', 'view_services'],
  },
  {
    name: 'super_admin',
    permissions: ['*'], // All permissions
  },
];

const categories = [
  {
    name: 'Software Development',
    icon: 'HiCode',
    description: 'Custom software solutions including web applications, SaaS platforms, ERP systems, and API development',
    subCategories: ['Website Development', 'E-commerce Development', 'Custom Web Apps', 'SaaS Development', 'ERP/CRM Development', 'API Development', 'Maintenance & Support'],
  },
  {
    name: 'Mobile App Development',
    icon: 'HiDeviceMobile',
    description: 'Native and cross-platform mobile applications for Android, iOS, and enterprise',
    subCategories: ['Android Development', 'iOS Development', 'Cross-Platform Apps', 'Enterprise Mobile Apps'],
  },
  {
    name: 'Artificial Intelligence',
    icon: 'HiLightningBolt',
    description: 'AI-powered solutions including chatbots, intelligent agents, generative AI, and workflow automation',
    subCategories: ['AI Chatbots', 'AI Assistants/Agents', 'Agentic AI', 'Generative AI', 'OpenAI Integration', 'LLM Development', 'AI Workflow Automation'],
  },
  {
    name: 'Machine Learning',
    icon: 'HiChartBar',
    description: 'Advanced ML models for prediction, classification, recommendation systems, and computer vision',
    subCategories: ['Predictive Analytics', 'Recommendation Systems', 'Classification Models', 'Deep Learning', 'NLP', 'Computer Vision'],
  },
  {
    name: 'Data Analytics',
    icon: 'HiPresentationChartBar',
    description: 'Business intelligence, data visualization, KPI reporting, and executive dashboards',
    subCategories: ['Power BI', 'Tableau', 'Business Analytics', 'Data Visualization', 'KPI Reporting', 'Executive Dashboards'],
  },
  {
    name: 'Excel Services',
    icon: 'HiTable',
    description: 'Advanced Excel automation, dashboards, VBA macros, financial models, and data management',
    subCategories: ['Excel Automation', 'Dashboards', 'VBA Macros', 'Financial Models', 'MIS Reports', 'Data Cleaning'],
  },
  {
    name: 'Database Services',
    icon: 'HiDatabase',
    description: 'Database design, optimization, migration, and management for PostgreSQL, MySQL, MongoDB, and Oracle',
    subCategories: ['PostgreSQL', 'MySQL', 'MongoDB', 'Oracle', 'Database Optimization', 'Data Migration'],
  },
  {
    name: 'Cloud & DevOps',
    icon: 'HiCloud',
    description: 'Cloud infrastructure, containerization, CI/CD pipelines, and infrastructure automation',
    subCategories: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Jenkins', 'Infrastructure Automation'],
  },
  {
    name: 'UI/UX Design',
    icon: 'HiColorSwatch',
    description: 'User experience design, wireframing, prototyping, and mobile-first design systems',
    subCategories: ['Wireframes', 'Prototypes', 'Mobile UI Design', 'Dashboard Design', 'Design Systems'],
  },
  {
    name: 'Graphic Design',
    icon: 'HiPhotograph',
    description: 'Professional logo design, brand identity, social media creatives, and marketing materials',
    subCategories: ['Logo Design', 'Social Media Design', 'Brand Identity', 'Marketing Creatives', 'Presentation Design'],
  },
  {
    name: 'Video Editing',
    icon: 'HiFilm',
    description: 'Professional video editing for social media, YouTube, motion graphics, and corporate productions',
    subCategories: ['Reels & Shorts', 'YouTube Editing', 'Motion Graphics', 'Corporate Videos', 'Animation'],
  },
  {
    name: 'Digital Marketing',
    icon: 'HiSpeakerphone',
    description: 'Comprehensive digital marketing including SEO, social media, email campaigns, and paid advertising',
    subCategories: ['SEO', 'Social Media Marketing', 'Email Marketing', 'PPC / Google Ads', 'Lead Generation', 'Content Marketing'],
  },
  {
    name: 'Content Creation',
    icon: 'HiPencilAlt',
    description: 'Professional writing services including blogs, technical documentation, website content, and copywriting',
    subCategories: ['Blog Writing', 'Technical Writing', 'Website Content', 'Documentation', 'Copywriting'],
  },
  {
    name: '3D Architecture & Visualization',
    icon: 'HiCube',
    description: '3D modeling, interior/exterior visualization, architectural walkthroughs, and product rendering',
    subCategories: ['Interior Design', 'Exterior Design', '3D Modeling', 'Walkthrough Animations', 'Product Rendering'],
  },
  {
    name: 'Business Automation',
    icon: 'HiCog',
    description: 'CRM/ERP automation, workflow optimization, HRMS, payroll systems, and process automation',
    subCategories: ['CRM/ERP Automation', 'Workflow Automation', 'HRMS', 'Payroll Systems', 'Process Automation'],
  },
  {
    name: 'Consulting Services',
    icon: 'HiBriefcase',
    description: 'Expert consulting in IT strategy, AI implementation, cloud architecture, and business transformation',
    subCategories: ['IT Consulting', 'AI Consulting', 'Cloud Consulting', 'Business Consulting', 'Digital Transformation'],
  },
];

// Sample services for first few categories to populate the catalog
const sampleServices = [
  {
    title: 'Custom Website Development',
    categoryName: 'Software Development',
    subCategory: 'Website Development',
    description: 'Get a stunning, high-performance custom website built with modern technologies. From landing pages to complex web applications, we deliver pixel-perfect designs with clean, maintainable code. Includes responsive design, SEO optimization, and cross-browser compatibility.',
    shortDescription: 'Custom-built, responsive websites with modern tech stacks and SEO optimization.',
    pricingTiers: [
      { name: 'Basic', price: 499, features: ['5 Pages', 'Responsive Design', 'Contact Form', 'SEO Basics', '1 Revision'], deliveryDays: 14 },
      { name: 'Standard', price: 999, features: ['10 Pages', 'Responsive Design', 'CMS Integration', 'Advanced SEO', 'Blog Section', '3 Revisions'], deliveryDays: 21 },
      { name: 'Premium', price: 2499, features: ['Unlimited Pages', 'Custom Design', 'Full CMS', 'E-commerce Ready', 'API Integration', 'Priority Support', 'Unlimited Revisions'], deliveryDays: 30 },
    ],
    tags: ['website', 'web development', 'react', 'nextjs', 'frontend'],
    isFeatured: true,
  },
  {
    title: 'Full-Stack SaaS Development',
    categoryName: 'Software Development',
    subCategory: 'SaaS Development',
    description: 'End-to-end SaaS product development from architecture design to deployment. We build scalable, multi-tenant applications with subscription billing, user management, dashboards, and analytics built-in.',
    shortDescription: 'Scalable SaaS platform development with multi-tenancy and billing integration.',
    pricingTiers: [
      { name: 'Basic', price: 4999, features: ['MVP Features', 'User Auth', 'Basic Dashboard', 'Stripe Integration', 'Cloud Deployment'], deliveryDays: 45 },
      { name: 'Standard', price: 9999, features: ['Full Feature Set', 'Multi-tenant', 'Admin Panel', 'Analytics', 'API Documentation', 'CI/CD Pipeline'], deliveryDays: 60 },
      { name: 'Premium', price: 19999, features: ['Enterprise-grade', 'Custom Integrations', 'AI Features', 'Advanced Analytics', 'White-label Options', 'Dedicated Support'], deliveryDays: 90 },
    ],
    tags: ['saas', 'full-stack', 'subscription', 'cloud', 'enterprise'],
    isFeatured: true,
  },
  {
    title: 'Cross-Platform Mobile App',
    categoryName: 'Mobile App Development',
    subCategory: 'Cross-Platform Apps',
    description: 'Build once, deploy everywhere with React Native or Flutter. We create beautiful, performant mobile apps that work on both iOS and Android, with native-like performance and full access to device features.',
    shortDescription: 'React Native / Flutter apps for iOS and Android with native performance.',
    pricingTiers: [
      { name: 'Basic', price: 2999, features: ['Up to 10 Screens', 'API Integration', 'Push Notifications', 'Basic Analytics'], deliveryDays: 30 },
      { name: 'Standard', price: 5999, features: ['Up to 25 Screens', 'Auth & Social Login', 'Payment Gateway', 'Offline Mode', 'Admin Panel'], deliveryDays: 45 },
      { name: 'Premium', price: 12999, features: ['Unlimited Screens', 'Real-time Features', 'AI Integration', 'App Store Submission', 'Post-launch Support'], deliveryDays: 60 },
    ],
    tags: ['mobile', 'react native', 'flutter', 'ios', 'android', 'cross-platform'],
    isFeatured: true,
  },
  {
    title: 'AI Chatbot Development',
    categoryName: 'Artificial Intelligence',
    subCategory: 'AI Chatbots',
    description: 'Intelligent conversational AI chatbots powered by GPT-4, Claude, or custom LLMs. Seamlessly integrate with your website, WhatsApp, Slack, or any platform. Handle customer support, lead generation, and internal workflows.',
    shortDescription: 'Smart AI chatbots for support, sales, and automation using leading LLMs.',
    pricingTiers: [
      { name: 'Basic', price: 1499, features: ['FAQ Bot', 'Website Integration', 'Up to 1000 Messages/mo', 'Basic Analytics'], deliveryDays: 14 },
      { name: 'Standard', price: 3999, features: ['Custom Knowledge Base', 'Multi-platform', 'Lead Capture', 'Human Handoff', '10K Messages/mo'], deliveryDays: 21 },
      { name: 'Premium', price: 7999, features: ['Custom LLM Fine-tuning', 'RAG Pipeline', 'CRM Integration', 'Analytics Dashboard', 'Unlimited Messages', 'Priority Support'], deliveryDays: 30 },
    ],
    tags: ['ai', 'chatbot', 'gpt', 'llm', 'conversational ai', 'openai'],
    isFeatured: true,
  },
  {
    title: 'Predictive Analytics Solution',
    categoryName: 'Machine Learning',
    subCategory: 'Predictive Analytics',
    description: 'Transform your data into actionable predictions. We build custom ML models for demand forecasting, churn prediction, price optimization, and more, deployed as APIs or integrated into your existing systems.',
    shortDescription: 'Custom ML models for forecasting, churn prediction, and business intelligence.',
    pricingTiers: [
      { name: 'Basic', price: 2499, features: ['Data Analysis', 'Single Model', 'API Deployment', 'Performance Report'], deliveryDays: 21 },
      { name: 'Standard', price: 4999, features: ['Multiple Models', 'Feature Engineering', 'Dashboard', 'A/B Testing', 'Documentation'], deliveryDays: 30 },
      { name: 'Premium', price: 9999, features: ['Ensemble Models', 'Real-time Prediction', 'AutoML Pipeline', 'Monitoring', 'Retraining Pipeline'], deliveryDays: 45 },
    ],
    tags: ['machine learning', 'predictive analytics', 'data science', 'forecasting'],
  },
  {
    title: 'Power BI Dashboard Development',
    categoryName: 'Data Analytics',
    subCategory: 'Power BI',
    description: 'Interactive, visually stunning Power BI dashboards that turn your raw data into actionable insights. Connected to live data sources with automated refresh, drill-down capabilities, and mobile-optimized views.',
    shortDescription: 'Professional Power BI dashboards with live data connections and automated reporting.',
    pricingTiers: [
      { name: 'Basic', price: 399, features: ['3 Report Pages', 'Data Modeling', 'Basic Visuals', 'PDF Export'], deliveryDays: 7 },
      { name: 'Standard', price: 799, features: ['8 Report Pages', 'DAX Measures', 'Custom Visuals', 'Scheduled Refresh', 'Row-level Security'], deliveryDays: 14 },
      { name: 'Premium', price: 1999, features: ['Unlimited Pages', 'Embedded Analytics', 'Custom Connectors', 'Paginated Reports', 'Training Session'], deliveryDays: 21 },
    ],
    tags: ['power bi', 'data analytics', 'dashboard', 'business intelligence', 'reporting'],
    isFeatured: true,
  },
  {
    title: 'Cloud Infrastructure Setup (AWS)',
    categoryName: 'Cloud & DevOps',
    subCategory: 'AWS',
    description: 'Production-ready AWS infrastructure with high availability, auto-scaling, security best practices, and cost optimization. From simple deployments to complex multi-region architectures.',
    shortDescription: 'Production-ready AWS infrastructure with auto-scaling and security hardening.',
    pricingTiers: [
      { name: 'Basic', price: 999, features: ['EC2/ECS Setup', 'RDS Database', 'S3 Storage', 'CloudFront CDN', 'SSL Certificate'], deliveryDays: 7 },
      { name: 'Standard', price: 2499, features: ['Auto-scaling', 'Load Balancer', 'VPC Design', 'CloudWatch Monitoring', 'Terraform/IaC', 'CI/CD Pipeline'], deliveryDays: 14 },
      { name: 'Premium', price: 5999, features: ['Multi-region', 'Disaster Recovery', 'Security Audit', 'Cost Optimization', 'Documentation', '24/7 Support'], deliveryDays: 21 },
    ],
    tags: ['aws', 'cloud', 'devops', 'infrastructure', 'deployment', 'terraform'],
  },
  {
    title: 'Brand Identity & Logo Design',
    categoryName: 'Graphic Design',
    subCategory: 'Brand Identity',
    description: 'Complete brand identity package including logo design, color palette, typography, brand guidelines, and marketing collateral. Make your brand stand out with professional, memorable design.',
    shortDescription: 'Complete brand identity with logo, colors, typography, and brand guidelines.',
    pricingTiers: [
      { name: 'Basic', price: 199, features: ['3 Logo Concepts', 'Color Palette', '2 Revisions', 'PNG/SVG Files'], deliveryDays: 5 },
      { name: 'Standard', price: 499, features: ['5 Logo Concepts', 'Full Brand Guide', 'Business Card Design', 'Social Media Kit', '5 Revisions'], deliveryDays: 10 },
      { name: 'Premium', price: 999, features: ['Unlimited Concepts', 'Complete Brand Book', 'All Stationery', 'Presentation Templates', 'Source Files', 'Unlimited Revisions'], deliveryDays: 14 },
    ],
    tags: ['logo', 'branding', 'brand identity', 'graphic design', 'visual identity'],
    isFeatured: true,
  },
  {
    title: 'SEO & Organic Growth Package',
    categoryName: 'Digital Marketing',
    subCategory: 'SEO',
    description: 'Comprehensive SEO strategy to boost your organic search rankings. Includes technical SEO audit, on-page optimization, content strategy, link building, and monthly performance reporting.',
    shortDescription: 'Full-service SEO with technical audit, on-page optimization, and content strategy.',
    pricingTiers: [
      { name: 'Basic', price: 299, features: ['SEO Audit', 'Keyword Research', 'On-page Optimization', 'Monthly Report'], deliveryDays: 7 },
      { name: 'Standard', price: 699, features: ['Everything in Basic', 'Content Strategy', 'Technical SEO', 'Link Building (10/mo)', 'Bi-weekly Reports'], deliveryDays: 30 },
      { name: 'Premium', price: 1499, features: ['Everything in Standard', 'Local SEO', 'Competitor Analysis', 'Link Building (30/mo)', 'Weekly Reports', 'Dedicated Manager'], deliveryDays: 30 },
    ],
    tags: ['seo', 'digital marketing', 'organic growth', 'search engine', 'ranking'],
    isFeatured: true,
  },
  {
    title: 'CRM/ERP Automation Solution',
    categoryName: 'Business Automation',
    subCategory: 'CRM/ERP Automation',
    description: 'Custom CRM and ERP automation tailored to your business processes. Automate sales pipelines, inventory management, invoicing, HR workflows, and more with seamless integrations.',
    shortDescription: 'Custom business process automation for CRM, ERP, and workflow management.',
    pricingTiers: [
      { name: 'Basic', price: 1999, features: ['Needs Analysis', 'Basic CRM Setup', 'Data Migration', 'User Training'], deliveryDays: 14 },
      { name: 'Standard', price: 4999, features: ['Custom CRM/ERP', 'Workflow Automation', 'Reporting', 'Email Integration', 'API Connections'], deliveryDays: 30 },
      { name: 'Premium', price: 9999, features: ['Enterprise Solution', 'AI-powered Insights', 'Multi-department', 'Custom Integrations', 'Ongoing Support'], deliveryDays: 45 },
    ],
    tags: ['crm', 'erp', 'automation', 'business process', 'workflow'],
  },
  {
    title: 'Professional 3D Walkthrough & Rendering',
    categoryName: '3D Architecture & Visualization',
    subCategory: 'Walkthrough Animations',
    description: 'Stunning 3D architectural visualization and walkthroughs for real estate, interior design, and product showcases. Photorealistic rendering with dynamic lighting and textures.',
    shortDescription: 'Photorealistic 3D architectural rendering and animated walkthroughs.',
    pricingTiers: [
      { name: 'Basic', price: 499, features: ['1 Room/Space', '3 High-Res Renderings', 'Basic Textures', '1 Revision'], deliveryDays: 7 },
      { name: 'Standard', price: 999, features: ['Full House/Apartment', '10 Renderings', '30sec Walkthrough', 'Photorealistic Textures'], deliveryDays: 14 },
      { name: 'Premium', price: 2499, features: ['Commercial Building', 'Unlimited Renders', '2min 4K Walkthrough', 'VR Compatible', 'Source Files'], deliveryDays: 21 },
    ],
    tags: ['3d rendering', 'architecture', 'walkthrough', 'visualization'],
  },
  {
    title: 'Modern UI/UX App Design',
    categoryName: 'UI/UX Design',
    subCategory: 'Mobile UI Design',
    description: 'User-centric UI/UX design for web and mobile applications. Wireframing, prototyping, and high-fidelity mockups designed in Figma with complete design systems.',
    shortDescription: 'Beautiful, intuitive UI/UX design for web and mobile apps using Figma.',
    pricingTiers: [
      { name: 'Basic', price: 399, features: ['Up to 5 Screens', 'Wireframing', 'Figma Source File', '2 Revisions'], deliveryDays: 7 },
      { name: 'Standard', price: 899, features: ['Up to 15 Screens', 'Interactive Prototype', 'Design System Basics', '5 Revisions'], deliveryDays: 14 },
      { name: 'Premium', price: 1999, features: ['Unlimited Screens', 'Full Design System', 'User Testing', 'Developer Handoff', 'Unlimited Revisions'], deliveryDays: 21 },
    ],
    tags: ['ui', 'ux', 'design', 'figma', 'prototyping'],
    isFeatured: true,
  },
  {
    title: 'Cinematic YouTube & Reel Editing',
    categoryName: 'Video Editing',
    subCategory: 'YouTube Editing',
    description: 'Professional video editing services for content creators and brands. Color grading, motion graphics, sound design, and cinematic transitions for YouTube, TikTok, and Reels.',
    shortDescription: 'Professional video editing with color grading and motion graphics.',
    pricingTiers: [
      { name: 'Basic', price: 149, features: ['Up to 5min Video', 'Basic Editing', 'Color Correction', '2 Revisions'], deliveryDays: 3 },
      { name: 'Standard', price: 349, features: ['Up to 15min Video', 'Motion Graphics', 'Sound Design', 'Subtitles'], deliveryDays: 7 },
      { name: 'Premium', price: 799, features: ['Documentary/Course', 'Cinematic Grading', 'Advanced Effects', 'Thumbnail Design', 'Unlimited Revisions'], deliveryDays: 14 },
    ],
    tags: ['video editing', 'youtube', 'premiere pro', 'reels', 'tiktok'],
  },
  {
    title: 'Advanced Excel & VBA Automation',
    categoryName: 'Excel Services',
    subCategory: 'VBA Macros',
    description: 'Transform your manual data work with advanced Excel automation. Custom VBA macros, dynamic financial models, data cleaning pipelines, and automated reporting dashboards.',
    shortDescription: 'Custom VBA macros, automated reports, and dynamic Excel dashboards.',
    pricingTiers: [
      { name: 'Basic', price: 99, features: ['Simple Macro/Formula', 'Data Formatting', 'Basic Dashboard', '1 Revision'], deliveryDays: 3 },
      { name: 'Standard', price: 299, features: ['Complex VBA Macro', 'Automated Report', 'Dynamic Dashboard', 'Data Cleaning'], deliveryDays: 7 },
      { name: 'Premium', price: 799, features: ['Full Application in Excel', 'API Integrations', 'Financial Modeling', 'User Form Interface'], deliveryDays: 14 },
    ],
    tags: ['excel', 'vba', 'automation', 'dashboard', 'data'],
    isFeatured: true,
  },
];

const sampleJobs = [
  {
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    description: 'We are looking for an experienced Frontend Developer to lead our UI development.',
    responsibilities: ['Build robust UIs using React', 'Collaborate with design team', 'Mentor junior developers'],
    requirements: ['5+ years React experience', 'Strong CSS/Tailwind skills', 'Experience with state management'],
    benefits: ['Competitive salary', 'Remote work', 'Health insurance'],
    salaryRange: '$90,000 - $130,000',
    type: 'Full-time',
    mode: 'Remote',
    location: 'Global',
    status: 'Active',
  },
  {
    title: 'Product Marketing Manager',
    department: 'Marketing',
    description: 'Join our marketing team to drive product growth and go-to-market strategies.',
    responsibilities: ['Develop GTM strategies', 'Market research', 'Create marketing collateral'],
    requirements: ['3+ years in B2B SaaS marketing', 'Strong analytical skills', 'Excellent writing'],
    benefits: ['Flexible hours', 'Performance bonuses', 'Team retreats'],
    salaryRange: '$80,000 - $110,000',
    type: 'Full-time',
    mode: 'Hybrid',
    location: 'New York, USA',
    status: 'Active',
  }
];

const sampleInternships = [
  {
    title: 'Software Engineering Intern',
    company: 'Velixora',
    department: 'Engineering',
    description: 'Great opportunity for students to gain hands-on experience in full-stack development.',
    responsibilities: ['Assist in API development', 'Write unit tests', 'Fix UI bugs'],
    requirements: ['Currently pursuing CS degree', 'Basic knowledge of JavaScript/React', 'Eagerness to learn'],
    perks: ['Mentorship from senior devs', 'Flexible hours', 'Letter of recommendation'],
    stipend: '$1,000/month',
    duration: '3 Months',
    mode: 'Remote',
    location: 'Global',
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1 month from now
    openings: 3,
    status: 'Active',
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Role.deleteMany({});
    await Category.deleteMany({});
    await Service.deleteMany({});
    await JobListing.deleteMany({});
    await InternshipListing.deleteMany({});
    logger.info('Cleared existing seed data');

    // Seed roles
    const createdRoles = await Role.insertMany(roles);
    logger.success(`Seeded ${createdRoles.length} roles`);

    // Seed categories
    const createdCategories = await Category.create(categories);
    logger.success(`Seeded ${createdCategories.length} categories`);

    // Create a category name → ID map
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Seed services
    const servicesWithCategoryIds = sampleServices.map((svc) => ({
      ...svc,
      category: categoryMap[svc.categoryName],
      categoryName: undefined,
    }));

    const createdServices = await Service.insertMany(servicesWithCategoryIds);
    logger.success(`Seeded ${createdServices.length} services`);

    // Check if dummy users exist, if not, create them
    const adminExists = await User.findOne({ email: 'admin@technova.com' });
    const superAdminRole = createdRoles.find(r => r.name === 'super_admin');
    
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@technova.com',
        password: 'password123',
        role: superAdminRole._id,
        isVerified: true,
        status: 'active'
      });
      logger.success('Seeded Dummy Admin User (admin@technova.com / password123)');
    } else {
      adminExists.role = superAdminRole._id;
      adminExists.password = 'password123';
      await adminExists.save();
      logger.success('Promoted existing admin@technova.com to super_admin and reset password to password123');
    }

    // Seed jobs
    const createdJobs = await JobListing.insertMany(sampleJobs);
    logger.success(`Seeded ${createdJobs.length} jobs`);

    // Seed internships
    const createdInternships = await InternshipListing.insertMany(sampleInternships);
    logger.success(`Seeded ${createdInternships.length} internships`);

    const clientExists = await User.findOne({ email: 'client@technova.com' });
    const clientRole = createdRoles.find(r => r.name === 'client');
    
    if (!clientExists) {
      await User.create({
        name: 'Demo Client',
        email: 'client@technova.com',
        password: 'password123',
        role: clientRole._id,
        isVerified: true,
        status: 'active'
      });
      logger.success('Seeded Dummy Client User (client@technova.com / password123)');
    } else {
      clientExists.role = clientRole._id;
      clientExists.password = 'password123';
      await clientExists.save();
      logger.success('Reset existing client@technova.com password to password123');
    }

    logger.success('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
