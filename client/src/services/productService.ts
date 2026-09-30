import { apiClient } from './apiClient'
import type { ApiResponse, PaginatedResult, Product } from '@/types'

export interface ProductListParams {
  search?: string
  category?: string
  status?: string
  page?: number
  limit?: number
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Orbit CRM',
    slug: 'orbit-crm',
    category: { id: 'cat-tools', name: 'Business Tools', slug: 'business-tools' },
    shortDescription: 'Lightweight customer and deal tracking built for technical agencies.',
    description:
      'Orbit CRM gives software consultancies and product teams a single unified workspace to manage client conversations, proposal pipelines, and billing milestones without the heavyweight overhead of legacy enterprise suites.',
    images: [],
    features: ['Deal pipeline & stage analytics', 'Client communication timelines', 'Team-level permission tiers', 'Direct invoicing webhooks'],
    price: 29,
    currency: 'USD',
    status: 'available',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Orbit Forms',
    slug: 'orbit-forms',
    category: { id: 'cat-prod', name: 'Productivity', slug: 'productivity' },
    shortDescription: 'Conditional logic form builder with native webhooks and schema validation.',
    description:
      'Build client intake forms, survey funnels, and enterprise questionnaires with conditional logic branching, file upload attachments, and automated webhooks directly into your backend APIs.',
    images: [],
    features: ['Conditional question branching', 'Direct REST webhook integration', 'Tamper-proof signature capture', 'Real-time response export'],
    price: 15,
    currency: 'USD',
    status: 'available',
    createdAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 'prod-3',
    name: 'Orbit Track',
    slug: 'orbit-track',
    category: { id: 'cat-tools', name: 'Business Tools', slug: 'business-tools' },
    shortDescription: 'Client-visible project milestone and deliverable tracker.',
    description:
      'Orbit Track gives engineering teams a synchronized, client-accessible view of sprint milestones, delivery dates, and staging review links — eliminating the need for daily manual status emails.',
    images: [],
    features: ['Client-facing milestone portal', 'Sprint burndown visibility', 'Secure artifact delivery vaults', 'Automated Slack/Email updates'],
    price: 39,
    currency: 'USD',
    status: 'available',
    createdAt: '2026-01-10T00:00:00Z',
  },
]

export const productService = {
  async list(params: ProductListParams = {}): Promise<PaginatedResult<Product>> {
    try {
      const { data } = await apiClient.get<ApiResponse<PaginatedResult<Product>>>('/products', { params, timeout: 3000 })
      if (data.data && data.data.items && data.data.items.length > 0) return data.data
    } catch {
      // Fallback
    }

    let items = [...FALLBACK_PRODUCTS]
    if (params.search) {
      const q = params.search.toLowerCase()
      items = items.filter(p => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q))
    }

    return {
      items,
      totalItems: items.length,
      page: 1,
      totalPages: 1,
    }
  },

  async getBySlug(slug: string): Promise<Product> {
    try {
      const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${slug}`, { timeout: 3000 })
      if (data.data) return data.data
    } catch {
      // Fallback
    }

    const found = FALLBACK_PRODUCTS.find(p => p.slug === slug)
    if (found) return found
    return FALLBACK_PRODUCTS[0]
  },
}
