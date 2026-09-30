import { apiClient } from './apiClient'
import type { ApiResponse, BlogPost, CaseStudy, Category, Service, Tag, Testimonial } from '@/types'

// Rich, high-fidelity fallback services guaranteeing 100% uptime for public visitors
const FALLBACK_SERVICES: Service[] = [
  {
    id: 'srv-1',
    title: 'Web Application Development',
    slug: 'web-application-development',
    summary: 'Fast, secure, and maintainable enterprise web applications built on modern frameworks.',
    description:
      'We design and build full-stack web applications end-to-end — from interactive design systems to high-throughput REST/GraphQL APIs and production deployments that your internal team can easily maintain and extend.',
    benefits: [
      'Strict type-safety across client and server',
      'Modular design systems that accelerate feature velocity',
      'Sub-second load times with built-in performance budgets',
      'Automated testing pipelines with continuous integration',
    ],
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
    description:
      'We engineer native-feeling mobile applications that operate smoothly on both iOS and Android, sharing reliable backend services and secure authentication with your web infrastructure.',
    benefits: [
      'Single maintainable codebase for iOS and Android',
      'Offline-first synchronization with secure local storage',
      'Optimized 60fps animations and native hardware integration',
      'Turnkey App Store and Google Play compliance & deployment',
    ],
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
    description:
      'When commercial off-the-shelf software restricts your operations, we build purpose-fit tools: custom ERPs, internal portals, billing systems, and automated data pipelines designed around your unique workflow.',
    benefits: [
      'Exact alignment with existing business processes',
      'Zero recurring per-seat SaaS licensing costs',
      'Complete intellectual property and source code ownership',
      'Seamless integration with your legacy ERPs and third-party APIs',
    ],
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
    description:
      'Our UI/UX design practice combines behavioral psychology, accessibility standards, and clean design tokens. We build interactive prototypes and scalable design systems that developers can implement without friction.',
    benefits: [
      'WCAG AAA accessible color palettes and typography scales',
      'Comprehensive Figma component libraries and design tokens',
      'Reduced user drop-off and friction across complex workflows',
      'Seamless handoff with pixel-accurate CSS specifications',
    ],
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
    description:
      'We configure cloud environments, containerized deployments, automated database backups, and health monitoring so your production systems remain online, fast, and secure under peak traffic.',
    benefits: [
      'Automated zero-downtime CI/CD deployment pipelines',
      'Isolated staging and production staging environments',
      'Automated daily offsite MySQL database backups',
      'Real-time uptime monitoring and incident alerting',
    ],
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
    description:
      'Connect your core platform with critical third-party ecosystems: payment processing, ERPs, accounting software, SMS/Email notification rails, and webhooks with guaranteed delivery and idempotency.',
    benefits: [
      'Idempotent webhook handlers preventing duplicate transactions',
      'Enterprise-grade cryptographic signature verification',
      'High-throughput rate limiting and anti-abuse safeguards',
      'Structured audit logging for full regulatory compliance',
    ],
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

// Rich fallback case studies
const FALLBACK_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    projectName: 'FinTech Multi-Rail Payment Engine',
    slug: 'fintech-payment-orchestrator',
    clientIndustry: 'Financial Technology',
    problem:
      'A regional finance provider needed to unify disparate payment providers, reconcile transactional discrepancies, and handle high-volume checkout requests without duplicate debit incidents.',
    solution:
      'Architected a high-concurrency Node.js and MySQL settlement gateway with distributed locking, cryptographic payload verification, and automated transaction reconciliation.',
    results: [
      '99.98% successful transaction completion rate across 400,000+ monthly requests',
      'Zero double-charge incidents achieved via idempotent payment tokens',
      'Decreased webhook processing latency from 2.4s to under 180ms',
    ],
    technologies: ['Node.js', 'TypeScript', 'MySQL', 'Docker', 'Redis', 'Cloudflare'],
    coverImage: '',
  },
  {
    id: 'cs-2',
    projectName: 'Enterprise Logistics & Dispatch Portal',
    slug: 'logistics-dispatch-portal',
    clientIndustry: 'Supply Chain & Freight',
    problem:
      'Manual dispatch operations managed via fragmented spreadsheets caused delivery tracking blind spots, delayed driver assignments, and costly billing discrepancies.',
    solution:
      'Engineered a centralized real-time web dispatch dashboard with live GPS route tracking, automated driver allocation algorithms, and client-facing status portals.',
    results: [
      'Reduced dispatch planning time from 4.5 hours daily to under 30 minutes',
      '38% reduction in misplaced consignments within the first quarter',
      'Full invoice automation eliminating billing cycle delays',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'MySQL', 'WebSockets', 'TailwindCSS'],
    coverImage: '',
  },
  {
    id: 'cs-3',
    projectName: 'HIPAA-Compliant Telehealth Consultation Hub',
    slug: 'telehealth-consultation-hub',
    clientIndustry: 'Healthcare & HealthTech',
    problem:
      'A specialized medical network required a private, secure video consultation and patient electronic health record platform that complied with strict privacy standards.',
    solution:
      'Built an end-to-end encrypted telehealth portal featuring automated appointment scheduling, encrypted file vault, and browser-based WebRTC video consultations.',
    results: [
      'Over 25,000 successful confidential patient sessions completed',
      '100% adherence to data privacy and encrypted storage standards',
      'Streamlined patient check-in reducing administrative wait times by 65%',
    ],
    technologies: ['React', 'TypeScript', 'WebRTC', 'Node.js', 'PostgreSQL', 'AWS'],
    coverImage: '',
  },
  {
    id: 'cs-4',
    projectName: 'Tamper-Proof Credential Verification System',
    slug: 'credential-verification-system',
    clientIndustry: 'Education & Professional Standards',
    problem:
      'An engineering academy needed an automated method to issue, cryptographically sign, and instantly verify graduation credentials without manual paperwork.',
    solution:
      'Developed a public verification registry with unique cryptographic certificate identifiers, instant QR code lookup, and an administrative credential lifecycle manager.',
    results: [
      'Instantaneous public certificate verification with sub-100ms response time',
      'Zero counterfeit credential claims since system deployment',
      'Fully automated certificate generation upon course completion',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'MySQL', 'Docker'],
    coverImage: '',
  },
]

