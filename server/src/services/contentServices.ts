import { Service } from '../models/Service'
import { CaseStudy } from '../models/CaseStudy'
import { Testimonial } from '../models/Misc'
import { ApiError } from '../utils/ApiError'
import { BlogPost } from '../models/BlogPost'
import { PostRevision } from '../models/PostRevision'
import { Category } from '../models/Category'
import { Tag } from '../models/Tag'
import { isValidObjectId } from 'mongoose'
import { sanitizeRichText, slugify } from '../utils/sanitize'
import { isMongoConnected } from '../config/db'

const FALLBACK_SERVICES = [
  {
    id: 'srv-1',
    title: 'Web Application Development',
    slug: 'web-application-development',
    summary: 'Fast, secure, and maintainable enterprise web applications built on modern frameworks.',
    description: 'We design and build full-stack web applications end-to-end — from interactive design systems to high-throughput REST/GraphQL APIs and production deployments that your internal team can easily maintain and extend.',
    benefits: ['Strict type-safety across client and server', 'Modular design systems that accelerate feature velocity', 'Sub-second load times with built-in performance budgets', 'Automated testing pipelines with continuous integration'],
    technologies: ['React', 'TypeScript', 'Node.js', 'Next.js', 'MySQL', 'TailwindCSS'],
    processSteps: [
      { title: 'Technical Discovery', description: 'Requirements mapping, architectural trade-offs, and data modeling.' },
      { title: 'System Architecture', description: 'Interactive wireframes, API contracts, and database schema specification.' },
      { title: 'Sprint-Based Build', description: 'Bi-weekly sprint demos with end-to-end visibility and continuous integration.' },
      { title: 'Production Deployment', description: 'Security audit, load testing, automated backups, and 30-day post-launch warranty.' },
    ],
    icon: 'Code2',
  },
  {
    id: 'srv-2',
    title: 'Mobile Application Development',
    slug: 'mobile-application-development',
    summary: 'High-performance cross-platform apps for iOS and Android from a unified codebase.',
    description: 'We engineer native-feeling mobile applications that operate smoothly on both iOS and Android, sharing reliable backend services and secure authentication with your web infrastructure.',
    benefits: ['Single maintainable codebase for iOS and Android', 'Offline-first synchronization with secure local storage', 'Optimized 60fps animations and native hardware integration', 'Turnkey App Store and Google Play compliance & deployment'],
    technologies: ['React Native', 'TypeScript', 'Expo', 'TailwindCSS', 'REST APIs'],
    processSteps: [
      { title: 'Device & UX Scoping', description: 'Defining target platforms, gesture flows, and offline constraints.' },
      { title: 'Interactive Prototype', description: 'Testing user journeys on actual physical devices before coding.' },
      { title: 'Iterative Engineering', description: 'Incremental feature delivery with automated weekly test builds.' },
      { title: 'App Store Submission', description: 'Store asset preparation, metadata optimization, and approval handling.' },
    ],
    icon: 'Smartphone',
  },
  {
    id: 'srv-3',
    title: 'Custom Software Solutions',
    slug: 'custom-software-solutions',
    summary: 'Tailor-made internal business platforms that automate complex organizational workflows.',
    description: 'When commercial off-the-shelf software restricts your operations, we build purpose-fit tools: custom ERPs, internal portals, billing systems, and automated data pipelines designed around your unique workflow.',
    benefits: ['Exact alignment with existing business processes', 'Zero recurring per-seat SaaS licensing costs', 'Complete intellectual property and source code ownership', 'Seamless integration with your legacy ERPs and third-party APIs'],
    technologies: ['Node.js', 'TypeScript', 'MySQL', 'Docker', 'Redis'],
    processSteps: [
      { title: 'Workflow Audit', description: 'Deep-dive into operational bottlenecks and manual spreadsheet tasks.' },
      { title: 'Solution Design', description: 'Database modeling and role-based permissions matrix.' },
      { title: 'Module Delivery', description: 'Delivering functional modules in phases to prevent operational disruption.' },
      { title: 'Team Handover', description: 'Comprehensive technical documentation and internal staff onboarding.' },
    ],
    icon: 'Wrench',
  },
  {
    id: 'srv-4',
    title: 'UI/UX Design Systems',
    slug: 'ui-ux-design',
    summary: 'Human-centered interfaces engineered for cognitive clarity and high task completion rates.',
    description: 'Our UI/UX design practice combines behavioral psychology, accessibility standards, and clean design tokens. We build interactive prototypes and scalable design systems that developers can implement without friction.',
    benefits: ['WCAG AAA accessible color palettes and typography scales', 'Comprehensive Figma component libraries and design tokens', 'Reduced user drop-off and friction across complex workflows', 'Seamless handoff with pixel-accurate CSS specifications'],
    technologies: ['Figma', 'Design Tokens', 'Vanilla CSS', 'Prototyping'],
    processSteps: [
      { title: 'User Research', description: 'Task analysis, user personas, and information architecture mapping.' },
      { title: 'Wireframing', description: 'Low-fidelity layout validation focusing on hierarchy and eye tracking.' },
      { title: 'Visual Systems', description: 'High-fidelity UI screens, micro-interactions, and responsive design.' },
      { title: 'Design Token Handoff', description: 'Direct token export to CSS variables for frictionless dev implementation.' },
    ],
    icon: 'PenTool',
  },
  {
    id: 'srv-5',
    title: 'Cloud & DevOps Engineering',
    slug: 'cloud-devops',
    summary: 'Resilient cloud infrastructure, automated CI/CD pipelines, and zero-downtime deployments.',
    description: 'We configure cloud environments, containerized deployments, automated database backups, and health monitoring so your production systems remain online, fast, and secure under peak traffic.',
    benefits: ['Automated zero-downtime CI/CD deployment pipelines', 'Isolated staging and production environments', 'Automated daily offsite MySQL database backups', 'Real-time uptime monitoring and incident alerting'],
    technologies: ['Docker', 'AWS', 'Hostinger Cloud', 'Cloudflare', 'GitHub Actions', 'Nginx'],
    processSteps: [
      { title: 'Infrastructure Audit', description: 'Security review of server configs, SSL, and network architecture.' },
      { title: 'Architecture Blueprint', description: 'Right-sized infrastructure plan designed for cost efficiency.' },
      { title: 'Pipeline Automation', description: 'Configuring automated builds, linting, tests, and deployments.' },
      { title: 'Runbook Transfer', description: 'Disaster recovery protocols and system access provided to client.' },
    ],
    icon: 'Cloud',
  },
  {
    id: 'srv-6',
    title: 'Enterprise API & Integrations',
    slug: 'enterprise-integrations',
    summary: 'Secure payment gateways, banking APIs, ERP connectors, and webhooks architecture.',
    description: 'Connect your core platform with critical third-party ecosystems: payment processing, ERPs, accounting software, SMS/Email notification rails, and webhooks with guaranteed delivery and idempotency.',
    benefits: ['Idempotent webhook handlers preventing duplicate transactions', 'Enterprise-grade cryptographic signature verification', 'High-throughput rate limiting and anti-abuse safeguards', 'Structured audit logging for full regulatory compliance'],
    technologies: ['Node.js', 'TypeScript', 'REST', 'Webhooks', 'JWT', 'Stripe', 'Banking Rails'],
    processSteps: [
      { title: 'API Contract Design', description: 'OpenAPI/Swagger documentation and schema validation.' },
      { title: 'Security Implementation', description: 'HMAC verification, rate-limiting, and encryption in transit.' },
      { title: 'Sandbox Testing', description: 'Simulated failure states, network timeouts, and reconciliation testing.' },
      { title: 'Go-Live Verification', description: 'Live transaction verification and monitoring dashboards.' },
    ],
    icon: 'Sparkles',
  },
]

