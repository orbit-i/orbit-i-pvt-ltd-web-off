import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Star, ArrowUpRight, Search } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { apiClient } from '@/services/apiClient'
import { getApiErrorMessage } from '@/utils/apiError'

interface PartnerItem {
  id: number | string
  name: string
  logoUrl?: string | null
  websiteUrl?: string | null
  category: 'enterprise' | 'fintech' | 'cloud' | 'academic'
  description?: string | null
  orderIndex: number
  isFeatured: boolean
}

export function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PartnerItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [form, setForm] = useState<Partial<PartnerItem>>({
    name: '',
    logoUrl: '',
    websiteUrl: '',
    category: 'enterprise',
    description: '',
    orderIndex: 0,
    isFeatured: true,
  })

  const loadPartners = async () => {
    try {
      const res = await apiClient.get('/partners/admin/list')
      setPartners(res.data.data || [])
    } catch {
      // Fallback preview
      setPartners([
        {
          id: 1,
          name: 'JazzCash Merchant Solutions',
          logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&q=80',
          websiteUrl: 'https://www.jazzcash.com.pk/',
          category: 'fintech',
          description: 'Direct mobile wallet and payment gateway merchant integration.',
          orderIndex: 1,
          isFeatured: true,
        },
        {
          id: 2,
          name: 'EasyPaisa Business Gateways',
          logoUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=200&q=80',
          websiteUrl: 'https://easypaisa.com.pk/',
          category: 'fintech',
          description: 'Instant OTC and direct wallet checkout integration.',
          orderIndex: 2,
          isFeatured: true,
        },
        {
          id: 3,
          name: 'Meezan Bank Limited',
          logoUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=200&q=80',
          websiteUrl: 'https://www.meezanbank.com/',
          category: 'enterprise',
          description: 'Corporate banking partner for verified IBAN wire settlements.',
          orderIndex: 3,
          isFeatured: true,
        },
        {
          id: 4,
          name: 'Hostinger Cloud Infrastructure',
          logoUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=200&q=80',
          websiteUrl: 'https://www.hostinger.com/',
          category: 'cloud',
          description: 'Node.js runtime and MySQL cloud cluster hosting partner.',
          orderIndex: 4,
          isFeatured: true,
        },
      ])
    }
  }

  useEffect(() => {
    void loadPartners()
  }, [])

  const openCreateModal = () => {
    setEditingItem(null)
    setForm({
      name: '',
      logoUrl: '',
      websiteUrl: '',
      category: 'enterprise',
      description: '',
      orderIndex: partners.length + 1,
      isFeatured: true,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (p: PartnerItem) => {
    setEditingItem(p)
    setForm({ ...p })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name?.trim()) return

    try {
      if (editingItem) {
        await apiClient.patch(`/partners/admin/${editingItem.id}`, form)
      } else {
        await apiClient.post('/partners/admin/create', form)
      }
      setIsModalOpen(false)
      await loadPartners()
    } catch (err) {
      alert(getApiErrorMessage(err, 'Failed to save partner.'))
    }
  }

  const handleDelete = async (id: number | string) => {
    if (!window.confirm('Delete this partner from database?')) return
    try {
      await apiClient.delete(`/partners/admin/${id}`)
      await loadPartners()
    } catch (err) {
      alert(getApiErrorMessage(err, 'Could not delete partner.'))
    }
  }

  const filtered = partners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Partner Brands & Alliances
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Manage enterprise clients, payment gateways, and cloud alliance logos shown across the site.
          </p>
        </div>

        <Button onClick={openCreateModal}>
          <Plus className="mr-1.5 size-4" /> Add Partner
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search partners by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] py-1.5 pl-9 pr-3 text-xs text-[var(--color-text-primary)] outline-none"
          />
        </div>
        <div className="text-xs text-[var(--color-text-muted)]">
          Total Partners: <span className="font-semibold text-[var(--color-text-primary)]">{partners.length}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((partner) => (
          <div
            key={partner.id}
            className="flex flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="size-12 rounded object-cover border border-[var(--color-border)]"
                    />
                  ) : (
                    <div className="flex size-12 items-center justify-center rounded bg-primary-500/15 text-primary-300 font-bold">
                      {partner.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">{partner.name}</h3>
                    <span className="inline-block rounded bg-primary-500/10 px-2 py-0.5 text-[10px] uppercase font-semibold text-primary-300">
                      {partner.category}
                    </span>
                  </div>
                </div>

                {partner.isFeatured && (
                  <span className="flex size-6 items-center justify-center rounded-full bg-amber-500/15 text-amber-400" title="Featured Partner">
                    <Star className="size-3.5 fill-amber-400" />
                  </span>
                )}
              </div>

              {partner.description && (
                <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  {partner.description}
                </p>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-xs">
              {partner.websiteUrl ? (
                <a
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary-400 hover:underline"
                >
                  Visit site <ArrowUpRight className="size-3" />
                </a>
              ) : (
                <span className="text-[var(--color-text-muted)]">—</span>
              )}

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEditModal(partner)}
                  className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
                >
                  <Edit2 className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(partner.id)}
                  className="rounded p-1 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-3">
              {editingItem ? 'Edit Partner' : 'Add Corporate Partner'}
            </h2>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <Input
                label="Partner / Brand Name"
                required
                value={form.name || ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. JazzCash, Meezan Bank, AWS"
              />

              <Input
                label="Logo Image URL"
                value={form.logoUrl || ''}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />

              <Input
                label="Website URL"
                value={form.websiteUrl || ''}
                onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                placeholder="https://..."
              />

              <div>
                <label className="text-[var(--color-text-muted)] block mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="w-full rounded border border-[var(--color-border)] bg-[var(--color-background)] p-2 text-xs text-[var(--color-text-primary)]"
                >
                  <option value="enterprise">Enterprise Client</option>
                  <option value="fintech">FinTech / Payment Partner</option>
                  <option value="cloud">Cloud & Infrastructure Alliance</option>
                  <option value="academic">Academic / Trainee Incubator</option>
                </select>
              </div>

              <div>
                <label className="text-[var(--color-text-muted)] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short note on partnership or services..."
                  className="w-full rounded border border-[var(--color-border)] bg-[var(--color-background)] p-2 text-xs text-[var(--color-text-primary)] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={form.isFeatured ?? true}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="size-4 rounded"
                />
                <label htmlFor="isFeatured" className="text-xs text-[var(--color-text-primary)]">
                  Feature in Homepage Logo Showcase
                </label>
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t border-[var(--color-border)] pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Save Changes' : 'Create Partner'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
