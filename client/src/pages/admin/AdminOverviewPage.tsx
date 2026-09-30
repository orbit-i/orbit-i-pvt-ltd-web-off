import { Link } from 'react-router-dom'
import {
  Users,
  ShoppingCart,
  Package,
  FolderKanban,
  DollarSign,
  Inbox,
  ShieldCheck,
  Building2,
  Award,
  CreditCard,
  Globe,
  FileText,
  UsersRound,
  ArrowRight,
  Activity,
  PlusCircle,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/States'
import { formatCurrency } from '@/utils/formatters'
import { adminService } from '@/services/adminService'
import { useFetch } from '@/hooks/useFetch'
import { ROUTES } from '@/constants'

export function AdminOverviewPage() {
  const { data: metrics, isLoading, error, refetch } = useFetch(() => adminService.getMetrics(), [])

  if (isLoading) return <PageLoader />
  if (error || !metrics) return <ErrorState onRetry={refetch} />

  const kpis = [
    {
      label: 'Total Registered Clients',
      value: String(metrics.totalClients),
      sub: 'Verified client organizations',
      icon: Users,
      to: ROUTES.adminClients,
      tone: 'text-blue-600 bg-blue-50',
      badge: 'Clients',
    },
    {
      label: 'Total Placed Orders',
      value: String(metrics.totalOrders),
      sub: 'Software orders & licenses',
      icon: ShoppingCart,
      to: ROUTES.adminOrders,
      tone: 'text-indigo-600 bg-indigo-50',
      badge: 'Commerce',
    },
    {
      label: 'Commercial Products',
      value: String(metrics.activeProducts),
      sub: 'Active catalog listings',
      icon: Package,
      to: ROUTES.adminProducts,
      tone: 'text-emerald-600 bg-emerald-50',
      badge: 'Catalog',
    },
    {
      label: 'Active Engineering Sprints',
      value: String(metrics.activeProjects),
      sub: 'In-progress client architectures',
      icon: FolderKanban,
      to: ROUTES.adminProjects,
      tone: 'text-violet-600 bg-violet-50',
      badge: 'Projects',
    },
    {
      label: 'Recognized Revenue',
      value: formatCurrency(metrics.revenue),
      sub: 'Settled & confirmed invoices',
      icon: DollarSign,
      to: ROUTES.adminOrders,
      tone: 'text-emerald-600 bg-emerald-50',
      badge: 'Finance',
    },
    {
      label: 'Pending Inbound Leads',
      value: String(metrics.pendingLeads),
      sub: 'New inquiries awaiting reply',
      icon: Inbox,
      to: ROUTES.adminLeads,
      tone: metrics.pendingLeads > 0 ? 'text-amber-600 bg-amber-50' : 'text-slate-600 bg-slate-50',
      badge: metrics.pendingLeads > 0 ? 'Action Needed' : 'Caught Up',
    },
  ]

  const quickModules = [
    {
      title: 'Interns & Certificates',
      desc: 'Verify, issue, and manage official SECP traineeship credentials.',
      icon: Award,
      to: ROUTES.adminInterns,
      count: 'Registry Active',
    },
    {
      title: 'Payment Gateways & Banking',
      desc: 'JazzCash, EasyPaisa, NayaPay, IBAN, and Stripe rails.',
      icon: CreditCard,
      to: ROUTES.adminPaymentGateways,
      count: 'Multi-Rail',
    },
    {
      title: 'Partners & Strategic Alliances',
      desc: 'Corporate alliances and enterprise technology partners.',
      icon: Building2,
      to: ROUTES.adminPartners,
      count: 'Directory',
    },
    {
      title: 'CMS Dynamic Pages',
      desc: 'Publish, edit, and optimize corporate public landing pages.',
      icon: Globe,
      to: ROUTES.adminCmsPages,
      count: 'CMS Engine',
    },
    {
      title: 'Articles & WordPress Blog',
      desc: 'Technical articles, engineering insights, and SEO posts.',
      icon: FileText,
      to: ROUTES.adminBlog,
      count: 'Articles',
    },
    {
      title: 'Corporate Team Roster',
      desc: 'Senior software architects, leadership, and staff listings.',
      icon: UsersRound,
      to: ROUTES.adminTeam,
      count: 'Leadership',
    },
  ]

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Executive Command Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <ShieldCheck className="size-3.5" />
            Executive Administration
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Enterprise Command Center
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Operational oversight, client contracts, engineering deliverables, and corporate compliance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to={ROUTES.adminProjects}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="size-4" />
            New Project
          </Link>
          <Link
            to={ROUTES.adminCareers}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            Post Career Job
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid (6 metrics) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => (
          <Link key={k.label} to={k.to} className="group">
            <Card className="flex flex-col justify-between h-full p-5 bg-white border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className={`flex size-11 items-center justify-center rounded-xl ${k.tone} group-hover:scale-105 transition-transform`}>
                  <k.icon className="size-5.5" aria-hidden />
                </div>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                  {k.badge}
                </span>
              </div>
              <div className="mt-4">
                <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  {k.value}
                </p>
                <p className="text-sm font-semibold text-slate-700 mt-1">{k.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{k.sub}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-medium group-hover:text-blue-700">
                <span>Manage records</span>
                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* 2-Column Section: Operational Modules (2 cols) & System Health (1 col) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Operations Modules */}
        <div className="lg:col-span-2">
          <Card hoverable={false} className="p-6 bg-white border-slate-200 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">
                  Management &amp; Governance Modules
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct access to enterprise modules, intern verification, and payment gateways.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {quickModules.map((mod) => (
                <Link
                  key={mod.title}
                  to={mod.to}
                  className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <mod.icon className="size-4.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {mod.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {mod.desc}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-200/60 pt-2 font-medium">
                    <span>{mod.count}</span>
                    <span className="text-blue-600 group-hover:underline">Open module →</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* System & Regulatory Health Widget */}
        <div className="lg:col-span-1">
          <Card hoverable={false} className="p-6 bg-white border-slate-200 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Activity className="size-4 text-emerald-600" aria-hidden />
                <h3 className="font-display text-sm font-bold text-slate-900">
                  Corporate Health &amp; Compliance
                </h3>
              </div>
              <div className="mt-4 space-y-3.5 text-xs text-slate-600">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">SECP Corporate Standing</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                    <ShieldCheck className="size-3.5" />
                    Incorporated Active
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">FBR NTN Tax Compliance</span>
                  <span className="font-semibold text-slate-800">Verified Registered</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">PSEB Software Export</span>
                  <span className="font-semibold text-slate-800">Compliant Member</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Payment Gateways</span>
                  <span className="font-semibold text-emerald-600">All 5 Rails Online</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500 font-medium">Security Guard</span>
                  <span className="font-semibold text-blue-600">JWT RBAC Guarded</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                to={ROUTES.privacy}
                className="inline-flex items-center justify-between w-full text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <span>Review Public Legal Policies</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

