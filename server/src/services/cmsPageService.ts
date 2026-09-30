import { isMySQLActive, query, execute } from '../config/mysql'
import { ApiError } from '../utils/ApiError'

export interface CmsPageData {
  id: number | string
  title: string
  slug: string
  contentHtml: string
  excerpt?: string | null
  status: 'draft' | 'published' | 'archived'
  metaTitle?: string | null
  metaDescription?: string | null
  keywords?: string | null
  schemaType?: string | null
  isPublished: boolean
  createdAt?: string
  updatedAt?: string
}

let memoryPages: CmsPageData[] = [
  {
    id: 1,
    title: 'Enterprise Architecture & Cloud Standards',
    slug: 'enterprise-architecture-standards',
    contentHtml: `
      <h2>Corporate Engineering Benchmark</h2>
      <p>At ORBIT-I Private Limited, our engineering pipeline guarantees zero single-points-of-failure, hardened relational schemas, and sub-100ms response latencies for critical operational paths.</p>
      <h3>Zero-Trust Data Protection</h3>
      <p>All sensitive client payloads, bank invoices, and intern verification hashes are cryptographically signed using SHA-256 and salted AES-256 standards.</p>
      <h3>High Availability Deployment</h3>
      <p>Our applications run in optimized Node.js process pools backed by managed MySQL relational database instances with scheduled snapshot backups.</p>
    `,
    excerpt: 'Detailed overview of ORBIT-I engineering standards, SLA guarantees, and security practices.',
    status: 'published',
    metaTitle: 'Enterprise Architecture Standards | ORBIT-I Private Limited',
    metaDescription: 'Learn about ORBIT-I Private Limited engineering and software deployment standards.',
    keywords: 'enterprise software, engineering standards, node.js, mysql, security',
    schemaType: 'TechArticle',
    isPublished: true,
  },
  {
    id: 2,
    title: 'Information Security & Data Integrity Policy',
    slug: 'information-security-policy',
    contentHtml: `
      <h2>Information Security Framework</h2>
      <p>This document details our strict commitments to data protection, parameterized query verification, brute-force mitigation, and zero-trust perimeter security.</p>
      <h3>Threat Defense</h3>
      <ul>
        <li>Parameterized SQL execution on all database transactions.</li>
        <li>Aggressive IP rate limiting and rapid brute force lockout on all authentication gateways.</li>
        <li>Multi-layered MIME and magic-byte header validation on all document uploads.</li>
      </ul>
    `,
    excerpt: 'Official security controls, brute-force protection mechanisms, and database safety protocols.',
    status: 'published',
    metaTitle: 'Information Security Policy | ORBIT-I Private Limited',
    metaDescription: 'Read the official information security policy and data defense protocols of ORBIT-I Private Limited.',
    keywords: 'security policy, data integrity, brute force defense, encryption',
    schemaType: 'WebPage',
    isPublished: true,
  },
]

