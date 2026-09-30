"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
const User_1 = require("../models/User");
const Category_1 = require("../models/Category");
const Product_1 = require("../models/Product");
const Service_1 = require("../models/Service");
const CaseStudy_1 = require("../models/CaseStudy");
const Misc_1 = require("../models/Misc");
const Job_1 = require("../models/Job");
const TeamMember_1 = require("../models/TeamMember");
const roles_1 = require("../constants/roles");
const node_dns_1 = __importDefault(require("node:dns"));
node_dns_1.default.setServers(["8.8.8.8"]);
async function seed() {
    await (0, db_1.connectDatabase)();
    console.log('[seed] connected — clearing existing content collections...');
    await Promise.all([
        Category_1.Category.deleteMany({}),
        Product_1.Product.deleteMany({}),
        Service_1.Service.deleteMany({}),
        CaseStudy_1.CaseStudy.deleteMany({}),
        Misc_1.Testimonial.deleteMany({}),
        Job_1.Job.deleteMany({}),
        TeamMember_1.TeamMember.deleteMany({}),
    ]);
    // --- Admin user --------------------------------------------------------
    const adminEmail = 'admin@orbit-i.com';
    const existingAdmin = await User_1.User.findOne({ email: adminEmail });
    if (!existingAdmin) {
        const passwordHash = await bcryptjs_1.default.hash('OrbitAdmin#2026', 12);
        await User_1.User.create({
            fullName: 'ORBIT-I Admin',
            email: adminEmail,
            passwordHash,
            role: roles_1.ROLES.SUPER_ADMIN,
            isVerified: true,
            isActive: true,
        });
        console.log(`[seed] created admin user: ${adminEmail} / OrbitAdmin#2026`);
    }
    else {
        console.log('[seed] admin user already exists, skipping');
    }
    // --- Categories ----------------------------------------------------------
    const categories = await Category_1.Category.insertMany([
        { name: 'Business Tools', slug: 'business-tools' },
        { name: 'Productivity', slug: 'productivity' },
    ]);
    const businessTools = categories.find((c) => c.slug === 'business-tools');
    const productivity = categories.find((c) => c.slug === 'productivity');
    // --- Products ----------------------------------------------------------
    await Product_1.Product.insertMany([
        {
            name: 'Orbit CRM',
            slug: 'orbit-crm',
            category: businessTools._id,
            shortDescription: 'A lightweight CRM built for small technical teams.',
            description: 'Orbit CRM gives small teams a single place to track leads, deals, and client communication without the overhead of enterprise CRM software. Built to be set up in an afternoon, not a quarter.',
            images: [],
            features: ['Pipeline & deal tracking', 'Email activity timeline', 'Custom fields & tags', 'Team-level permissions'],
            price: 29,
            currency: 'USD',
            status: 'available',
        },
        {
            name: 'Orbit Forms',
            slug: 'orbit-forms',
            category: productivity._id,
            shortDescription: 'Form builder with logic branching and native integrations.',
            description: 'Build forms with conditional logic, file uploads, and payment collection — then connect the results directly to your existing tools via webhook or native integration.',
            images: [],
            features: ['Conditional logic branching', 'File upload fields', 'Webhook & API integration', 'Response analytics'],
            price: 15,
            currency: 'USD',
            status: 'available',
        },
        {
            name: 'Orbit Track',
            slug: 'orbit-track',
            category: businessTools._id,
            shortDescription: 'Project and milestone tracking built for client-facing teams.',
            description: 'Orbit Track gives agencies and service teams a shared view of project progress that clients can see too — milestones, timelines, and updates in one place.',
            images: [],
            features: ['Client-visible milestones', 'Timeline & Gantt view', 'File & document sharing', 'Status update feed'],
            price: 39,
            currency: 'USD',
            status: 'coming_soon',
        },
    ]);
    // --- Services ----------------------------------------------------------
    await Service_1.Service.insertMany([
        {
            title: 'Web Application Development',
            slug: 'web-application-development',
            summary: 'Fast, maintainable web applications built on modern frameworks.',
            description: 'We design and build web applications end to end — from the first architecture diagram to a production deployment your team can maintain. Every build is typed, tested, and structured to scale with your roadmap.',
            benefits: [
                'Type-safe codebase from day one',
                'Component systems your team can extend',
                'Performance budgets built into the process',
            ],
            technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'MongoDB'],
            processSteps: [
                { title: 'Discovery', description: 'We map your requirements, users, and technical constraints.' },
                { title: 'Architecture', description: 'A system design you can review before a line of code is written.' },
                { title: 'Build', description: 'Iterative development with visibility into progress at every stage.' },
                { title: 'Launch & support', description: 'A deployment plan and a support window after go-live.' },
            ],
            icon: 'Code2',
        },
        {
            title: 'Mobile Application Development',
            slug: 'mobile-application-development',
            summary: 'Native-feeling apps for iOS and Android from a single codebase.',
            description: 'We build cross-platform mobile applications that feel native on both iOS and Android, backed by the same API architecture as your web platform.',
            benefits: ['Single codebase for iOS & Android', 'Shared API layer with your web app', 'App store submission support'],
            technologies: ['React Native', 'TypeScript', 'Expo'],
            processSteps: [
                { title: 'Discovery', description: 'Defining platform scope, offline needs, and device constraints.' },
                { title: 'Prototype', description: 'A clickable prototype before full build begins.' },
                { title: 'Build', description: 'Feature development with continuous device testing.' },
                { title: 'Release', description: 'Store listing, submission, and post-launch monitoring.' },
            ],
            icon: 'Smartphone',
        },
        {
            title: 'Custom Software Solutions',
            slug: 'custom-software-solutions',
            summary: 'Purpose-built internal tools and platforms for specific workflows.',
            description: 'When off-the-shelf software does not fit how your team actually works, we build the tool that does — internal platforms, automation systems, and workflow software tailored to your operations.',
            benefits: ['Software matched to your actual process', 'No unnecessary licensing overhead', 'Built for your team to own long-term'],
            technologies: ['Node.js', 'TypeScript', 'MongoDB', 'Docker'],
            processSteps: [
                { title: 'Process mapping', description: 'Understanding the workflow the software needs to support.' },
                { title: 'Design', description: 'Interfaces built around how your team already works.' },
                { title: 'Build', description: 'Incremental delivery so you can test as we go.' },
                { title: 'Handover', description: 'Documentation and training for internal ownership.' },
            ],
            icon: 'Wrench',
        },
        {
            title: 'UI/UX Design',
            slug: 'ui-ux-design',
            summary: 'Interfaces designed around what your users actually need to do.',
            description: 'Our design process starts with the task, not the template — wireframes, prototypes, and a design system that your engineering team can implement without guesswork.',
            benefits: ['Design systems ready for engineering handoff', 'Usability-tested prototypes', 'Accessible by default'],
            technologies: ['Figma', 'Design Tokens', 'Prototyping'],
            processSteps: [
                { title: 'Research', description: 'Understanding your users and their real tasks.' },
                { title: 'Wireframes', description: 'Structure and flow before visual design begins.' },
                { title: 'Visual design', description: 'A design system tied to your brand.' },
                { title: 'Handoff', description: 'Developer-ready specs and assets.' },
            ],
            icon: 'PenTool',
        },
        {
            title: 'Cloud & DevOps',
            slug: 'cloud-devops',
            summary: 'Infrastructure and deployment pipelines built for reliability.',
            description: 'We set up cloud infrastructure and CI/CD pipelines that make deployment routine instead of risky — with monitoring and rollback built in from the start.',
            benefits: ['Automated CI/CD pipelines', 'Infrastructure as code', 'Monitoring and alerting from day one'],
            technologies: ['Docker', 'AWS', 'GitHub Actions', 'Nginx'],
            processSteps: [
                { title: 'Audit', description: 'Reviewing your current infrastructure and deployment process.' },
                { title: 'Design', description: 'A cloud architecture matched to your scale and budget.' },
                { title: 'Implementation', description: 'Setting up pipelines, environments, and monitoring.' },
                { title: 'Handover', description: 'Runbooks and access transferred to your team.' },
            ],
            icon: 'Cloud',
        },
        {
            title: 'AI & Automation',
            slug: 'ai-automation',
            summary: 'Practical automation and AI features that solve a specific problem.',
            description: 'We integrate AI and automation where it removes real manual work — document processing, intelligent search, workflow automation — grounded in your actual data.',
            benefits: ['Automation scoped to measurable time savings', 'Built on your own data, not generic demos', 'Clear evaluation before rollout'],
            technologies: ['Python', 'Node.js', 'Vector Search', 'REST APIs'],
            processSteps: [
                { title: 'Problem scoping', description: 'Identifying the specific manual process worth automating.' },
                { title: 'Prototype', description: 'A working proof of concept on real sample data.' },
                { title: 'Evaluation', description: 'Measuring accuracy and impact before full rollout.' },
                { title: 'Integration', description: 'Wiring the automation into your existing systems.' },
            ],
            icon: 'Sparkles',
        },
    ]);
    // --- Case studies --------------------------------------------------------
    await CaseStudy_1.CaseStudy.insertMany([
        {
            projectName: 'Regional Logistics Dispatch Platform',
            slug: 'regional-logistics-dispatch-platform',
            clientIndustry: 'Logistics',
            problem: 'A regional logistics operator was coordinating dispatch through spreadsheets and phone calls, causing delayed pickups and no visibility into driver location.',
            solution: 'We built a dispatch platform with real-time driver tracking, automated route assignment, and a client-facing tracking page — replacing manual coordination entirely.',
            technologies: ['React', 'Node.js', 'MongoDB', 'WebSockets'],
            results: [
                'Average dispatch time reduced significantly',
                'Eliminated manual route assignment',
                'Added a client-facing shipment tracking page',
            ],
            coverImage: '',
        },
        {
            projectName: 'Multi-Store Inventory Sync',
            slug: 'multi-store-inventory-sync',
            clientIndustry: 'Retail',
            problem: 'A multi-location retailer had no unified view of stock across stores, leading to overselling and manual reconciliation at month-end.',
            solution: 'We built a centralized inventory system with real-time sync across POS terminals and a manager dashboard for stock transfers between locations.',
            technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
            results: [
                'Unified stock visibility across all locations',
                'Removed manual month-end reconciliation',
                'Faster inter-store transfer workflow',
            ],
            coverImage: '',
        },
    ]);
    // --- Testimonials --------------------------------------------------------
    await Misc_1.Testimonial.insertMany([
        {
            authorName: 'Amina Raza',
            authorRole: 'Operations Lead',
            company: 'Regional logistics client',
            quote: 'The dispatch platform they built replaced a process that used to take our team hours every morning. It just works now.',
        },
        {
            authorName: 'Farhan Sheikh',
            authorRole: 'Store Operations Manager',
            company: 'Multi-store retail client',
            quote: 'We finally have one number for stock across every location instead of five different spreadsheets.',
        },
    ]);
    // --- Jobs ----------------------------------------------------------
    await Job_1.Job.insertMany([
        {
            title: 'Full-Stack Engineer',
            slug: 'full-stack-engineer',
            department: 'Engineering',
            location: 'Remote',
            employmentType: 'full_time',
            experience: '2-4 years',
            description: 'We are looking for a full-stack engineer comfortable across React/TypeScript on the frontend and Node.js/MongoDB on the backend to work directly on client projects.',
            requirements: [
                'Solid experience with React and TypeScript',
                'Experience building REST APIs with Node.js',
                'Comfortable working directly with clients on requirements',
            ],
            responsibilities: [
                'Build and maintain features across the stack',
                'Participate in architecture and code review',
                'Work directly with clients during discovery',
            ],
            isOpen: true,
        },
        {
            title: 'Product Designer',
            slug: 'product-designer',
            department: 'Design',
            location: 'Remote',
            employmentType: 'full_time',
            experience: '2+ years',
            description: 'We are looking for a product designer to own UI/UX across client projects, from wireframes through to developer handoff.',
            requirements: ['Strong portfolio of shipped product work', 'Comfortable in Figma and design systems', 'Understands accessibility basics'],
            responsibilities: ['Lead design on client projects', 'Maintain and extend our internal design system', 'Collaborate closely with engineering'],
            isOpen: true,
        },
    ]);
    // --- Team members --------------------------------------------------------
    // Placeholder entries only — replace with real team information via the
    // admin dashboard (Team section) before production launch.
    await TeamMember_1.TeamMember.insertMany([
        {
            name: 'Founding Engineer',
            designation: 'Co-Founder & Engineering Lead',
            bio: 'Leads architecture and delivery across ORBIT-I client projects, with a focus on typed, maintainable systems.',
            skills: ['React', 'Node.js', 'System Design'],
            order: 1,
        },
        {
            name: 'Founding Designer',
            designation: 'Co-Founder & Design Lead',
            bio: 'Owns product design across ORBIT-I engagements, from early wireframes through to developer handoff.',
            skills: ['UI/UX', 'Design Systems', 'Prototyping'],
            order: 2,
        },
    ]);
    console.log('[seed] done — categories, products, services, case studies, testimonials, jobs, team created');
    await (0, db_1.disconnectDatabase)();
    process.exit(0);
}
seed().catch((error) => {
    console.error('[seed] failed', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map