import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

const toneStyles: Record<Tone, string> = {
  primary: 'bg-blue-50 text-blue-700 border-blue-200/80 font-semibold',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold',
  warning: 'bg-amber-50 text-amber-800 border-amber-200/80 font-semibold',
  danger: 'bg-rose-50 text-rose-700 border-rose-200/80 font-semibold',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200/90 font-medium',
}

export function Badge({ className, tone = 'neutral', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        toneStyles[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
