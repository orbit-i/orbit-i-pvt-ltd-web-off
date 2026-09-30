import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  FolderKanban,
  Receipt,
  LifeBuoy,
  ArrowRight,
  ShieldCheck,
  Package,
  FileCheck,
  CreditCard,
  Building2,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState } from '@/components/ui/States'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants'
import { orderService } from '@/services/orderService'
import { projectService } from '@/services/projectService'
import { useFetch } from '@/hooks/useFetch'

export function ClientOverviewPage() {
  const { user } = useAuth()
  const { data: orders, isLoading: ordersLoading } = useFetch(() => orderService.listMine(), [])
  const { data: projects, isLoading: projectsLoading } = useFetch(() => projectService.listMine(), [])

  const isLoading = ordersLoading || projectsLoading
  const activeOrders = (orders ?? []).filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length
  const activeProjects = (projects ?? []).filter((p) => p.status !== 'completed').length
  const featuredProject = (projects ?? [])[0]

  const summaryCards = [
    {
      label: 'Active Orders',
      value: String(activeOrders),
      desc: 'Products & service licenses in progress',
      icon: ShoppingBag,
      to: ROUTES.clientOrders,
      badge: `${activeOrders} Active`,
      badgeTone: activeOrders > 0 ? 'primary' : 'neutral',
    },
    {
      label: 'Engineering Projects',
      value: String(activeProjects),
      desc: 'Active custom sprints & architectures',
      icon: FolderKanban,
      to: ROUTES.clientProjects,
      badge: `${activeProjects} Running`,
      badgeTone: activeProjects > 0 ? 'success' : 'neutral',
    },
    {
      label: 'Invoices & Receipts',
      value: '3 Available',
      desc: 'Milestones & payment settlements',
      icon: Receipt,
      to: ROUTES.clientInvoices,
      badge: 'Online Pay',
      badgeTone: 'warning',
    },
    {
      label: 'Dedicated Support',
      value: '24/7 Available',
      desc: 'Direct priority engineering tickets',
      icon: LifeBuoy,
      to: ROUTES.clientSupport,
      badge: 'Priority',
      badgeTone: 'primary',
    },
  ] as const

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Client Welcome Banner */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-200 backdrop-blur-xs border border-white/15">
              <ShieldCheck className="size-3.5" aria-hidden />
              Verified Client Portal
            </div>
            <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}
            </h1>
            <p className="mt-2 text-sm text-blue-100/90 leading-relaxed">
              Manage your software milestones, review transparent invoicing, inspect live deliverables, and collaborate directly with senior ORBIT-I software architects.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 sm:flex-col sm:items-end">
            <Link
              to={ROUTES.clientInvoices}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-blue-900 shadow-xs hover:bg-blue-50 transition-colors"
            >
              <CreditCard className="size-4" aria-hidden />
              Pay Invoices Online
            </Link>
            <Link
              to={ROUTES.products}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700/60 border border-blue-500/30 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Package className="size-4" aria-hidden />
              Explore Products
            </Link>
          </div>
        </div>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          {/* 4 Summary KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card) => (
              <Link key={card.label} to={card.to} className="group">
                <Card className="flex flex-col justify-between h-full gap-3 p-5 bg-white border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <card.icon className="size-5" aria-hidden />
                    </div>
                    <Badge tone={card.badgeTone}>{card.badge}</Badge>
                  </div>
                  <div className="mt-1">
                    <p className="font-display text-2xl font-bold tracking-tight text-slate-900">{card.value}</p>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{card.label}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{card.desc}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* 2-Column Section: Active Project & Quick Operations */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Active Project Card (2 cols) */}
            <div className="lg:col-span-2">
              <Card hoverable={false} className="p-6 bg-white border-slate-200 shadow-xs h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-display text-base font-bold text-slate-900">
                        {featuredProject ? 'Primary Software Engagement' : 'Custom Engineering Projects'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Track live sprint progress, architecture deliverables, and acceptance criteria.
                      </p>
                    </div>
                    {featuredProject && (
                      <Link
                        to={ROUTES.clientProjectDetail(featuredProject.id)}
                        className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        View details <ArrowRight className="size-3.5" aria-hidden />
                      </Link>
                    )}
                  </div>

                  {featuredProject ? (
                    <div className="mt-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-base font-semibold text-slate-900">{featuredProject.name}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge tone="primary">{featuredProject.status.replace('_', ' ')}</Badge>
                            <span className="text-xs text-slate-500">Milestone Phase Active</span>
                          </div>
                        </div>
                        <div className="sm:text-right">
                          <p className="font-display text-2xl font-bold text-blue-600">
                            {featuredProject.progress}%
                          </p>
                          <p className="text-xs text-slate-500">Overall Milestone Completion</p>
                        </div>
                      </div>

                      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                          style={{ width: `${featuredProject.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <EmptyState
                        title="No custom projects active yet"
                        description="Custom software platforms and cloud systems engineered for your company by ORBIT-I will show up here."
                      />
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Engineered by ORBIT-I Private Limited</span>
                  <Link to={ROUTES.clientProjects} className="font-medium text-blue-600 hover:underline">
                    View all projects →
                  </Link>
                </div>
              </Card>
            </div>

            {/* Corporate Assurance & Compliance Card (1 col) */}
            <div className="lg:col-span-1">
              <Card hoverable={false} className="p-6 bg-white border-slate-200 shadow-xs h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Building2 className="size-4 text-blue-600" aria-hidden />
                    <h3 className="font-display text-sm font-bold text-slate-900">
                      Corporate Governance
                    </h3>
                  </div>
                  <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block font-semibold">SECP Registered Entity</strong>
                        Incorporated under the Companies Act of Pakistan.
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileCheck className="size-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block font-semibold">Tax &amp; FBR Compliant</strong>
                        Automated NTN and sales tax documentation on all invoices.
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CreditCard className="size-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block font-semibold">Multi-Channel Banking</strong>
                        JazzCash, EasyPaisa, NayaPay, Local IBAN &amp; Stripe.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    to={ROUTES.privacy}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between"
                  >
                    <span>View Corporate Policies</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