export const cmsPageService = {
  async list(): Promise<CmsPageData[]> {
    if (isMySQLActive()) {
      try {
        const rows = await query<any>(
          'SELECT * FROM cms_pages WHERE is_published = 1 AND status = "published" ORDER BY title ASC'
        )
        if (rows && rows.length > 0) {
          return rows.map((r) => ({
            id: r.id,
            title: r.title,
            slug: r.slug,
            contentHtml: r.content_html,
            excerpt: r.excerpt,
            status: r.status,
            metaTitle: r.meta_title,
            metaDescription: r.meta_description,
            keywords: r.keywords,
            schemaType: r.schema_type,
            isPublished: Boolean(r.is_published),
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          }))
        }
      } catch (err) {
        console.warn('[cmsPageService] MySQL list error, falling back to memory:', err)
      }
    }
    return memoryPages.filter((p) => p.isPublished && p.status === 'published')
  },

  async listAll(): Promise<CmsPageData[]> {
    if (isMySQLActive()) {
      try {
        const rows = await query<any>('SELECT * FROM cms_pages ORDER BY updated_at DESC')
        if (rows && rows.length > 0) {
          return rows.map((r) => ({
            id: r.id,
            title: r.title,
            slug: r.slug,
            contentHtml: r.content_html,
            excerpt: r.excerpt,
            status: r.status,
            metaTitle: r.meta_title,
            metaDescription: r.meta_description,
            keywords: r.keywords,
            schemaType: r.schema_type,
            isPublished: Boolean(r.is_published),
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          }))
        }
      } catch (err) {
        console.warn('[cmsPageService] MySQL listAll error, falling back to memory:', err)
      }
    }
    return memoryPages
  },

  async getBySlug(slug: string): Promise<CmsPageData | null> {
    if (isMySQLActive()) {
      try {
        const rows = await query<any>('SELECT * FROM cms_pages WHERE slug = ? LIMIT 1', [slug])
        if (rows && rows.length > 0) {
          const r = rows[0]
          return {
            id: r.id,
            title: r.title,
            slug: r.slug,
            contentHtml: r.content_html,
            excerpt: r.excerpt,
            status: r.status,
            metaTitle: r.meta_title,
            metaDescription: r.meta_description,
            keywords: r.keywords,
            schemaType: r.schema_type,
            isPublished: Boolean(r.is_published),
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          }
        }
      } catch (err) {
        console.warn('[cmsPageService] MySQL getBySlug error:', err)
      }
    }
    const found = memoryPages.find((p) => p.slug === slug)
    return found || null
  },

  async create(data: Partial<CmsPageData>): Promise<CmsPageData> {
    const slug = (data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `page-${Date.now()}`)
    const status = data.status || 'draft'
    const isPublished = status === 'published'

    if (isMySQLActive()) {
      try {
        const result = await execute(
          `INSERT INTO cms_pages (title, slug, content_html, excerpt, status, meta_title, meta_description, keywords, schema_type, is_published)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.title || 'Untitled Page',
            slug,
            data.contentHtml || '',
            data.excerpt || null,
            status,
            data.metaTitle || null,
            data.metaDescription || null,
            data.keywords || null,
            data.schemaType || 'WebPage',
            isPublished ? 1 : 0,
          ]
        )
        return {
          id: result.insertId,
          title: data.title || 'Untitled Page',
          slug,
          contentHtml: data.contentHtml || '',
          excerpt: data.excerpt,
          status,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          keywords: data.keywords,
          schemaType: data.schemaType || 'WebPage',
          isPublished,
        }
      } catch (err) {
        console.warn('[cmsPageService] MySQL create error, falling back to memory:', err)
      }
    }

    const newId = memoryPages.length ? Math.max(...memoryPages.map((p) => Number(p.id))) + 1 : 1
    const page: CmsPageData = {
      id: newId,
      title: data.title || 'Untitled Page',
      slug,
      contentHtml: data.contentHtml || '',
      excerpt: data.excerpt || null,
      status,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      keywords: data.keywords || null,
      schemaType: data.schemaType || 'WebPage',
      isPublished,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    memoryPages.push(page)
    return page
  },

  async update(id: string | number, data: Partial<CmsPageData>): Promise<CmsPageData> {
    const numId = Number(id)
    const isPublished = data.status ? data.status === 'published' : undefined

    if (isMySQLActive()) {
      try {
        await execute(
          `UPDATE cms_pages SET
            title = COALESCE(?, title),
            slug = COALESCE(?, slug),
            content_html = COALESCE(?, content_html),
            excerpt = COALESCE(?, excerpt),
            status = COALESCE(?, status),
            meta_title = COALESCE(?, meta_title),
            meta_description = COALESCE(?, meta_description),
            keywords = COALESCE(?, keywords),
            schema_type = COALESCE(?, schema_type),
            is_published = COALESCE(?, is_published)
           WHERE id = ?`,
          [
            data.title ?? null,
            data.slug ?? null,
            data.contentHtml ?? null,
            data.excerpt ?? null,
            data.status ?? null,
            data.metaTitle ?? null,
            data.metaDescription ?? null,
            data.keywords ?? null,
            data.schemaType ?? null,
            isPublished !== undefined ? (isPublished ? 1 : 0) : null,
            numId,
          ]
        )
      } catch (err) {
        console.warn('[cmsPageService] MySQL update error:', err)
      }
    }

    const idx = memoryPages.findIndex((p) => String(p.id) === String(id))
    if (idx !== -1) {
      memoryPages[idx] = {
        ...memoryPages[idx],
        ...data,
        isPublished: isPublished !== undefined ? isPublished : memoryPages[idx].isPublished,
        updatedAt: new Date().toISOString(),
      }
      return memoryPages[idx]
    }
    throw ApiError.notFound('CMS Page not found')
  },

  async remove(id: string | number): Promise<void> {
    const numId = Number(id)
    if (isMySQLActive()) {
      try {
        await execute('DELETE FROM cms_pages WHERE id = ?', [numId])
      } catch (err) {
        console.warn('[cmsPageService] MySQL delete error:', err)
      }
    }
    const idx = memoryPages.findIndex((p) => String(p.id) === String(id))
    if (idx !== -1) {
      memoryPages.splice(idx, 1)
      return
    }
    throw ApiError.notFound('CMS Page not found')
  },
}