const FALLBACK_CASE_STUDIES = [
  {
    id: 'cs-1',
    projectName: 'FinTech Multi-Rail Payment Engine',
    slug: 'fintech-payment-orchestrator',
    clientIndustry: 'Financial Technology',
    problem: 'A regional finance provider needed to unify disparate payment providers, reconcile transactional discrepancies, and handle high-volume checkout requests without duplicate debit incidents.',
    solution: 'Architected a high-concurrency Node.js and MySQL settlement gateway with distributed locking, cryptographic payload verification, and automated transaction reconciliation.',
    results: [
      '99.98% successful transaction completion rate across 400,000+ monthly requests',
      'Zero double-charge incidents achieved via idempotent payment tokens',
      'Decreased webhook processing latency from 2.4s to under 180ms',
    ],
    technologies: ['Node.js', 'TypeScript', 'MySQL', 'Docker', 'Redis', 'Cloudflare'],
    isPublished: true,
  },
  {
    id: 'cs-2',
    projectName: 'Enterprise Logistics & Dispatch Portal',
    slug: 'logistics-dispatch-portal',
    clientIndustry: 'Supply Chain & Freight',
    problem: 'Manual dispatch operations managed via fragmented spreadsheets caused delivery tracking blind spots, delayed driver assignments, and costly billing discrepancies.',
    solution: 'Engineered a centralized real-time web dispatch dashboard with live GPS route tracking, automated driver allocation algorithms, and client-facing status portals.',
    results: [
      'Reduced dispatch planning time from 4.5 hours daily to under 30 minutes',
      '38% reduction in misplaced consignments within the first quarter',
      'Full invoice automation eliminating billing cycle delays',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'MySQL', 'WebSockets', 'TailwindCSS'],
    isPublished: true,
  },
]

