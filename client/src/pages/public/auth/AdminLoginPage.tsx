import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants'
import { ShieldAlert, Lock, CheckCircle2 } from 'lucide-react'

const adminLoginSchema = z.object({
  email: z.string().email('Enter a valid corporate email'),
  password: z.string().min(1, 'Master password is required'),
})
type AdminLoginForm = z.infer<typeof adminLoginSchema>

export function AdminLoginPage() {
  const { login, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginForm>({ resolver: zodResolver(adminLoginSchema) })

  const onSubmit = async (values: AdminLoginForm) => {
    setFormError(null)
    try {
      const loggedInUser = await login(values)

      // Strictly enforce: Only administrators/managers can enter through this gate
      const isAdmin =
        loggedInUser.role === 'admin' ||
        loggedInUser.role === 'super_admin' ||
        loggedInUser.role === 'editor' ||
        loggedInUser.role === 'seo_manager'

      if (!isAdmin) {
        await logout()
        setFormError('ACCESS DENIED: Client credentials are not authorized on the Corporate Security Gate. Please use the public client login.')
        return
      }

      const defaultRoute =
        loggedInUser.role === 'seo_manager'
          ? ROUTES.adminSeoDashboard
          : loggedInUser.role === 'editor'
          ? ROUTES.adminBlog
          : ROUTES.adminDashboard

      const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? defaultRoute
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : null
      setFormError(message || 'Access Denied: Invalid administrative credentials or account locked.')
    }
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      {/* Background Decorative Tech Elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Security Clearance Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-wider mb-4">
            <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Restricted Gateway • Clearance Level 4</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            <Lock className="w-7 h-7 text-primary-400" />
            ORBIT-I Gate
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Administrative & Executive Command Portal. Unauthorized access is strictly logged and audited.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-7 shadow-2xl shadow-black/80">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <Input
                label="Corporate Administrative ID / Email"
                type="email"
                placeholder="admin@orbit-i.com"
                error={errors.email?.message}
                {...register('email')}
                className="bg-slate-950/60 border-slate-700 text-white placeholder-slate-500 focus:border-primary-500"
              />
            </div>

            <div>
              <Input
                label="Master Security Key"
                type="password"
                placeholder="••••••••••••"
                error={errors.password?.message}
                {...register('password')}
                className="bg-slate-950/60 border-slate-700 text-white placeholder-slate-500 focus:border-primary-500"
              />
            </div>

            {formError && (
              <div className="p-3.5 rounded-lg bg-red-950/50 border border-red-500/30 text-red-300 text-xs font-medium flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isSubmitting}
              size="lg"
              className="mt-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-primary-950/50"
            >
              Verify & Enter Console
            </Button>
          </form>

          {/* Security Protocols Notice */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 • AES-256 SESSION ENCRYPTION • SECURE ENCLAVE</span>
            </div>
            <p className="mt-2 text-[10px] text-slate-600">
              Session tokens are cryptographically signed. All login attempts record IP address, browser fingerprint, and timestamp.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