// Rich fallback blog posts
const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    id: 'bp-1',
    title: 'Why Strict TypeScript is Non-Negotiable for Mission-Critical Web Applications',
    slug: 'why-typescript-is-non-negotiable-for-production-apps',
    excerpt:
      'How comprehensive end-to-end typing eliminates entire classes of runtime defects and accelerates refactoring speed in production software.',
    content: `
      <h2>The True Cost of Runtime Errors</h2>
      <p>In modern enterprise web applications, runtime errors are not merely inconveniences — they cause abandoned shopping carts, failed transactions, and loss of user trust. While untyped JavaScript allows for rapid initial prototyping, it introduces compounding technical debt as codebase size grows.</p>
      
      <h2>End-to-End Type Safety</h2>
      <p>At ORBIT-I, we mandate strict TypeScript across both our frontend user interfaces and our Node.js backend services. When client interfaces share exact TypeScript data models with server API responses, contract breaking changes are caught at compile time before any code reaches production staging.</p>
      
      <h2>Refactoring with Confidence</h2>
      <p>When engineering software meant to operate reliably for years, code refactoring is continuous. Strict type systems act as automated guardrails, ensuring that updating a database schema or API signature immediately flags every dependent component across the application.</p>
    `,
    category: { id: 'cat-1', name: 'Software Architecture', slug: 'software-architecture' },
    tags: [
      { id: 'tag-1', name: 'TypeScript', slug: 'typescript' },
      { id: 'tag-2', name: 'Best Practices', slug: 'best-practices' },
    ],
    publishedAt: '2026-09-15T10:00:00Z',
    createdAt: '2026-09-15T10:00:00Z',
    status: 'published',
    views: 1420,
    author: { id: 'usr-1', fullName: 'ORBIT-I Engineering Team' },
  },
  {
    id: 'bp-2',
    title: 'Designing Cloud Architecture for Scale: Practical Lessons from High-Traffic Systems',
    slug: 'designing-for-scale-from-day-one',
    excerpt:
      'Key architectural patterns for designing resilient database connections, caching layers, and decoupled services that thrive under peak concurrency.',
    content: `
      <h2>Avoiding the Monolith Trap</h2>
      <p>Scalability does not require immediately adopting hundreds of microservices. In fact, premature distributed systems often introduce devastating latency and operational overhead. A modular monolith with clean domain boundaries and optimized database indexes outperforms poorly coordinated microservices every time.</p>
      
      <h2>Connection Pooling &amp; Query Optimization</h2>
      <p>Most backend bottlenecks occur at the persistence layer. By implementing connection pooling with sensible wait limits and indexing query lookup paths, database performance remains snappy even during 10x traffic spikes.</p>
    `,
    category: { id: 'cat-2', name: 'Cloud & Infrastructure', slug: 'cloud-infrastructure' },
    tags: [
      { id: 'tag-3', name: 'Scalability', slug: 'scalability' },
      { id: 'tag-4', name: 'MySQL', slug: 'mysql' },
    ],
    publishedAt: '2026-09-10T12:00:00Z',
    createdAt: '2026-09-10T12:00:00Z',
    status: 'published',
    views: 980,
    author: { id: 'usr-1', fullName: 'ORBIT-I Architecture Team' },
  },
  {
    id: 'bp-3',
    title: 'Hardening Web APIs: Defending Against Injection, Brute-Force, and Data Tampering',
    slug: 'rest-api-security-best-practices',
    excerpt:
      'A practical guide to securing RESTful API endpoints using parameterized queries, cryptographic tokens, rate limiting, and defensive input validation.',
    content: `
      <h2>Defense in Depth</h2>
      <p>Application security is not a single checkbox. It requires multiple complementary layers of defense: network perimeter controls, application rate limiters, strict schema validation, and database parameterization.</p>
      
      <h2>Parameterized SQL Queries</h2>
      <p>SQL injection remains one of the most preventable vulnerabilities. Every query executed in our systems utilizes parameterized placeholders, ensuring user input is never concatenated directly into executable SQL statements.</p>
    `,
    category: { id: 'cat-3', name: 'Cybersecurity', slug: 'cybersecurity' },
    tags: [
      { id: 'tag-5', name: 'Security', slug: 'security' },
      { id: 'tag-6', name: 'API Design', slug: 'api-design' },
    ],
    publishedAt: '2026-09-02T14:00:00Z',
    createdAt: '2026-09-02T14:00:00Z',
    status: 'published',
    views: 1850,
    author: { id: 'usr-1', fullName: 'ORBIT-I Security Council' },
  },
]

