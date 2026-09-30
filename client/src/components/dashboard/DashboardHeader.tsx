import { Bell, Menu } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface DashboardHeaderProps {
  title: string
  onMenuClick: () => void
}

export function DashboardHeader({ title, onMenuClick }: DashboardHeaderProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-[var(--header-height)] items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 shadow-[var(--shadow-sm)] lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="text-[var(--color-text-primary)] lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="size-6" />
        </button>
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative flex size-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          aria-label="Notifications"
        >
          <Bell className="size-4.5" aria-hidden />
        </button>
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary-600/30 text-xs font-semibold text-primary-200">
            {user?.fullName?.charAt(0).toUpperCase() ?? 'U'}
          </span>
          <span className="hidden text-sm font-medium text-[var(--color-text-primary)] sm:inline">
            {user?.fullName}
          </span>
        </div>
      </div>
    </header>
  )
}
