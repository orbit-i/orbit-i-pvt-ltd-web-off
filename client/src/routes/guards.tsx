import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { PageLoader } from '@/components/ui'
import { ROUTES } from '@/constants'
import type { UserRole } from '@/types'

/**
 * Client-side route guards. These exist purely for UX (avoid flashing
 * protected UI, redirect users to the right place) — the backend performs
 * the real authorization check on every request. Never treat this as a
 * security boundary on its own.
 */

function isAdminRole(role: UserRole | undefined) {
  return role === 'editor' || role === 'seo_manager' || role === 'admin' || role === 'super_admin'
}

function defaultDashboardFor(role: UserRole | undefined) {
  if (role === 'editor') return ROUTES.adminBlog
  if (role === 'seo_manager') return ROUTES.adminSeoDashboard
  return isAdminRole(role) ? ROUTES.adminDashboard : ROUTES.clientDashboard
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to={ROUTES.login} state={{ from: location }} replace />

  return <>{children}</>
}

export function RoleRoute({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <PageLoader />
  if (!isAuthenticated) {
    const isTargetingAdmin = roles.some((r) => ['admin', 'super_admin', 'editor', 'seo_manager'].includes(r))
    return <Navigate to={isTargetingAdmin ? ROUTES.adminLogin : ROUTES.login} state={{ from: location }} replace />
  }
  // Wrong role for this section — send them to their own dashboard instead
  // of a generic "not allowed" page, since they're a valid logged-in user,
  // just not one who belongs on this route.
  if (!user || !roles.includes(user.role)) return <Navigate to={defaultDashboardFor(user?.role)} replace />

  return <>{children}</>
}

export function ContentRoleRoute({ children }: { children: ReactNode }) {
  return <RoleRoute roles={['editor', 'seo_manager', 'admin', 'super_admin']}>{children}</RoleRoute>
}

export function SensitiveRoleRoute({ children }: { children: ReactNode }) {
  return <RoleRoute roles={['admin', 'super_admin']}>{children}</RoleRoute>
}

export function GuestOnlyRoute({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <PageLoader />
  if (isAuthenticated) return <Navigate to={defaultDashboardFor(user?.role)} replace />

  return <>{children}</>
}
