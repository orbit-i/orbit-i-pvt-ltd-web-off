// ---------------------------------------------------------------------------
// Domain types shared across the client. These mirror (a subset of) the
// backend Mongoose schemas — kept manually in sync for now; if the project
// grows, consider generating these from the API's OpenAPI/Zod schemas.
// ---------------------------------------------------------------------------

export type UserRole = 'client' | 'editor' | 'seo_manager' | 'admin' | 'super_admin'

export interface User {
  id: string
  fullName: string
  email: string
  role: UserRole
  isVerified: boolean
  isActive: boolean
  avatarUrl?: string
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string>
}

export interface PaginatedResult<T> {
  items: T[]
  page: number
  totalPages: number
  totalItems: number
}

export type ProductStatus = 'available' | 'coming_soon' | 'archived'

export interface ProductCategory {
  id: string
  name: string
  slug: string
}

export interface Product {
  id: string
  slug: string
  name: string
  category: ProductCategory
  shortDescription: string
  description: string
  images: string[]
  features: string[]
  price: number
  currency: string
  status: ProductStatus
  createdAt: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  status: OrderStatus
  total: number
  currency: string
  createdAt: string
}

export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed'

export interface Milestone {
  id: string
  title: string
  dueDate: string
  isComplete: boolean
}

export interface Project {
  id: string
  name: string
  clientId: string
  status: ProjectStatus
  progress: number
  assignedTeam: string[]
  milestones: Milestone[]
  startDate: string
  targetDate?: string
}

export interface Service {
  id: string
  slug: string
  title: string
  summary: string
  description: string
  benefits: string[]
  technologies: string[]
  processSteps: { title: string; description: string }[]
  icon: string
}

export interface CaseStudy {
  id: string
  slug: string
  projectName: string
  clientIndustry: string
  problem: string
  solution: string
  technologies: string[]
  results: string[]
  coverImage: string
  gallery?: string[]
  content?: string
  testimonial?: { quote?: string; author?: string; role?: string }
  metrics?: { label: string; value: string }[]
  seoTitle?: string
  seoDescription?: string
}

export interface Category { id: string; name: string; slug: string }
export interface Tag { id: string; name: string; slug: string }
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  featuredImage?: string
  category: Category
  tags: Tag[]
  author: Pick<User, 'id' | 'fullName'>
  status: 'draft' | 'scheduled' | 'published'
  publishedAt?: string
  seoTitle?: string
  seoDescription?: string
  focusKeyword?: string
  secondaryKeywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  robots?: string
  scheduledAt?: string
  views?: number
  createdAt: string
}

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'internship'

export interface Job {
  id: string
  slug: string
  title: string
  department: string
  location: string
  employmentType: EmploymentType
  experience: string
  description: string
  requirements: string[]
  responsibilities: string[]
  isOpen: boolean
  postedAt: string
}

export interface Testimonial {
  id: string
  authorName: string
  authorRole: string
  company: string
  quote: string
  avatarUrl?: string
}

export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue'

export interface Invoice {
  id: string
  orderId?: string
  projectId?: string
  amount: number
  currency: string
  status: InvoiceStatus
  issuedAt: string
  dueAt?: string
}

export type SupportTicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export interface SupportTicket {
  id: string
  subject: string
  status: SupportTicketStatus
  createdAt: string
}

export interface TeamMember {
  id: string
  name: string
  designation: string
  department?: string
  bio: string
  avatarUrl?: string
  linkedinUrl?: string
  githubUrl?: string
  skills: string[]
  order: number
  isPublished?: boolean
}

export interface ContactSubmission {
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
}
