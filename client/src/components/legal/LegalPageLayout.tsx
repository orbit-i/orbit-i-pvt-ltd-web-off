import type { ReactNode } from 'react'

export interface LegalSection {
  id: string
  title: string
}

export interface LegalPageLayoutProps {
  title: string
  subtitle?: string
  lastUpdated: string
  sections?: LegalSection[]
  children: ReactNode
}

/**
 * Standard, clean static legal & policy page layout.
 * Free of card borders, box layouts, artificial badges, or print buttons.
 */
export function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="py-12 sm:py-16 bg-white dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simple Document Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {subtitle}
            </p>
          )}
          <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Last updated: {lastUpdated}
          </p>
        </header>

        {/* Clean Static Document Content */}
        <div className="text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-6
          [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:pt-4 [&_h2]:border-t [&_h2]:border-slate-100 [&_h2]:dark:border-slate-800 [&_h2:first-of-type]:mt-0 [&_h2:first-of-type]:pt-0 [&_h2:first-of-type]:border-0
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:dark:text-white [&_h3]:mt-6 [&_h3]:mb-2
          [&_p]:leading-relaxed [&_p]:mb-4
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:mb-4
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ol]:mb-4
          [&_strong]:font-semibold [&_strong]:text-slate-900 [&_strong]:dark:text-white
          [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-700"
        >
          {children}
        </div>
      </div>
    </div>
  )
}
