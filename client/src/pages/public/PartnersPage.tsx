import { useEffect, useState } from 'react'
import { Handshake, ArrowUpRight, ShieldCheck, Zap, Globe } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { LinkButton } from '@/components/ui/LinkButton'
import { SEO } from '@/components/seo/SEO'
import { apiClient } from '@/services/apiClient'
import { ROUTES } from '@/constants'

interface Partner {
  id: number | string
  name: string
  logoUrl?: string | null
  websiteUrl?: string | null
  category: 'enterprise' | 'fintech' | 'cloud' | 'academic'
  description?: string | null
  isFeatured: boolean
}

export function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')

  useEffect(() => {
    apiClient
      .get('/partners')
      .then((res) => {
        if (res.data?.data) setPartners(res.data.data)
      })
      .catch(() => {
        // Fallback corporate data
        setPartners([
          {
            id: 1,
            name: 'JazzCash Merchant Solutions',
            logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&q=80',
            websiteUrl: 'https://www.jazzcash.com.pk/',
            category: 'fintech',
            description: 'Direct mobile wallet and payment gateway merchant integration for corporate invoice settlements.',
            isFeatured: true,
          },
          {
            id: 2,
            name: 'EasyPaisa Business Gateways',
            logoUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=200&q=80',
            websiteUrl: 'https://easypaisa.com.pk/',
            category: 'fintech',
            description: 'Instant OTC and direct wallet checkout integration across web & mobile portals.',
            isFeatured: true,
          },
          {
            id: 3,
            name: 'Meezan Bank Limited',
            logoUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=200&q=80',
            websiteUrl: 'https://www.meezanbank.com/',
            category: 'enterprise',
            description: 'Corporate banking partner for verified IBAN wire settlements and institutional accounts.',
            isFeatured: true,
          },
          {
            id: 4,
            name: 'Hostinger Cloud Infrastructure',
            logoUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=200&q=80',
            websiteUrl: 'https://www.hostinger.com/',
            category: 'cloud',
            description: 'High-availability Node.js runtime and MySQL cloud cluster hosting partner.',
            isFeatured: true,
          },
          {
            id: 5,
            name: 'Cloudflare Enterprise Edge',
            logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80',
            websiteUrl: 'https://www.cloudflare.com/',
            category: 'cloud',
            description: 'DDoS mitigation, web application firewall (WAF), and edge SSL caching layer.',
            isFeatured: true,
          },
          {
            id: 6,
            name: 'NayaPay Financial',
            logoUrl: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=200&q=80',
            websiteUrl: 'https://www.nayapay.com/',
            category: 'fintech',
            description: 'Digital wallet and Visa debit settlement rails for online transactions.',
            isFeatured: true,
          },
          {
            id: 7,
            name: 'FAST-NUCES Innovation Hub',
            logoUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80',
            websiteUrl: 'https://nu.edu.pk/',
            category: 'academic',
            description: 'Academic partnership for graduate trainee onboarding, AI research, and verified internships.',
            isFeatured: true,
          },
          {
            id: 8,
            name: 'Stripe Global Payments',
            logoUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=200&q=80',
            websiteUrl: 'https://stripe.com/',
            category: 'fintech',
            description: 'International card processing engine for USD and global enterprise clients.',
            isFeatured: true,
          },
        ])
      })
  }, [])

  const categories = [
    { key: 'all', label: 'All Partners' },
    { key: 'fintech', label: 'FinTech & Banking' },
    { key: 'cloud', label: 'Cloud & Infrastructure' },
    { key: 'enterprise', label: 'Enterprise Clients' },
    { key: 'academic', label: 'Academic & Research' },
  ]

  const filtered = activeCategory === 'all'
    ? partners
    : partners.filter((p) => p.category === activeCategory)

  return (
    <>
      <SEO
        title="Partners & Technology Alliances | ORBIT-I Private Limited"
        description="Explore ORBIT-I Private Limited's corporate alliances, banking integrations, and cloud infrastructure partners."
        path="/partners"
      />

      <div className="pb-24">
        {/* Centered Page Header */}
        <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-xs">
                <Handshake className="size-3.5" /> Corporate Ecosystem &amp; Alliances
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                Technology alliances &amp; enterprise integrations
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
                ORBIT-I collaborates with market-leading financial institutions, cloud infrastructure providers, and enterprise technology leaders to deliver mission-critical software solutions.
              </p>

              {/* Filter buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {categories.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setActiveCategory(c.key)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      activeCategory === c.key
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Partners Grid */}
        <section className="py-16">
          <div className="container-app">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((partner) => (
                <Card key={partner.id} className="flex flex-col justify-between p-6">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      {partner.logoUrl ? (
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="size-14 rounded-md object-cover border border-[var(--color-border)] shrink-0"
                        />
                      ) : (
                        <div className="flex size-14 items-center justify-center rounded-md bg-primary-500/15 font-display text-lg font-bold text-primary-300 shrink-0">
                          {partner.name.charAt(0)}
                        </div>
                      )}

                      <span className="rounded bg-[var(--color-background)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-400">
                        {partner.category}
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-lg font-semibold text-[var(--color-text-primary)]">
                      {partner.name}
                    </h3>

                    {partner.description && (
                      <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {partner.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 border-t border-[var(--color-border)] pt-4">
                    {partner.websiteUrl ? (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-400 hover:text-primary-300"
                      >
                        Official Website <ArrowUpRight className="size-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-[var(--color-text-muted)]">Verified Partner</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Value Pillars */}
        <section className="border-t border-[var(--color-border)] py-16">
          <div className="container-app">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <ShieldCheck className="size-6 text-primary-400 mb-3" />
                <h4 className="font-display text-base font-semibold text-[var(--color-text-primary)]">
                  Certified Architecture
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  All integrations adhere to strict PCI-DSS, ISO, and enterprise security encryption protocols.
                </p>
              </div>

              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <Zap className="size-6 text-primary-400 mb-3" />
                <h4 className="font-display text-base font-semibold text-[var(--color-text-primary)]">
                  High-Throughput Settlement
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  Instant invoice verification through JazzCash, EasyPaisa, NayaPay, and direct banking rails.
                </p>
              </div>

              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <Globe className="size-6 text-primary-400 mb-3" />
                <h4 className="font-display text-base font-semibold text-[var(--color-text-primary)]">
                  Hostinger Cloud Resilience
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  Deployed on optimized Node.js engines with managed relational MySQL clusters and edge protection.
                </p>
              </div>
            </div>

            <div className="mt-12 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center sm:p-10">
              <h3 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
                Partner with ORBIT-I Private Limited
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Whether you represent an enterprise business, fintech service, or cloud vendor, our engineering
                team is ready to discuss custom platform integrations.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <LinkButton to={ROUTES.contact}>
                  Initiate Partnership <ArrowUpRight className="ml-1 size-4" />
                </LinkButton>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
