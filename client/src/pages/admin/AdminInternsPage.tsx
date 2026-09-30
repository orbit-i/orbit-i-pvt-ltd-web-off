import { useState } from 'react'
import {
  Search,
  Plus,
  Download,
  Trash2,
  Edit,
  ExternalLink,
} from 'lucide-react'
import { Button, Modal } from '@/components/ui'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable'
import { Link } from 'react-router-dom'

export interface AdminIntern {
  id: number | string
  certificateId: string
  fullName: string
  email: string
  phone?: string
  department: string
  role: string
  startDate: string
  endDate: string
  duration: string
  completionStatus: 'completed' | 'in_progress' | 'dropped'
  certificateStatus: 'valid' | 'expired' | 'revoked'
  gradePerformance?: string
  verificationCode: string
  issueDate: string
  remarks?: string
}

const INITIAL_INTERNS: AdminIntern[] = [
  {
    id: 1,
    certificateId: 'ORBIT-I/INT/2026/01',
    fullName: 'Muhammad Zeeshan',
    email: 'zeeshan.dev@gmail.com',
    phone: '+92 300 1234567',
    department: 'Full Stack Development',
    role: 'Full Stack Engineering Intern',
    startDate: '2026-01-01',
    endDate: '2026-03-25',
    duration: '3 Months',
    completionStatus: 'completed',
    certificateStatus: 'valid',
    gradePerformance: 'Distinction (A+)',
    verificationCode: 'ORB-SEC-7890-VLD-2026',
    issueDate: '2026-03-25',
    remarks: 'Demonstrated outstanding architectural skills in React, Node.js, and cloud deployment pipelines.',
  },
  {
    id: 2,
    certificateId: 'ORBIT-I/INT/2026/02',
    fullName: 'Ayesha Khan',
    email: 'ayesha.ai@gmail.com',
    phone: '+92 301 7654321',
    department: 'Artificial Intelligence & Data',
    role: 'AI / ML Research Intern',
    startDate: '2026-01-01',
    endDate: '2026-03-25',
    duration: '3 Months',
    completionStatus: 'completed',
    certificateStatus: 'valid',
    gradePerformance: 'Grade A',
    verificationCode: 'ORB-SEC-7891-VLD-2026',
    issueDate: '2026-03-25',
    remarks: 'Successfully trained and evaluated NLP model pipelines with high precision.',
  },
  {
    id: 3,
    certificateId: 'ORBIT-I/INT/2026/03',
    fullName: 'Hamza Farooq',
    email: 'hamza.uiux@gmail.com',
    phone: '+92 312 9876543',
    department: 'UI/UX & Product Design',
    role: 'Product Design Intern',
    startDate: '2026-02-01',
    endDate: '2026-04-30',
    duration: '3 Months',
    completionStatus: 'in_progress',
    certificateStatus: 'valid',
    gradePerformance: 'In Progress (A)',
    verificationCode: 'ORB-SEC-7892-PRG-2026',
    issueDate: '2026-02-01',
    remarks: 'Currently working on enterprise corporate design systems and client portals.',
  },
]

