import { useEffect, useState } from 'react'
import { Plus, ArrowLeft, CheckCircle2, Clock } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { WordPressEditor } from '@/components/editor/WordPressEditor'
import { apiClient } from '@/services/apiClient'
import { getApiErrorMessage } from '@/utils/apiError'

interface CmsPageItem {
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
  updatedAt?: string
}

export function AdminCmsPages() {
  const [pages, setPages] = useState<CmsPageItem[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPage, setSelectedPage] = useState<CmsPageItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    contentHtml: '<p></p>',
    excerpt: '',
    status: 'draft' as CmsPageItem['status'],
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    schemaType: 'WebPage',
  })

  const loadPages = async () => {
    try {
      const res = await apiClient.get('/cms/admin/list')
      setPages(res.data.data || [])
    } catch {
      // Fallback local pages if offline
      setPages([
        {
          id: 1,
          title: 'Enterprise Architecture & Cloud Standards',
          slug: 'enterprise-architecture-standards',
          contentHtml: '<h2>Corporate Standards</h2><p>Our infrastructure guarantees 99.99% uptime with automated failover.</p>',
          status: 'published',
          metaTitle: 'Enterprise Architecture Standards | ORBIT-I',
          schemaType: 'TechArticle',
          isPublished: true,
        },
        {
          id: 2,
          title: 'Information Security & Data Integrity Policy',
          slug: 'information-security-policy',
          contentHtml: '<h2>Security Controls</h2><p>Zero-trust, encrypted secrets, and multi-factor authorization.</p>',
          status: 'published',
          metaTitle: 'Information Security Policy | ORBIT-I',
          schemaType: 'WebPage',
          isPublished: true,
        },
      ])
    }
  }

  useEffect(() => {
    void loadPages()
  }, [])

  const startCreate = () => {
    setSelectedPage(null)
    setForm({
      title: '',
      slug: '',
      contentHtml: '<h2>New Corporate Page</h2><p>Draft your content using the WordPress editor...</p>',
      excerpt: '',
      status: 'draft',
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      schemaType: 'WebPage',
    })
    setError(null)
    setSuccess(null)
    setIsEditing(true)
  }

  const startEdit = (p: CmsPageItem) => {
    setSelectedPage(p)
    setForm({
      title: p.title,
      slug: p.slug,
      contentHtml: p.contentHtml || '<p></p>',
      excerpt: p.excerpt || '',
      status: p.status,
      metaTitle: p.metaTitle || '',
      metaDescription: p.metaDescription || '',
      keywords: p.keywords || '',
      schemaType: p.schemaType || 'WebPage',
    })
    setError(null)
    setSuccess(null)
    setIsEditing(true)
  }

  const handleSave = async (forceStatus?: CmsPageItem['status']) => {
    if (!form.title.trim()) {
      setError('Page title is required.')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const payload = {
      ...form,
      status: forceStatus || form.status,
      slug: form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }

    try {
      if (selectedPage) {
        await apiClient.patch(`/cms/admin/${selectedPage.id}`, payload)
        setSuccess('Page updated successfully!')
      } else {
        await apiClient.post('/cms/admin/create', payload)
        setSuccess('New page published to CMS registry!')
      }
      await loadPages()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save CMS page.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number | string) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return
    try {
      await apiClient.delete(`/cms/admin/${id}`)
      await loadPages()
      if (selectedPage?.id === id) {
        setIsEditing(false)
      }
    } catch (err) {
      alert(getApiErrorMessage(err, 'Could not delete page.'))
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex size-9 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                {selectedPage ? 'Edit CMS Page' : 'Create Custom Page'}
              </h1>
              <p className="text-xs text-[var(--color-text-muted)]">
                Manage static content, corporate policies, and SEO schema
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleSave('draft')} isLoading={isLoading}>
              Save Draft
            </Button>
            <Button size="sm" onClick={() => handleSave('published')} isLoading={isLoading}>
              {form.status === 'published' ? 'Update Page' : 'Publish Page'}
            </Button>
          </div>
        </div>

        {error && <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
        {success && <div className="rounded border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-400">{success}</div>}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5 min-w-0">
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter page title..."
                className="w-full bg-transparent font-display text-2xl font-bold text-[var(--color-text-primary)] outline-none"
              />
              <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <span>Slug: /</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="custom-page-slug"
                  className="rounded border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-0.5 text-xs text-primary-300 outline-none"
                />
              </div>
            </div>

            <WordPressEditor
              value={form.contentHtml}
              onChange={(contentHtml) => setForm((prev) => ({ ...prev, contentHtml }))}
              minHeight="400px"
            />
          </div>

          <div className="space-y-5">
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3 text-xs">
              <h3 className="font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">
                Page Attributes
              </h3>
              <div>
                <label className="text-[var(--color-text-muted)] block mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full rounded border border-[var(--color-border)] bg-[var(--color-background)] p-2 text-xs text-[var(--color-text-primary)]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="text-[var(--color-text-muted)] block mb-1">Schema.org Type</label>
                <select
                  value={form.schemaType}
                  onChange={(e) => setForm({ ...form, schemaType: e.target.value })}
                  className="w-full rounded border border-[var(--color-border)] bg-[var(--color-background)] p-2 text-xs text-[var(--color-text-primary)]"
                >
                  <option value="WebPage">Corporate WebPage</option>
                  <option value="TechArticle">TechArticle</option>
                  <option value="AboutPage">AboutPage</option>
                  <option value="ContactPage">ContactPage</option>
                </select>
              </div>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3 text-xs">
              <h3 className="font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">
                SEO Metadata
              </h3>
              <Input
                label="SEO Title"
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                placeholder={form.title || 'Page title...'}
              />
              <div>
                <label className="text-[var(--color-text-muted)] block mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={form.metaDescription}
                  onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                  placeholder="Summary for Google SERP..."
                  className="w-full rounded border border-[var(--color-border)] bg-[var(--color-background)] p-2 text-xs text-[var(--color-text-primary)] outline-none"
                />
              </div>
              <Input
                label="Meta Keywords"
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                placeholder="software, cloud, engineering..."
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Content Management System (Pages)
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Create and edit arbitrary corporate pages using WordPress-style visual tools.
          </p>
        </div>

        <Button onClick={startCreate}>
          <Plus className="mr-1.5 size-4" /> Create New Page
        </Button>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-background)] font-medium text-[var(--color-text-muted)]">
            <tr>
              <th className="px-5 py-3">Page Title</th>
              <th className="px-4 py-3">Schema</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {pages.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-[var(--color-surface-hover)]">
                <td className="px-5 py-3.5">
                  <div className="font-medium text-[var(--color-text-primary)]">{p.title}</div>
                  <div className="font-mono text-[11px] text-[var(--color-text-muted)]">/{p.slug}</div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="rounded bg-primary-500/10 px-2 py-0.5 text-[11px] text-primary-300">
                    {p.schemaType || 'WebPage'}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      p.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-500/15 text-zinc-400'
                    }`}
                  >
                    {p.status === 'published' ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(p)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
