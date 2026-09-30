import { useState, type FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import {
  UserCircle,
  ShieldCheck,
  Lock,
  Bell,
  LifeBuoy,
  Clock,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button, Modal } from '@/components/ui'
import { Badge } from '@/components/ui/Badge'
import { ErrorState } from '@/components/ui/States'
import { PageLoader } from '@/components/ui/Loader'
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate } from '@/utils/formatters'
import { getApiErrorMessage } from '@/utils/apiError'
import { supportService } from '@/services/supportService'
import { useFetch } from '@/hooks/useFetch'
import { ROUTES } from '@/constants'
import type { SupportTicket } from '@/types'

export function ClientProfilePage() {
  const { user } = useAuth()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { fullName: user?.fullName ?? '', email: user?.email ?? '' },
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-bold text-slate-900">Client Account Profile</h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage your verified contact details and enterprise credentials.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Profile Form (2 cols) */}
        <div className="lg:col-span-2">
          <Card hoverable={false} className="p-6 bg-white border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <UserCircle className="size-5 text-blue-600" aria-hidden />
              <h3 className="font-semibold text-slate-900">Personal &amp; Company Details</h3>
            </div>
            <form onSubmit={handleSubmit(() => {})} className="mt-5 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full legal name" {...register('fullName')} />
                <Input
                  label="Official email address"
                  type="email"
                  disabled
                  hint="Contact support to change primary billing email."
                  {...register('email')}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Designated organization"
                  defaultValue="Enterprise Client"
                  hint="Associated with your signed Statement of Work."
                  disabled
                />
                <Input
                  label="Registered jurisdiction"
                  defaultValue="Islamic Republic of Pakistan"
                  disabled
                />
              </div>
              <div className="pt-2">
                <Button type="submit" isLoading={isSubmitting} className="self-start">
                  Save profile changes
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Security & Verification Status Card (1 col) */}
        <div className="lg:col-span-1">
          <Card hoverable={false} className="p-6 bg-white border-slate-200 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="size-4 text-emerald-600" aria-hidden />
                <h3 className="text-sm font-semibold text-slate-900">Account Credentials</h3>
              </div>
              <div className="mt-4 space-y-3.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Account Tier</span>
                  <Badge tone="success">Verified Enterprise Client</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Role Authority</span>
                  <span className="font-medium text-slate-800">{user?.role ?? 'client'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Security Standard</span>
                  <span className="font-medium text-slate-800">TLS 1.3 / Bcrypt RBAC</span>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <p className="font-medium text-slate-900 mb-1">Corporate Protection:</p>
                  <p className="leading-relaxed">
                    All source repositories and invoices are governed by ORBIT-I Private Limited under SECP regulations.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to={ROUTES.privacy}
                className="text-xs font-medium text-blue-600 hover:underline flex items-center justify-between"
              >
                <span>Privacy &amp; Data Rights</span>
                <ExternalLink className="size-3" />
              </Link>
              <Link
                to={ROUTES.securityPolicy}
                className="text-xs font-medium text-blue-600 hover:underline flex items-center justify-between"
              >
                <span>Security Safeguards</span>
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function ClientSettingsPage() {
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyProject, setNotifyProject] = useState(true)
  const [notifyInvoices, setNotifyInvoices] = useState(true)
  const [notifySecurity, setNotifySecurity] = useState(true)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-bold text-slate-900">Account Settings &amp; Preferences</h2>
        <p className="mt-1 text-sm text-slate-600">
          Control notification delivery, sprint alerts, and data preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Notification Settings (2 cols) */}
        <div className="lg:col-span-2">
          <Card hoverable={false} className="p-6 bg-white border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Bell className="size-5 text-blue-600" aria-hidden />
              <h3 className="font-semibold text-slate-900">Communication &amp; Event Notifications</h3>
            </div>
            <div className="divide-y divide-slate-100">
              <ToggleRow
                label="Email notifications"
                description="Receive order confirmations, sprint recaps, and weekly project digest."
                checked={notifyEmail}
                onChange={setNotifyEmail}
              />
              <ToggleRow
                label="Project milestone alerts"
                description="Instant alert when an engineering milestone is deployed for client review."
                checked={notifyProject}
                onChange={setNotifyProject}
              />
              <ToggleRow
                label="Invoice &amp; payment receipts"
                description="Automated digital invoice dispatch with FBR-compliant tax details."
                checked={notifyInvoices}
                onChange={setNotifyInvoices}
              />
              <ToggleRow
                label="Critical security warnings"
                description="Immediate alerts on new login locations, password resets, or system notices."
                checked={notifySecurity}
                onChange={setNotifySecurity}
              />
            </div>
          </Card>
        </div>

        {/* Data Governance Card (1 col) */}
        <div className="lg:col-span-1">
          <Card hoverable={false} className="p-6 bg-white border-slate-200 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Lock className="size-4 text-blue-600" aria-hidden />
                <h3 className="text-sm font-semibold text-slate-900">Data Governance</h3>
              </div>
              <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600">
                <p>
                  ORBIT-I Private Limited enforces strict role segregation. Your code artifacts and billing records are stored in encrypted partitions.
                </p>
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Session Status</span>
                    <Badge tone="success">Active (Secure)</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Data Location</span>
                    <span className="font-medium text-slate-700">Encrypted Cloud DC</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to={ROUTES.terms}
                className="text-xs font-medium text-blue-600 hover:underline flex items-center justify-between"
              >
                <span>Terms of Service</span>
                <ExternalLink className="size-3" />
              </Link>
              <Link
                to={ROUTES.privacy}
                className="text-xs font-medium text-blue-600 hover:underline flex items-center justify-between"
              >
                <span>Privacy Statement</span>
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="pr-4">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer ${
          checked ? 'bg-blue-600' : 'bg-slate-200'
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow-xs transition-transform ${
            checked ? 'translate-x-5.5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

export function ClientSupportPage() {
  const { data: tickets, isLoading, error, refetch } = useFetch(() => supportService.listMine(), [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({ subject: '', message: '' })
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const columns: DataTableColumn<SupportTicket>[] = [
    { header: 'Subject', render: (t) => <span className="font-semibold text-slate-900">{t.subject}</span> },
    { header: 'Status', render: (t) => <Badge tone={t.status === 'open' ? 'warning' : 'success'}>{t.status}</Badge> },
    { header: 'Opened', render: (t) => formatDate(t.createdAt) },
  ]

  const openModal = () => {
    setForm({ subject: '', message: '' })
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.subject.trim() || !form.message.trim()) {
      setFormError('Please fill in both the subject and message.')
      return
    }
    if (form.subject.trim().length < 3) {
      setFormError('Subject must be at least 3 characters.')
      return
    }
    if (form.message.trim().length < 10) {
      setFormError('Message must be at least 10 characters.')
      return
    }

    setFormError(null)
    setIsSubmitting(true)
    try {
      await supportService.create({ subject: form.subject.trim(), message: form.message.trim() })
      setIsModalOpen(false)
      setForm({ subject: '', message: '' })
      refetch()
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Could not create your support ticket. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">Client Support &amp; Help Desk</h2>
          <p className="mt-1 text-sm text-slate-600">
            Open a dedicated ticket for urgent engineering escalations, bug reports, or project inquiries.
          </p>
        </div>
        <Button size="md" onClick={openModal}>
          Open New Ticket
        </Button>
      </div>

      {/* Support KPI Badges */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card hoverable={false} className="p-4 bg-white border-slate-200 shadow-xs flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <LifeBuoy className="size-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tickets Active</p>
            <p className="text-lg font-bold text-slate-900">{(tickets ?? []).length}</p>
          </div>
        </Card>
        <Card hoverable={false} className="p-4 bg-white border-slate-200 shadow-xs flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Clock className="size-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Typical Response SLA</p>
            <p className="text-lg font-bold text-slate-900">&lt; 4 Hours</p>
          </div>
        </Card>
        <Card hoverable={false} className="p-4 bg-white border-slate-200 shadow-xs flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Support Tier</p>
            <p className="text-lg font-bold text-slate-900">Direct Senior Architect</p>
          </div>
        </Card>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <DataTable
          columns={columns}
          rows={tickets ?? []}
          keyField={(t) => t.id}
          emptyTitle="No support tickets opened"
          emptyDescription="Submit a ticket above and our engineering leads will assist you promptly."
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Open Engineering Support Ticket">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Subject"
            value={form.subject}
            onChange={(event) => setForm({ ...form, subject: event.target.value })}
            placeholder="E.g., Production API webhook question, UI clarification"
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="support-message" className="text-sm font-medium text-slate-900">
              Detailed Description
            </label>
            <textarea
              id="support-message"
              rows={5}
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              placeholder="Provide exact reproduction steps, sprint milestone details, or error messages."
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          {formError && <p className="text-sm text-red-600 font-medium">{formError}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export { ClientInvoicesPage } from './ClientInvoicesPage'