const FALLBACK_TESTIMONIALS = [
  {
    id: 't-1',
    quote: 'ORBIT-I delivered our core platform ahead of our critical launch window. Their engineering discipline and transparent technical communication set them apart from any software agency we have worked with.',
    authorName: 'Sarah Jenkins',
    authorRole: 'Chief Technology Officer',
    company: 'Apex Financial Technologies',
    isPublished: true,
  },
  {
    id: 't-2',
    quote: 'The architecture ORBIT-I built has scaled seamlessly across our largest traffic months with zero downtime. Clean code, comprehensive documentation, and zero technical debt.',
    authorName: 'Marcus Vance',
    authorRole: 'VP of Product',
    company: 'Logistics One Global',
    isPublished: true,
  },
]

const FALLBACK_BLOG_POSTS = [
  {
    id: 'bp-1',
    title: 'Why Strict TypeScript is Non-Negotiable for Mission-Critical Web Applications',
    slug: 'why-typescript-is-non-negotiable-for-production-apps',
    excerpt: 'How comprehensive end-to-end typing eliminates entire classes of runtime defects and accelerates refactoring speed in production software.',
    content: '<h2>The True Cost of Runtime Errors</h2><p>In modern enterprise web applications, runtime errors are not merely inconveniences — they cause abandoned shopping carts, failed transactions, and loss of user trust.</p><h2>End-to-End Type Safety</h2><p>At ORBIT-I, we mandate strict TypeScript across both our frontend user interfaces and our Node.js backend services.</p>',
    category: { id: 'cat-1', name: 'Software Architecture', slug: 'software-architecture' },
    tags: [
      { id: 'tag-1', name: 'TypeScript', slug: 'typescript' },
      { id: 'tag-2', name: 'Best Practices', slug: 'best-practices' },
    ],
    publishedAt: new Date('2026-09-15'),
    status: 'published',
    views: 1420,
    author: { id: 'usr-1', fullName: 'ORBIT-I Engineering Team' },
  },
  {
    id: 'bp-2',
    title: 'Designing Cloud Architecture for Scale: Practical Lessons from High-Traffic Systems',
    slug: 'designing-for-scale-from-day-one',
    excerpt: 'Key architectural patterns for designing resilient database connections, caching layers, and decoupled services that thrive under peak concurrency.',
    content: '<h2>Avoiding the Monolith Trap</h2><p>Scalability does not require immediately adopting hundreds of microservices. A modular monolith with clean domain boundaries and optimized database indexes outperforms poorly coordinated microservices every time.</p>',
    category: { id: 'cat-2', name: 'Cloud & Infrastructure', slug: 'cloud-infrastructure' },
    tags: [
      { id: 'tag-3', name: 'Scalability', slug: 'scalability' },
      { id: 'tag-4', name: 'MySQL', slug: 'mysql' },
    ],
    publishedAt: new Date('2026-09-10'),
    status: 'published',
    views: 980,
    author: { id: 'usr-1', fullName: 'ORBIT-I Architecture Team' },
  },
]

export const serviceContentService = {
  async list() {
    if (!isMongoConnected()) return FALLBACK_SERVICES
    return Service.find().sort({ createdAt: -1 })
  },
  async getBySlug(slug: string) {
    if (!isMongoConnected()) {
      const match = FALLBACK_SERVICES.find((s) => s.slug === slug)
      if (match) return match
      return FALLBACK_SERVICES[0]
    }
    const service = await Service.findOne({ slug })
    if (!service) throw ApiError.notFound('Service not found')
    return service
  },
  async create(data: Record<string, unknown>) {
    return Service.create(data)
  },
  async update(id: string, data: Record<string, unknown>) {
    const service = await Service.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    if (!service) throw ApiError.notFound('Service not found')
    return service
  },
  async remove(id: string) {
    const service = await Service.findByIdAndDelete(id)
    if (!service) throw ApiError.notFound('Service not found')
  },
}

