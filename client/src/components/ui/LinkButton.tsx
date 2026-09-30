import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: Variant
  size?: Size
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-blue-600 text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 font-semibold',
  outline:
    'border border-slate-300 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 shadow-xs font-semibold',
  ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-xs font-semibold',
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
}

/** A React Router <Link> styled identically to <Button>, for nav CTAs. */
export function LinkButton({ className, variant = 'primary', size = 'md', children, ...props }: LinkButtonProps) {
  return (
    <Link
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium',
        'transition-all duration-200 ease-out whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
