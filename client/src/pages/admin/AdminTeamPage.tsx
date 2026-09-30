import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { FaLinkedin, FaGithub } from 'react-icons/fa'
import { Button, Input } from '@/components/ui'
import { apiClient } from '@/services/apiClient'
import { getApiErrorMessage } from '@/utils/apiError'

interface TeamItem {
  id: number | string
  name: string
  designation: string
  department: string
  bio: string
  avatarUrl?: string | null
  skills: string[]
  linkedinUrl?: string | null
  githubUrl?: string | null
  orderIndex: number
  isPublished: boolean
}

export function AdminTeamPage() {
  const [team, setTeam] = useState<TeamItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TeamItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [form, setForm] = useState<{
    name: string
    designation: string
    department: string
    bio: string
    avatarUrl: string
    skillsStr: string
    linkedinUrl: string
    githubUrl: string
    orderIndex: number
    isPublished: boolean
  }>({
    name: '',
    designation: '',
    department: 'Engineering',
    bio: '',
    avatarUrl: '',
    skillsStr: '',
    linkedinUrl: '',
    githubUrl: '',
    orderIndex: 0,
    isPublished: true,
  })

  const loadTeam = async () => {
    try {
      const res = await apiClient.get('/team/admin/all')
      setTeam(res.data.data || [])
    } catch {
      // Fallback preview
      setTeam([
        {
          id: 1,
          name: 'Muhammad Saad',
          designation: 'Chief Executive Officer & Founder',
          department: 'Executive Leadership',
          bio: 'Technologist steering ORBIT-I Private Limited. Focused on high-performance enterprise systems.',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          skills: ['Enterprise Architecture', 'Strategic Growth', 'Cloud Operations'],
          linkedinUrl: 'https://www.linkedin.com/company/orbit-i-private-limited/',
          githubUrl: 'https://github.com/orbit-i',
          orderIndex: 1,
          isPublished: true,
        },
        {
          id: 2,
          name: 'Abdul Rehman',
          designation: 'Chief Technology Officer',
          department: 'Engineering Leadership',
          bio: 'Lead architect specializing in distributed systems, high-concurrency microservices, and MySQL design.',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          skills: ['TypeScript', 'Node.js', 'MySQL Optimization', 'System Security'],
          linkedinUrl: 'https://www.linkedin.com/company/orbit-i-private-limited/',
          githubUrl: 'https://github.com/orbit-i',
          orderIndex: 2,
          isPublished: true,
        },
      ])
    }
  }

  useEffect(() => {
    void loadTeam()
  }, [])

  const openCreateModal = () => {
    setEditingItem(null)
    setForm({
      name: '',
      designation: '',
      department: 'Engineering',
      bio: '',
      avatarUrl: '',
      skillsStr: '',
      linkedinUrl: 'https://www.linkedin.com/company/orbit-i-private-limited/',
      githubUrl: 'https://github.com/orbit-i',
      orderIndex: team.length + 1,
      isPublished: true,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (t: TeamItem) => {
    setEditingItem(t)
    setForm({
      name: t.name,
      designation: t.designation,
      department: t.department,
      bio: t.bio,
      avatarUrl: t.avatarUrl || '',
      skillsStr: t.skills ? t.skills.join(', ') : '',
      linkedinUrl: t.linkedinUrl || '',
      githubUrl: t.githubUrl || '',
      orderIndex: t.orderIndex || 0,
      isPublished: t.isPublished,
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.designation.trim()) return

    const skills = form.skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const payload = {
      name: form.name.trim(),
      designation: form.designation.trim(),
      department: form.department.trim(),
      bio: form.bio.trim(),
      avatarUrl: form.avatarUrl.trim() || null,
      skills,
      linkedinUrl: form.linkedinUrl.trim() || null,
      githubUrl: form.githubUrl.trim() || null,
      orderIndex: Number(form.orderIndex) || 0,
      isPublished: Boolean(form.isPublished),
    }

    try {
      if (editingItem) {
        await apiClient.patch(`/team/${editingItem.id}`, payload)
      } else {
        await apiClient.post('/team', payload)
      }
      setIsModalOpen(false)
      await loadTeam()
    } catch (err) {
      alert(getApiErrorMessage(err, 'Failed to save team member.'))
    }
  }

  const handleDelete = async (id: number | string) => {
    if (!window.confirm('Remove this team member from directory?')) return
    try {
      await apiClient.delete(`/team/${id}`)
      await loadTeam()
    } catch (err) {
      alert(getApiErrorMessage(err, 'Could not remove member.'))
    }
  }

  const filtered = team.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Corporate Team Management
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Manage executive leadership, software architects, AI leads, and engineering teams shown on the /team page.
          </p>
        </div>

        <Button onClick={openCreateModal}>
          <Plus className="mr-1.5 size-4" /> Add Team Member
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search team by name, role, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] py-1.5 pl-9 pr-3 text-xs text-[var(--color-text-primary)] outline-none"
          />
        </div>
        <div className="text-xs text-[var(--color-text-muted)]">
          Total Members: <span className="font-semibold text-[var(--color-text-primary)]">{team.length}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((member) => (
          <div
            key={member.id}
            className="flex flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          >
            <div>
              <div className="flex items-start gap-3">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="size-14 rounded-full object-cover border border-[var(--color-border)] shrink-0"
                  />
                ) : (
                  <div className="flex size-14 items-center justify-center rounded-full bg-primary-500/15 text-primary-300 font-bold shrink-0">
                    {member.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">{member.name}</h3>
                  <p className="text-xs text-primary-400 font-medium">{member.designation}</p>
                  <span className="mt-1 inline-block rounded bg-[var(--color-background)] px-2 py-0.5 text-[10px] text-[var(--color-text-muted)]">
                    {member.department}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-secondary)] line-clamp-3">
                {member.bio}
              </p>

              {member.skills && member.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {member.skills.slice(0, 3).map((s) => (
                    <span key={s} className="rounded bg-[var(--color-background)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-muted)]">
                      {s}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="text-[10px] text-[var(--color-text-muted)] self-center">
                      +{member.skills.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-xs">
              <div className="flex items-center gap-2">
                {member.linkedinUrl && (
                  <a href={member.linkedinUrl} target="_blank" rel="noreferrer" className="text-primary-400 hover:text-primary-300">
                    <FaLinkedin className="size-3.5" />
                  </a>
                )}
                {member.githubUrl && (
                  <a href={member.githubUrl} target="_blank" rel="noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                    <FaGithub className="size-3.5" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEditModal(member)}
                  className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
                >
                  <Edit2 className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(member.id)}
                  className="rounded p-1 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-3">
              {editingItem ? 'Edit Team Member' : 'Add Corporate Team Member'}
            </h2>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <Input
                label="Full Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Muhammad Saad"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Designation / Role"
                  required
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  placeholder="e.g. Lead Architect"
                />

                <div>
                  <label className="text-[var(--color-text-muted)] block mb-1">Department</label>
                  <input
                    type="text"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    placeholder="e.g. Engineering Leadership"
                    className="w-full rounded border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-text-primary)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[var(--color-text-muted)] block mb-1">Professional Bio</label>
                <textarea
                  rows={3}
                  required
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Senior engineer with 8+ years experience in..."
                  className="w-full rounded border border-[var(--color-border)] bg-[var(--color-background)] p-2.5 text-xs text-[var(--color-text-primary)] outline-none"
                />
              </div>

              <Input
                label="Avatar / Portrait Photo URL"
                value={form.avatarUrl}
                onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />

              <Input
                label="Core Skills (comma separated)"
                value={form.skillsStr}
                onChange={(e) => setForm({ ...form, skillsStr: e.target.value })}
                placeholder="TypeScript, Node.js, MySQL, Cloud Architecture"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="LinkedIn Profile URL"
                  value={form.linkedinUrl}
                  onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
                <Input
                  label="GitHub Profile URL"
                  value={form.githubUrl}
                  onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="size-4 rounded"
                />
                <label htmlFor="isPublished" className="text-xs text-[var(--color-text-primary)]">
                  Published and publicly visible on /team page
                </label>
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t border-[var(--color-border)] pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Save Changes' : 'Add Member'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