export const caseStudyService = {
  async list() {
    if (!isMongoConnected()) return FALLBACK_CASE_STUDIES
    return CaseStudy.find({ isPublished: true }).sort({ createdAt: -1 })
  },
  async listAll() {
    if (!isMongoConnected()) return FALLBACK_CASE_STUDIES
    return CaseStudy.find().sort({ createdAt: -1 })
  },
  async getBySlug(slug: string) {
    if (!isMongoConnected()) {
      const match = FALLBACK_CASE_STUDIES.find((cs) => cs.slug === slug)
      if (match) return match
      return FALLBACK_CASE_STUDIES[0]
    }
    const caseStudy = await CaseStudy.findOne({ slug })
    if (!caseStudy) throw ApiError.notFound('Case study not found')
    return caseStudy
  },
  async create(data: Record<string, unknown>) {
    const payload = { ...data }
    if (typeof payload.content === 'string') payload.content = sanitizeRichText(payload.content)
    return CaseStudy.create(payload)
  },
  async update(id: string, data: Record<string, unknown>) {
    const payload = { ...data }
    if (typeof payload.content === 'string') payload.content = sanitizeRichText(payload.content)
    const caseStudy = await CaseStudy.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
    if (!caseStudy) throw ApiError.notFound('Case study not found')
    return caseStudy
  },
  async remove(id: string) {
    const caseStudy = await CaseStudy.findByIdAndDelete(id)
    if (!caseStudy) throw ApiError.notFound('Case study not found')
  },
}

