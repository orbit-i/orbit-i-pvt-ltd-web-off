import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react'
import { Logo } from './Logo'
import { LinkButton } from '@/components/ui/LinkButton'
import { Button } from '@/components/ui'
import { MAIN_NAV_LINKS, ROUTES } from '@/constants'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/utils/cn'

export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.home, { replace: true })
  }

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [])

  const dashboardRoute =
    user?.role === 'admin' || user?.role === 'super_admin'
      ? ROUTES.adminDashboard
      : user?.role === 'seo_manager'
        ? ROUTES.adminSeoDashboard
        : ROUTES.clientDashboard

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-colors duration-200',
        isScrolled
          ? 'border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]'
          : 'border-[var(--color-border)]/60 bg-[var(--color-background)]'
      )}
    >
      <nav className="container-app flex h-[var(--header-height)] items-center justify-between">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {MAIN_NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === ROUTES.home}
              className={({ isActive }) =>
                cn(
                  'rounded-[var(--radius-sm)] px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {!isAuthenticated ? (
            <>
              <Link
                to={ROUTES.login}
                className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                Log in
              </Link>
              <LinkButton to={ROUTES.register} size="md">
                Get started
              </LinkButton>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsAccountOpen((v) => !v)}
                className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-primary)] hover:border-primary-500/50"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-primary-600/30 text-xs font-semibold text-primary-200">
                  {user?.fullName?.charAt(0).toUpperCase() ?? 'U'}
                </span>
                {user?.fullName?.split(' ')[0]}
                <ChevronDown className="size-3.5" aria-hidden />
              </button>
              {isAccountOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-[var(--shadow-lg)]">
                  <Link
                    to={dashboardRoute}
                    className="flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-black/5"
                    onClick={() => setIsAccountOpen(false)}
                  >
                    <LayoutDashboard className="size-4" aria-hidden /> Dashboard
                  </Link>
                  <Link
                    to={ROUTES.clientProfile}
                    className="flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-black/5"
                    onClick={() => setIsAccountOpen(false)}
                  >
                    <UserIcon className="size-4" aria-hidden /> Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsAccountOpen(false)
                    }}
                    className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
                  >
                    <LogOut className="size-4" aria-hidden /> Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            className="rounded-[var(--radius-sm)] border border-[var(--color-border)] p-1.5 text-[var(--color-text-primary)]"
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {isMobileOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-5 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {MAIN_NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === ROUTES.home}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium',
                    isActive ? 'bg-primary-500/10 text-primary-400 font-semibold' : 'text-[var(--color-text-secondary)]'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-[var(--color-border)] pt-4">
            {!isAuthenticated ? (
              <>
                <LinkButton to={ROUTES.login} variant="outline">
                  Log in
                </LinkButton>
                <LinkButton to={ROUTES.register}>Get started</LinkButton>
              </>
            ) : (
              <>
                <LinkButton to={dashboardRoute} variant="outline">
                  Dashboard
                </LinkButton>
                <Button variant="ghost" onClick={() => handleLogout()}>
                  Log out
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