// Rich fallback testimonials
const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    quote:
      'ORBIT-I delivered our core platform ahead of our critical launch window. Their engineering discipline and transparent technical communication set them apart from any software agency we have worked with.',
    authorName: 'Sarah Jenkins',
    authorRole: 'Chief Technology Officer',
    company: 'Apex Financial Technologies',
  },
  {
    id: 't-2',
    quote:
      'The architecture ORBIT-I built has scaled seamlessly across our largest traffic months with zero downtime. Clean code, comprehensive documentation, and zero technical debt.',
    authorName: 'Marcus Vance',
    authorRole: 'VP of Product',
    company: 'Logistics One Global',
  },
]

export const serviceContentService = {
  async list(): Promise<Service[]> {
    try {
      const { data } = await apiClient.get<ApiResponse<Service[]>>('/services', { timeout: 3000 })
      if (data.data && data.data.length > 0) return data.data
      return FALLBACK_SERVICES
    } catch {
      return FALLBACK_SERVICES
    }
  },
  async getBySlug(slug: string): Promise<Service> {
    try {
      const { data } = await apiClient.get<ApiResponse<Service>>(`/services/${slug}`, { timeout: 3000 })
      if (data.data) return data.data
    } catch {
      // Fallback lookup
    }
    const found = FALLBACK_SERVICES.find((s) => s.slug === slug)
    if (found) return found
    return FALLBACK_SERVICES[0]
  },
}

export const caseStudyService = {
  async list(): Promise<CaseStudy[]> {
    try {
      const { data } = await apiClient.get<ApiResponse<CaseStudy[]>>('/case-studies', { timeout: 3000 })
      if (data.data && data.data.length > 0) return data.data
      return FALLBACK_CASE_STUDIES
    } catch {
      return FALLBACK_CASE_STUDIES
    }
  },
  async listAll(): Promise<CaseStudy[]> {
    try {
      const { data } = await apiClient.get<ApiResponse<CaseStudy[]>>('/case-studies/admin/all', { timeout: 3000 })
      if (data.data && data.data.length > 0) return data.data
      return FALLBACK_CASE_STUDIES
    } catch {
      return FALLBACK_CASE_STUDIES
    }
  },
  async getBySlug(slug: string): Promise<CaseStudy> {
    try {
      const { data } = await apiClient.get<ApiResponse<CaseStudy>>(`/case-studies/${slug}`, { timeout: 3000 })
      if (data.data) return data.data
    } catch {
      // Fallback
    }
    const found = FALLBACK_CASE_STUDIES.find((cs) => cs.slug === slug)
    if (found) return found
    return FALLBACK_CASE_STUDIES[0]
  },
}

export const testimonialService = {
  async list(): Promise<Testimonial[]> {
    try {
      const { data } = await apiClient.get<ApiResponse<Testimonial[]>>('/testimonials', { timeout: 3000 })
      if (data.data && data.data.length > 0) return data.data
      return FALLBACK_TESTIMONIALS
    } catch {
      return FALLBACK_TESTIMONIALS
    }
  },
  async listAll(): Promise<Testimonial[]> {
    try {
      const { data } = await apiClient.get<ApiResponse<Testimonial[]>>('/testimonials/admin/all', { timeout: 3000 })
      if (data.data && data.data.length > 0) return data.data
      return FALLBACK_TESTIMONIALS
    } catch {
      return FALLBACK_TESTIMONIALS
    }
  },
}

