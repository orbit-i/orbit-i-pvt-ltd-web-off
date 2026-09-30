import { useEffect, useState, useMemo } from 'react'
import {
  Plus,
  ArrowLeft,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { WordPressEditor } from '@/components/editor/WordPressEditor'
import { WordPressSeoPanel } from '@/components/editor/WordPressSeoPanel'
import { blogService, taxonomyService } from '@/services/contentService'
import type { BlogPost, Category } from '@/types'
import { getApiErrorMessage } from '@/utils/apiError'

export function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Form fields
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '<p></p>',
    category: '',
    tags: '',
    status: 'draft' as BlogPost['status'],
    featuredImage: '',
    seoTitle: '',
    seoDescription: '',
    focusKeyword: '',
    canonicalUrl: '',
    schemaType: 'TechArticle',
  })

  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const loadData = async () => {
    try {
      const [p, c] = await Promise.all([
        blogService.listAll(),
        taxonomyService.categories(),
      ])
      setPosts(p)
      setCategories(c)
    } catch (err) {
      console.error('Failed to load blog data', err)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const startCreate = () => {
    setEditingPost(null)
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '<h2>Introduction</h2><p>Write your article here using the WordPress visual editor...</p>',
      category: categories[0]?.id || '',
      tags: '',
      status: 'draft',
      featuredImage: '',
      seoTitle: '',
      seoDescription: '',
      focusKeyword: '',
      canonicalUrl: '',
      schemaType: 'TechArticle',
    })
    setFormError(null)
    setFormSuccess(null)
    setIsCreatingNew(true)
  }

  const startEdit = (post: BlogPost) => {
    setEditingPost(post)
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '<p></p>',
      category: post.category?.id || '',
      tags: post.tags?.map((t) => t.slug).join(', ') || '',
      status: post.status,
      featuredImage: post.featuredImage || '',
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      focusKeyword: post.focusKeyword || '',
      canonicalUrl: post.canonicalUrl || '',
      schemaType: 'TechArticle',
    })
    setFormError(null)
    setFormSuccess(null)
    setIsCreatingNew(true)
  }

  const cancelEdit = () => {
    setIsCreatingNew(false)
    setEditingPost(null)
    setFormError(null)
    setFormSuccess(null)
  }

  const handleTitleChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === '' || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
      seoTitle: prev.seoTitle === '' ? val : prev.seoTitle,
    }))
  }

  const handleSave = async (forceStatus?: BlogPost['status']) => {
    const title = form.title.trim()
    const content = form.content.trim()
    const targetStatus = forceStatus || form.status

    if (title.length < 3) {
      setFormError('Please enter a post title of at least 3 characters.')
      return
    }

    if (!content || content === '<p></p>') {
      setFormError('Please add content in the WordPress visual editor.')
      return
    }

    setFormError(null)
    setFormSuccess(null)
    setIsSaving(true)

    try {
      const payload: any = {
        title,
        slug: form.slug.trim() || undefined,
        excerpt: form.excerpt.trim() || title,
        content,
        category: form.category || undefined,
        status: targetStatus,
        featuredImage: form.featuredImage || undefined,
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
        focusKeyword: form.focusKeyword || undefined,
        canonicalUrl: form.canonicalUrl || undefined,
        tags: form.tags
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean),
      }

      if (editingPost) {
        await blogService.update(editingPost.id, payload)
        setFormSuccess('Article updated successfully!')
      } else {
        const created = await blogService.create(payload)
        setEditingPost(created)
        setFormSuccess('New article created successfully!')
      }

      await loadData()
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Failed to save post.'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this post?')) return
    try {
      await blogService.remove(postId)
      await loadData()
      if (editingPost?.id === postId) {
        cancelEdit()
      }
    } catch (err) {
      alert(getApiErrorMessage(err, 'Could not delete post.'))
    }
  }

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [posts, statusFilter, searchQuery])

  // =========================================================================
  // VIEW: WORDPRESS EDITOR SCREEN
  // =========================================================================
  if (isCreatingNew) {
    return (
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex size-9 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                {editingPost ? 'Edit Post' : 'Add New Post'}
              </h1>
              <p className="text-xs text-[var(--color-text-muted)]">
                WordPress Gutenberg-Grade Content Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave('draft')}
              isLoading={isSaving}
            >
              Save Draft
            </Button>
            <Button
              size="sm"
              onClick={() => handleSave('published')}
              isLoading={isSaving}
            >
              {editingPost?.status === 'published' ? 'Update Post' : 'Publish Post'}
            </Button>
          </div>
        </div>

        {formError && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
            {formError}
          </div>
        )}
        {formSuccess && (
          <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-400">
            {formSuccess}
          </div>
        )}

        {/* 2-Column WordPress Layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Main Column */}
          <div className="space-y-6 min-w-0">
            {/* Title & Permalink */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title here..."
                className="w-full bg-transparent font-display text-2xl font-bold text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]/50"
              />

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] pt-3 text-xs text-[var(--color-text-muted)]">
                <span className="font-medium text-[var(--color-text-secondary)]">Permalink:</span>
                <span className="text-zinc-500">https://orbit-i.tech/blog/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="post-slug"
                  className="rounded border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-0.5 text-xs text-primary-300 outline-none"
                />
                {editingPost && (
                  <a
                    href={`/blog/${form.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary-400 hover:underline"
                  >
                    View <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Visual Text Editor */}
            <div className="min-w-0">
              <WordPressEditor
                value={form.content}
                onChange={(content) => setForm((prev) => ({ ...prev, content }))}
                minHeight="420px"
              />
            </div>

            {/* SEO Panel (Yoast/RankMath) */}
            <WordPressSeoPanel
              title={form.title}
              slug={form.slug}
              content={form.content}
              seoTitle={form.seoTitle}
              seoDescription={form.seoDescription}
              focusKeyword={form.focusKeyword}
              canonicalUrl={form.canonicalUrl}
              schemaType={form.schemaType}
              onChange={(updated) => setForm((prev) => ({ ...prev, ...updated }))}
            />
          </div>

          {/* WordPress Right Sidebar */}
          <div className="space-y-5">
            {/* Status & Publish */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <h3 className="mb-3 font-display text-sm font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">
                Publish Settings
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">Status:</span>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="rounded border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1 text-xs text-[var(--color-text-primary)]"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">Visibility:</span>
                  <span className="font-medium text-[var(--color-text-primary)]">Public</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">Author:</span>
                  <span className="font-medium text-[var(--color-text-primary)]">ORBIT-I Editorial</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">Database:</span>
                  <span className="font-mono text-emerald-400">MySQL Hostinger</span>
                </div>

                <div className="pt-3 border-t border-[var(--color-border)] flex gap-2">
                  <Button
                    className="w-full"
                    onClick={() => handleSave()}
                    isLoading={isSaving}
                  >
                    {form.status === 'published' ? 'Update' : 'Publish'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <h3 className="mb-3 font-display text-sm font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">
                Featured Image
              </h3>
              {form.featuredImage ? (
                <div className="space-y-2">
                  <img
                    src={form.featuredImage}
                    alt="Featured preview"
                    className="h-36 w-full rounded object-cover border border-[var(--color-border)]"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, featuredImage: '' })}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove featured image
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    placeholder="https://images.unsplash.com/..."
                    value={form.featuredImage}
                    onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                  />
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    Paste image URL or Unsplash image for blog card and OpenGraph sharing.
                  </p>
                </div>
              )}
            </div>

            {/* Category */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <h3 className="mb-3 font-display text-sm font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">
                Category
              </h3>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded border border-[var(--color-border)] bg-[var(--color-background)] p-2 text-xs text-[var(--color-text-primary)]"
              >
                <option value="">Select category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <h3 className="mb-3 font-display text-sm font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">
                Tags
              </h3>
              <Input
                placeholder="tech, engineering, nodejs..."
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
              <p className="mt-1.5 text-[11px] text-[var(--color-text-muted)]">
                Separate multiple tags with commas.
              </p>
            </div>

            {/* Excerpt */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <h3 className="mb-3 font-display text-sm font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">
                Post Excerpt
              </h3>
              <textarea
                rows={3}
                placeholder="Brief summary for archive and listing cards..."
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full rounded border border-[var(--color-border)] bg-[var(--color-background)] p-2 text-xs text-[var(--color-text-primary)] outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // =========================================================================
  // VIEW: POSTS DIRECTORY / LIST VIEW
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Articles & Blog Management
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Enterprise WordPress-grade content publishing, Yoast SEO metrics, and MySQL storage.
          </p>
        </div>

        <Button onClick={startCreate}>
          <Plus className="mr-1.5 size-4" /> Add New Post
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`rounded px-3 py-1.5 font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
            }`}
          >
            All ({posts.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('published')}
            className={`rounded px-3 py-1.5 font-medium transition-colors ${
              statusFilter === 'published'
                ? 'bg-primary-600 text-white'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
            }`}
          >
            Published ({posts.filter((p) => p.status === 'published').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('draft')}
            className={`rounded px-3 py-1.5 font-medium transition-colors ${
              statusFilter === 'draft'
                ? 'bg-primary-600 text-white'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
            }`}
          >
            Drafts ({posts.filter((p) => p.status === 'draft').length})
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] py-1.5 pl-9 pr-3 text-xs text-[var(--color-text-primary)] outline-none"
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-background)] font-medium text-[var(--color-text-muted)]">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">SEO Focus</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-[var(--color-text-muted)]">
                    No posts found. Click "Add New Post" to write your first article.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="transition-colors hover:bg-[var(--color-surface-hover)]">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-[var(--color-text-primary)]">{post.title}</div>
                      <div className="font-mono text-[11px] text-[var(--color-text-muted)]">
                        /{post.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[var(--color-text-secondary)]">
                      {post.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-4 py-3.5">
                      {post.focusKeyword ? (
                        <span className="inline-flex items-center gap-1 rounded bg-primary-500/10 px-2 py-0.5 text-[11px] text-primary-300">
                          <Sparkles className="size-3" /> {post.focusKeyword}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[var(--color-text-muted)]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          post.status === 'published'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-zinc-500/15 text-zinc-400'
                        }`}
                      >
                        {post.status === 'published' ? (
                          <CheckCircle className="size-3" />
                        ) : (
                          <Clock className="size-3" />
                        )}
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[var(--color-text-muted)]">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : 'Draft'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(post)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(post.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
