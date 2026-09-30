import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  FolderKanban,
  UserCircle,
  Settings,
  LifeBuoy,
  Receipt,
} from 'lucide-react'
import { DashboardSidebar, type SidebarNavItem } from '@/components/dashboard/DashboardSidebar'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { ROUTES } from '@/constants'

const navItems: SidebarNavItem[] = [
  { label: 'Overview', to: ROUTES.clientDashboard, icon: LayoutDashboard, end: true },
  { label: 'Orders', to: ROUTES.clientOrders, icon: ShoppingBag },
  { label: 'Projects', to: ROUTES.clientProjects, icon: FolderKanban },
  { label: 'Invoices', to: ROUTES.clientInvoices, icon: Receipt },
  { label: 'Support', to: ROUTES.clientSupport, icon: LifeBuoy },
  { label: 'Profile', to: ROUTES.clientProfile, icon: UserCircle },
  { label: 'Settings', to: ROUTES.clientSettings, icon: Settings },
]

const titleByPath: Record<string, string> = {
  [ROUTES.clientDashboard]: 'Overview',
  [ROUTES.clientOrders]: 'Orders',
  [ROUTES.clientProjects]: 'Projects',
  [ROUTES.clientInvoices]: 'Invoices',
  [ROUTES.clientSupport]: 'Support',
  [ROUTES.clientProfile]: 'Profile',
  [ROUTES.clientSettings]: 'Settings',
}

export function ClientDashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <DashboardSidebar
        items={navItems}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        footerLabel="ORBIT-I Client Portal"
      />
      <div className="flex flex-1 flex-col lg:pl-0">
        <DashboardHeader title={titleByPath[pathname] ?? 'Dashboard'} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