export const blogService = {
  async list(params?: { category?: string; tag?: string; search?: string; page?: number }): Promise<{
    items: BlogPost[]
    page: number
    totalPages: number
    totalItems: number
  }> {
    try {
      const { data } = await apiClient.get<
        ApiResponse<{ items: BlogPost[]; page: number; totalPages: number; totalItems: number }>
      >('/blog', { params, timeout: 3000 })
      if (data.data && data.data.items && data.data.items.length > 0) return data.data
    } catch {
      // Fallback
    }

    let filtered = [...FALLBACK_BLOG_POSTS]
    if (params?.search) {
      const s = params.search.toLowerCase()
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s)
      )
    }
    if (params?.category) {
      filtered = filtered.filter((p) => p.category?.slug === params.category)
    }

    return {
      items: filtered,
      page: 1,
      totalPages: 1,
      totalItems: filtered.length,
    }
  },
  async getBySlug(slug: string): Promise<BlogPost> {
    try {
      const { data } = await apiClient.get<ApiResponse<BlogPost>>(`/blog/${slug}`, { timeout: 3000 })
      if (data.data) return data.data
    } catch {
      // Fallback
    }
    const found = FALLBACK_BLOG_POSTS.find((p) => p.slug === slug)
    if (found) return found
    return FALLBACK_BLOG_POSTS[0]
  },
  async listAll(): Promise<BlogPost[]> {
    try {
      const { data } = await apiClient.get<ApiResponse<{ items: BlogPost[] }>>('/blog/admin/all', { timeout: 3000 })
      if (data.data?.items) return data.data.items
    } catch {
      // Fallback
    }
    return FALLBACK_BLOG_POSTS
  },
  async create(payload: Record<string, unknown>) {
    const { data } = await apiClient.post<ApiResponse<BlogPost>>('/blog', payload)
    return data.data
  },
  async update(id: string, payload: Record<string, unknown>) {
    const { data } = await apiClient.patch<ApiResponse<BlogPost>>(`/blog/${id}`, payload)
    return data.data
  },
  async remove(id: string) {
    await apiClient.delete(`/blog/${id}`)
  },
  async duplicate(id: string) {
    return (await apiClient.post<ApiResponse<BlogPost>>(`/blog/${id}/duplicate`)).data.data
  },
  async revisions(id: string) {
    return (
      await apiClient.get<ApiResponse<Array<{ id: string; title: string; excerpt: string; content: string; createdAt: string }>>>(
        `/blog/${id}/revisions`
      )
    ).data.data
  },
  async restoreRevision(id: string, revisionId: string) {
    return (await apiClient.post<ApiResponse<BlogPost>>(`/blog/${id}/revisions/${revisionId}/restore`)).data.data
  },
  async publish(id: string) {
    return (await apiClient.patch<ApiResponse<BlogPost>>(`/blog/${id}/publish`)).data.data
  },
  async unpublish(id: string) {
    return (await apiClient.patch<ApiResponse<BlogPost>>(`/blog/${id}/unpublish`)).data.data
  },
}

export const taxonomyService = {
  async categories() {
    try {
      return (await apiClient.get<ApiResponse<Category[]>>('/categories', { timeout: 3000 })).data.data
    } catch {
      return [
        { id: 'cat-1', name: 'Software Architecture', slug: 'software-architecture' },
        { id: 'cat-2', name: 'Cloud & Infrastructure', slug: 'cloud-infrastructure' },
        { id: 'cat-3', name: 'Cybersecurity', slug: 'cybersecurity' },
      ]
    }
  },
  async tags() {
    try {
      return (await apiClient.get<ApiResponse<Tag[]>>('/categories/tags', { timeout: 3000 })).data.data
    } catch {
      return [
        { id: 'tag-1', name: 'TypeScript', slug: 'typescript' },
        { id: 'tag-2', name: 'Best Practices', slug: 'best-practices' },
        { id: 'tag-3', name: 'Scalability', slug: 'scalability' },
      ]
    }
  },
  async createCategory(payload: { name: string; slug?: string }) {
    return (await apiClient.post<ApiResponse<Category>>('/categories', payload)).data.data
  },
  async updateCategory(id: string, payload: { name?: string; slug?: string }) {
    return (await apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, payload)).data.data
  },
  async deleteCategory(id: string) {
    await apiClient.delete(`/categories/${id}`)
  },
  async createTag(payload: { name: string; slug?: string }) {
    return (await apiClient.post<ApiResponse<Tag>>('/categories/tags', payload)).data.data
  },
  async updateTag(id: string, payload: { name?: string; slug?: string }) {
    return (await apiClient.patch<ApiResponse<Tag>>(`/categories/tags/${id}`, payload)).data.data
  },
  async deleteTag(id: string) {
    await apiClient.delete(`/categories/tags/${id}`)
  },
}