export const blogPostService = {
  async list(query: { category?: string; tag?: string; search?: string; page?: number; limit?: number; includeDrafts?: boolean }) {
    const page = Math.max(1, query.page ?? 1)
    const limit = Math.min(50, Math.max(1, query.limit ?? 12))

    if (!isMongoConnected()) {
      let filtered = [...FALLBACK_BLOG_POSTS]
      if (query.search) {
        const s = query.search.toLowerCase()
        filtered = filtered.filter((p) => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s))
      }
      return { items: filtered, page, totalItems: filtered.length, totalPages: 1 }
    }

    await BlogPost.updateMany({ status: 'scheduled', scheduledAt: { $lte: new Date() } }, { $set: { status: 'published', publishedAt: new Date() } })
    const filter: Record<string, unknown> = query.includeDrafts ? {} : { $or: [{ status: 'published' }, { status: 'scheduled', scheduledAt: { $lte: new Date() } }] }
    if (query.category) {
      const category = await Category.findOne(isValidObjectId(query.category) ? { $or: [{ _id: query.category }, { slug: query.category }] } : { slug: query.category }).select('_id')
      if (!category) return { items: [], page, totalItems: 0, totalPages: 0 }
      filter.category = category.id
    }
    if (query.tag) {
      const tag = await Tag.findOne(isValidObjectId(query.tag) ? { $or: [{ _id: query.tag }, { slug: query.tag }] } : { slug: query.tag }).select('_id')
      if (!tag) return { items: [], page, totalItems: 0, totalPages: 0 }
      filter.tags = tag.id
    }
    if (query.search) {
      const expression = new RegExp(query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      const visibility = filter.$or
      delete filter.$or
      filter.$and = visibility
        ? [{ $or: visibility }, { $or: [{ title: expression }, { excerpt: expression }, { content: expression }] }]
        : [{ $or: [{ title: expression }, { excerpt: expression }, { content: expression }] }]
    }
    const [items, totalItems] = await Promise.all([
      BlogPost.find(filter).populate('category tags author', 'name slug fullName').sort({ publishedAt: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      BlogPost.countDocuments(filter),
    ])
    return { items, page, totalItems, totalPages: Math.ceil(totalItems / limit) }
  },
  async getBySlug(slug: string, includeDrafts = false) {
    if (!isMongoConnected()) {
      const match = FALLBACK_BLOG_POSTS.find((p) => p.slug === slug)
      if (match) return match
      return FALLBACK_BLOG_POSTS[0]
    }
    await BlogPost.updateMany({ status: 'scheduled', scheduledAt: { $lte: new Date() } }, { $set: { status: 'published', publishedAt: new Date() } })
    const filter: Record<string, unknown> = { slug }
    if (!includeDrafts) filter.status = 'published'
    const post = await BlogPost.findOne(filter).populate('category tags author', 'name slug fullName')
    if (!post) throw ApiError.notFound('Blog post not found')
    if (!includeDrafts) await BlogPost.updateOne({ _id: post.id }, { $inc: { views: 1 } })
    return post
  },
  async create(data: Record<string, any>, author: string) {
    const payload: Record<string, any> = { ...data, slug: data.slug || slugify(data.title), author, content: sanitizeRichText(data.content) }
    if (payload.status === 'published' && !payload.publishedAt) payload.publishedAt = new Date()
    if (payload.status === 'scheduled' && !payload.scheduledAt) throw ApiError.badRequest('Scheduled posts require a scheduled time')
    return BlogPost.create(payload)
  },
  async update(id: string, data: Record<string, any>, changedBy?: string, reason: 'save' | 'autosave' | 'restore' = 'save') {
    const previous = await BlogPost.findById(id)
    if (!previous) throw ApiError.notFound('Blog post not found')
    if (changedBy && (data.title || data.excerpt || data.content)) {
      await PostRevision.create({ post: previous.id, title: previous.title, excerpt: previous.excerpt, content: previous.content, changedBy, reason })
    }
    const payload = { ...data }
    if (payload.title && !payload.slug) payload.slug = slugify(payload.title)
    if (payload.content) payload.content = sanitizeRichText(payload.content)
    if (payload.status === 'published' && !payload.publishedAt) payload.publishedAt = new Date()
    if (payload.status === 'scheduled' && !payload.scheduledAt) throw ApiError.badRequest('Scheduled posts require a scheduled time')
    const post = await BlogPost.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate('category tags author', 'name slug fullName')
    if (!post) throw ApiError.notFound('Blog post not found')
    return post
  },
  async remove(id: string) {
    const post = await BlogPost.findByIdAndDelete(id)
    if (!post) throw ApiError.notFound('Blog post not found')
  },
  async setPublished(id: string, published: boolean) {
    const post = await BlogPost.findByIdAndUpdate(
      id,
      { status: published ? 'published' : 'draft', publishedAt: published ? new Date() : undefined },
      { new: true, runValidators: true },
    )
    if (!post) throw ApiError.notFound('Blog post not found')
    return post
  },
  async duplicate(id: string, author: string) {
    const post = await BlogPost.findById(id).lean()
    if (!post) throw ApiError.notFound('Blog post not found')
    const { _id, createdAt, updatedAt, slug, ...copy } = post
    const duplicateSlug = `${slug}-copy-${Date.now().toString(36)}`
    return BlogPost.create({ ...copy, title: `${post.title} (Copy)`, slug: duplicateSlug, author, status: 'draft', publishedAt: undefined, scheduledAt: undefined })
  },
  async revisions(id: string) {
    return PostRevision.find({ post: id }).populate('changedBy', 'fullName').sort({ createdAt: -1 }).limit(50)
  },
  async restoreRevision(id: string, revisionId: string, changedBy: string) {
    const revision = await PostRevision.findOne({ _id: revisionId, post: id })
    if (!revision) throw ApiError.notFound('Revision not found')
    return this.update(id, { title: revision.title, excerpt: revision.excerpt, content: revision.content }, changedBy, 'restore')
  },
}

export const testimonialService = {
  async list() {
    if (!isMongoConnected()) return FALLBACK_TESTIMONIALS
    return Testimonial.find({ isPublished: true }).sort({ createdAt: -1 })
  },
  async listAll() {
    if (!isMongoConnected()) return FALLBACK_TESTIMONIALS
    return Testimonial.find().sort({ createdAt: -1 })
  },
  async create(data: Record<string, unknown>) {
    return Testimonial.create(data)
  },
  async update(id: string, data: Record<string, unknown>) {
    const testimonial = await Testimonial.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    if (!testimonial) throw ApiError.notFound('Testimonial not found')
    return testimonial
  },
  async remove(id: string) {
    const testimonial = await Testimonial.findByIdAndDelete(id)
    if (!testimonial) throw ApiError.notFound('Testimonial not found')
  },
}