export function AdminInternsPage() {
  const [interns, setInterns] = useState<AdminIntern[]>(INITIAL_INTERNS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIntern, setEditingIntern] = useState<AdminIntern | null>(null)

  // Form State
  const [formData, setFormData] = useState<Partial<AdminIntern>>({
    certificateId: '',
    fullName: '',
    email: '',
    phone: '',
    department: 'Full Stack Development',
    role: '',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    duration: '3 Months',
    completionStatus: 'completed',
    certificateStatus: 'valid',
    gradePerformance: 'Distinction (A+)',
    issueDate: new Date().toISOString().split('T')[0],
    remarks: '',
  })

  const filteredInterns = interns.filter((item) => {
    const matchesSearch =
      item.certificateId.toLowerCase().includes(search.toLowerCase()) ||
      item.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.department.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'all' || item.certificateStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleOpenAdd = () => {
    setEditingIntern(null)
    const nextNum = String(interns.length + 1).padStart(2, '0')
    setFormData({
      certificateId: `ORBIT-I/INT/2026/${nextNum}`,
      fullName: '',
      email: '',
      phone: '',
      department: 'Full Stack Development',
      role: 'Software Engineering Intern',
      startDate: '2026-01-01',
      endDate: '2026-03-31',
      duration: '3 Months',
      completionStatus: 'completed',
      certificateStatus: 'valid',
      gradePerformance: 'Distinction (A+)',
      issueDate: new Date().toISOString().split('T')[0],
      remarks: '',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: AdminIntern) => {
    setEditingIntern(item)
    setFormData({ ...item })
    setIsModalOpen(true)
  }

  const handleDelete = (id: number | string) => {
    if (confirm('Are you sure you want to delete this intern certificate record?')) {
      setInterns((prev) => prev.filter((i) => i.id !== id))
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.certificateId || !formData.fullName || !formData.email) {
      alert('Please fill in required fields.')
      return
    }

    if (editingIntern) {
      setInterns((prev) =>
        prev.map((i) => (i.id === editingIntern.id ? ({ ...i, ...formData } as AdminIntern) : i))
      )
    } else {
      const newIntern: AdminIntern = {
        id: Date.now(),
        verificationCode: `ORB-SEC-${Math.floor(1000 + Math.random() * 9000)}-VLD-2026`,
        ...formData,
      } as AdminIntern
      setInterns((prev) => [newIntern, ...prev])
    }

    setIsModalOpen(false)
  }

  const handleExportCSV = () => {
    const headers = [
      'Certificate ID',
      'Full Name',
      'Email',
      'Phone',
      'Department',
      'Role',
      'Start Date',
      'End Date',
      'Duration',
      'Completion Status',
      'Certificate Status',
      'Grade',
      'Verification Code',
      'Issue Date',
    ]

    const rows = interns.map((i) => [
      `"${i.certificateId}"`,
      `"${i.fullName}"`,
      `"${i.email}"`,
      `"${i.phone || ''}"`,
      `"${i.department}"`,
      `"${i.role}"`,
      `"${i.startDate}"`,
      `"${i.endDate}"`,
      `"${i.duration}"`,
      `"${i.completionStatus}"`,
      `"${i.certificateStatus}"`,
      `"${i.gradePerformance || ''}"`,
      `"${i.verificationCode}"`,
      `"${i.issueDate}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `orbit-i-interns-registry-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const columns: DataTableColumn<AdminIntern>[] = [
    {
      header: 'Certificate ID',
      render: (i) => (
        <span className="font-mono text-xs font-semibold text-primary-400">
          {i.certificateId}
        </span>
      ),
    },
    {
      header: 'Intern Name',
      render: (i) => (
        <div>
          <p className="font-medium text-[var(--color-text-primary)]">{i.fullName}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{i.email}</p>
        </div>
      ),
    },
    {
      header: 'Department & Role',
      render: (i) => (
        <div>
          <p className="text-sm text-[var(--color-text-primary)]">{i.department}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">{i.role}</p>
        </div>
      ),
    },
    {
      header: 'Tenure',
      render: (i) => (
        <span className="text-xs text-[var(--color-text-muted)]">
          {i.duration} ({i.startDate.slice(5)} to {i.endDate.slice(5)})
        </span>
      ),
    },
    {
      header: 'Status',
      render: (i) => (
        <div className="flex flex-col gap-1">
          <Badge tone={i.certificateStatus === 'valid' ? 'success' : 'danger'}>
            {i.certificateStatus.toUpperCase()}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (i) => (
        <div className="flex items-center gap-1.5">
          <Link
            to={`/verify?id=${i.certificateId}`}
            target="_blank"
            title="View Public Verification"
            className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-primary-400"
          >
            <ExternalLink className="size-4" />
          </Link>
          <button
            onClick={() => handleOpenEdit(i)}
            title="Edit Record"
            className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-amber-400"
          >
            <Edit className="size-4" />
          </button>
          <button
            onClick={() => handleDelete(i.id)}
            title="Delete Record"
            className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-red-400"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">
            Intern &amp; Certificate Registry
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            SuperAdmin &amp; Admin management for certificate IDs, completion statuses, and digital credentials.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="md" onClick={handleExportCSV} className="gap-2">
            <Download className="size-4" /> Export CSV
          </Button>
          <Button size="md" onClick={handleOpenAdd} className="gap-2">
            <Plus className="size-4" /> Add Intern
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, role, department..."
            className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] py-2 pl-9 pr-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-primary-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="valid">Valid</option>
            <option value="expired">Expired</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        rows={filteredInterns}
        keyField={(i) => String(i.id)}
        emptyTitle="No interns found"
        emptyDescription="Add an intern or adjust your search filter."
      />

      {/* Add / Edit Intern Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIntern ? 'Edit Intern Record' : 'Add New Intern Record'}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Certificate ID"
              value={formData.certificateId}
              onChange={(e) => setFormData({ ...formData, certificateId: e.target.value })}
              placeholder="e.g. ORBIT-I/INT/2026/04"
              required
            />
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Muhammad Zeeshan"
              required
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="intern@domain.com"
              required
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+92 300 1234567"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-[var(--color-text-primary)]">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none"
              >
                <option value="Full Stack Development">Full Stack Development</option>
                <option value="Artificial Intelligence & Data">Artificial Intelligence &amp; Data</option>
                <option value="UI/UX & Product Design">UI/UX &amp; Product Design</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="Cloud Architecture & DevOps">Cloud Architecture &amp; DevOps</option>
                <option value="Cybersecurity & QA">Cybersecurity &amp; QA</option>
              </select>
            </div>
            <Input
              label="Designation / Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Full Stack Engineering Intern"
              required
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
            <Input
              label="Duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g. 3 Months"
              required
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-[var(--color-text-primary)]">Completion</label>
              <select
                value={formData.completionStatus}
                onChange={(e) =>
                  setFormData({ ...formData, completionStatus: e.target.value as any })
                }
                className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none"
              >
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-text-primary)]">Certificate Status</label>
              <select
                value={formData.certificateStatus}
                onChange={(e) =>
                  setFormData({ ...formData, certificateStatus: e.target.value as any })
                }
                className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none"
              >
                <option value="valid">Valid</option>
                <option value="expired">Expired</option>
                <option value="revoked">Revoked</option>
              </select>
            </div>
            <Input
              label="Performance Grade"
              value={formData.gradePerformance}
              onChange={(e) => setFormData({ ...formData, gradePerformance: e.target.value })}
              placeholder="Distinction (A+)"
            />
          </div>

          <Input
            label="Issue Date"
            type="date"
            value={formData.issueDate}
            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
            required
          />

          <div>
            <label className="text-xs font-medium text-[var(--color-text-primary)]">Remarks / Evaluation</label>
            <textarea
              rows={3}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Evaluation notes, milestones completed, contributions..."
              className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="mt-2 flex justify-end gap-2 border-t border-[var(--color-border)] pt-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
