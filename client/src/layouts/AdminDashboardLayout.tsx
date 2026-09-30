import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FolderKanban,
  Briefcase,
  FileText,
  Inbox,
  LifeBuoy,
  Star,
  UsersRound,
  Settings,
  Award,
  CreditCard,
  Handshake,
  Globe,
} from 'lucide-react'
import { DashboardSidebar, type SidebarNavItem } from '@/components/dashboard/DashboardSidebar'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { ROUTES } from '@/constants'
import { useAuth } from '@/contexts/AuthContext'

const navItems: SidebarNavItem[] = [
  { label: 'Overview', to: ROUTES.adminDashboard, icon: LayoutDashboard, end: true },
  { label: 'Clients', to: ROUTES.adminClients, icon: Users },
  { label: 'Interns', to: ROUTES.adminInterns, icon: Award },
  { label: 'Payment Gateways', to: ROUTES.adminPaymentGateways, icon: CreditCard },
  { label: 'Partners', to: ROUTES.adminPartners, icon: Handshake },
  { label: 'CMS Pages', to: ROUTES.adminCmsPages, icon: Globe },
  { label: 'Articles & Blog', to: ROUTES.adminBlog, icon: FileText },
  { label: 'Corporate Team', to: ROUTES.adminTeam, icon: UsersRound },
  { label: 'Products', to: ROUTES.adminProducts, icon: Package },
  { label: 'Orders', to: ROUTES.adminOrders, icon: ShoppingCart },
  { label: 'Projects', to: ROUTES.adminProjects, icon: FolderKanban },
  { label: 'Careers', to: ROUTES.adminCareers, icon: Briefcase },
  { label: 'Applications', to: ROUTES.adminApplications, icon: FileText },
  { label: 'Leads', to: ROUTES.adminLeads, icon: Inbox },
  { label: 'SEO Dashboard', to: ROUTES.adminSeoDashboard, icon: LayoutDashboard },
  { label: 'Support', to: ROUTES.adminSupport, icon: LifeBuoy },
  { label: 'Case Studies', to: ROUTES.adminCaseStudies, icon: FileText },
  { label: 'Categories', to: ROUTES.adminCategories, icon: FolderKanban },
  { label: 'Tags', to: ROUTES.adminTags, icon: Star },
  { label: 'Testimonials', to: ROUTES.adminTestimonials, icon: Star },
  { label: 'Settings', to: ROUTES.adminSettings, icon: Settings },
]

const titleByPath: Record<string, string> = {
  [ROUTES.adminDashboard]: 'Overview',
  [ROUTES.adminInterns]: 'Interns Registry',
  [ROUTES.adminPaymentGateways]: 'Payment Gateways & Banking',
  [ROUTES.adminPartners]: 'Partners & Alliances',
  [ROUTES.adminCmsPages]: 'CMS Content Pages',
  [ROUTES.adminSeoDashboard]: 'SEO Dashboard',
  [ROUTES.adminClients]: 'Clients',
  [ROUTES.adminProducts]: 'Products',
  [ROUTES.adminOrders]: 'Orders',
  [ROUTES.adminProjects]: 'Projects',
  [ROUTES.adminCareers]: 'Careers',
  [ROUTES.adminApplications]: 'Applications',
  [ROUTES.adminLeads]: 'Leads',
  [ROUTES.adminSupport]: 'Support',
  [ROUTES.adminCaseStudies]: 'Case Studies',
  [ROUTES.adminBlog]: 'Articles & Blog (WordPress CMS)',
  [ROUTES.adminCategories]: 'Categories',
  [ROUTES.adminTags]: 'Tags',
  [ROUTES.adminTestimonials]: 'Testimonials',
  [ROUTES.adminTeam]: 'Corporate Team',
  [ROUTES.adminSettings]: 'Settings',
}

export function AdminDashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const { user } = useAuth()
  const visibleNavItems = user?.role === 'editor' || user?.role === 'seo_manager'
    ? navItems.filter(
      (item) => item.to === ROUTES.adminSeoDashboard
        || item.to === ROUTES.adminBlog
        || item.to === ROUTES.adminCaseStudies
        || item.to === ROUTES.adminCategories
        || item.to === ROUTES.adminTags,
    )
    : navItems

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <DashboardSidebar
        items={visibleNavItems}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        footerLabel="ORBIT-I Admin Console"
      />
      <div className="flex flex-1 flex-col">
        <DashboardHeader title={titleByPath[pathname] ?? 'Admin'} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
