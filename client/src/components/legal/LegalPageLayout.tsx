import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ShieldCheck,
  Calendar,
  Building2,
  Printer,
  ChevronRight,
  Mail,
  Phone,
  FileText,
  Scale,
  RefreshCw,
  Lock,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { ROUTES } from '@/constants'
import { CONTACT_EMAIL, CONTACT_PHONE } from '@/config/socialLinks'

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

const LEGAL_TABS = [
  { label: 'Privacy Policy', to: ROUTES.privacy, icon: ShieldCheck },
  { label: 'Terms & Conditions', to: ROUTES.terms, icon: Scale },
  { label: 'Refund Policy', to: ROUTES.refundPolicy, icon: RefreshCw },
  { label: 'Security Policy', to: ROUTES.securityPolicy, icon: Lock },
  { label: 'Website Disclaimer', to: ROUTES.disclaimer, icon: AlertTriangle },
]

export function LegalPageLayout({
  title,
  subtitle = 'Official terms, policies, and operational guidelines governing ORBIT-I Private Limited platforms, client services, and enterprise software systems.',
  lastUpdated,
  sections: propSections,
  children,
}: LegalPageLayoutProps) {
  const { pathname } = useLocation()
  const contentRef = useRef<HTMLDivElement>(null)
  const [detectedSections, setDetectedSections] = useState<LegalSection[]>([])
  const [activeSectionId, setActiveSectionId] = useState<string>('')

  // Automatically detect sections from <h2> elements if not provided explicitly
  useEffect(() => {
    if (propSections && propSections.length > 0) {
      setDetectedSections(propSections)
      return
    }

    if (!contentRef.current) return
    const h2Elements = contentRef.current.querySelectorAll('h2')
    const list: LegalSection[] = []

    h2Elements.forEach((h2, index) => {
      let id = h2.id
      if (!id) {
        id = (h2.textContent || `section-${index}`)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
        h2.id = id
      }
      list.push({
        id,
        title: h2.textContent || `Section ${index + 1}`,
      })
    })

    setDetectedSections(list)
  }, [propSections, children])

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (detectedSections.length === 0) return
      const scrollPos = window.scrollY + 160

      for (let i = detectedSections.length - 1; i >= 0; i--) {
        const el = document.getElementById(detectedSections[i].id)
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(detectedSections[i].id)
          return
        }
      }
      if (detectedSections[0]) {
        setActiveSectionId(detectedSections[0].id)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [detectedSections])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Centered Enterprise Hero Header */}
      <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
        <div className="container-app">
          <div className="mx-auto max-w-3xl text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-xs">
              <ShieldCheck className="size-3.5" aria-hidden />
              Legal &amp; Regulatory Compliance
            </div>

            {/* Document Title */}
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.15]">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
              {subtitle}
            </p>

            {/* Metadata Badges & Print Action */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 border border-slate-200">
                <Calendar className="size-3.5 text-slate-500" aria-hidden />
                Last updated: {lastUpdated}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 border border-slate-200">
                <Building2 className="size-3.5 text-slate-500" aria-hidden />
                ORBIT-I Private Limited
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="size-3.5 text-emerald-600" aria-hidden />
                SECP &amp; FBR Registered
              </span>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 font-medium text-slate-700 border border-slate-200 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                title="Print this document or save as PDF"
              >
                <Printer className="size-3.5 text-slate-500" aria-hidden />
                Print / Save PDF
              </button>
            </div>
          </div>

          {/* Quick Legal Switcher Navigation Tabs */}
          <div className="mt-10 flex items-center justify-center">
            <nav
              aria-label="Legal documents"
              className="flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100/80 p-1.5 shadow-2xs"
            >
              {LEGAL_TABS.map((tab) => {
                const isActive = pathname === tab.to
                const Icon = tab.icon
                return (
                  <Link
                    key={tab.to}
                    to={tab.to}
                    className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white text-blue-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <Icon className={`size-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} aria-hidden />
                    {tab.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </section>

      {/* Main 2-Column Document Layout (Centered) */}
      <div className="container-app pt-10 sm:pt-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-start">
          {/* Left Column: Sticky Table of Contents & Support (Desktop) */}
          <aside className="w-full lg:w-72 lg:shrink-0 lg:sticky lg:top-24">
            <div className="flex flex-col gap-5">
              {/* Table of Contents Card */}
              {detectedSections.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <FileText className="size-4 text-blue-600" aria-hidden />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Table of Contents
                    </h3>
                  </div>
                  <nav className="mt-3.5 flex flex-col gap-1 max-h-[50vh] overflow-y-auto pr-1">
                    {detectedSections.map((sec) => {
                      const isCurrent = activeSectionId === sec.id
                      return (
                        <a
                          key={sec.id}
                          href={`#${sec.id}`}
                          className={`group flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs sm:text-sm transition-colors ${
                            isCurrent
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span className="line-clamp-1">{sec.title}</span>
                          <ChevronRight
                            className={`size-3 shrink-0 transition-transform ${
                              isCurrent
                                ? 'text-blue-600 translate-x-0.5'
                                : 'text-slate-300 group-hover:text-slate-400'
                            }`}
                            aria-hidden
                          />
                        </a>
                      )
                    })}
                  </nav>
                </div>
              )}

              {/* Corporate Identity & Legal Support Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Building2 className="size-4 text-slate-700" aria-hidden />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Corporate Entity
                  </h3>
                </div>
                <div className="mt-3 text-xs leading-relaxed text-slate-600 space-y-2">
                  <p className="font-semibold text-slate-900">ORBIT-I Private Limited</p>
                  <p>Incorporated under Companies Act with Securities &amp; Exchange Commission of Pakistan (SECP).</p>
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Mail className="size-3.5 shrink-0" aria-hidden />
                      <span className="line-clamp-1">{CONTACT_EMAIL}</span>
                    </a>
                    <a
                      href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`}
                      className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <Phone className="size-3.5 shrink-0" aria-hidden />
                      <span>{CONTACT_PHONE}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Column: Polished Document Paper */}
          <main className="min-w-0 flex-1">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 lg:p-12 shadow-xs">
              {/* Document Subheader / Legal Notice */}
              <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5">
                <div className="flex gap-3">
                  <ShieldCheck className="size-5 shrink-0 text-blue-600 mt-0.5" aria-hidden />
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <p className="font-semibold text-slate-900 mb-1">
                      Official Document of ORBIT-I Private Limited
                    </p>
                    <p>
                      This document constitutes a legally binding agreement and policy notice. Please read it carefully. By accessing our website, services, or client portal, you acknowledge and agree to these terms.
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Prose Content */}
              <div
                ref={contentRef}
                className="prose-orbit text-[15px] leading-relaxed text-slate-600 space-y-5
                  [&_h2]:scroll-mt-24
                  [&_h2]:text-xl
                  [&_h2]:font-bold
                  [&_h2]:tracking-tight
                  [&_h2]:text-slate-900
                  [&_h2]:mt-10
                  [&_h2]:pt-6
                  [&_h2]:border-t
                  [&_h2]:border-slate-100
                  [&_h2:first-of-type]:mt-0
                  [&_h2:first-of-type]:pt-0
                  [&_h2:first-of-type]:border-0
                  [&_p]:text-slate-600
                  [&_p]:leading-relaxed
                  [&_ul]:my-4
                  [&_ul]:space-y-2
                  [&_ul]:pl-5
                  [&_ul]:list-disc
                  [&_ul_li]:text-slate-600
                  [&_ul_li]:leading-relaxed
                  [&_strong]:font-semibold
                  [&_strong]:text-slate-900
                  [&_a]:text-blue-600
                  [&_a]:font-medium
                  [&_a]:underline
                  [&_a:hover]:text-blue-700"
              >
                {children}
              </div>

              {/* Document Footer Callout */}
              <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
                <h3 className="text-base font-semibold text-slate-900">
                  Questions regarding our policies?
                </h3>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  Our compliance and legal team is available to address any inquiries regarding terms, privacy data requests, or contractual agreements.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-xs hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="size-4" aria-hidden />
                    Contact Legal Team
                  </a>
                  <Link
                    to={ROUTES.contact}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    General Inquiries
                  </Link>
                </div>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  )
}

