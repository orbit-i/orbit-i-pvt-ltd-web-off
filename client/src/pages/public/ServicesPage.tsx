import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Smartphone, Wrench, PenTool, Cloud, Sparkles, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/Loader'
import { ErrorState, EmptyState } from '@/components/ui/States'
import { ROUTES } from '@/constants'
import { serviceContentService } from '@/services/contentService'
import { useFetch } from '@/hooks/useFetch'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { LinkButton } from '@/components/ui'

const serviceIcons: Record<string, typeof Code2> = { Code2, Smartphone, Wrench, PenTool, Cloud, Sparkles }

export function ServicesPage() {
  const { data: services, isLoading, error, refetch } = useFetch(() => serviceContentService.list(), [])

  return (
    <>
      <SEO {...PAGE_SEO.services} />
      <div className="pb-24">
        {/* Centered Page Header */}
        <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-xs">
                Engineering Capabilities
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                Engineering services scoped to your product
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
                From a single core feature to a full-scale cloud platform — every engagement adheres to strict architectural standards, rigorous automated testing, and comprehensive handover.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid Section */}
        <section className="bg-slate-50/60 py-16 lg:py-20">
          <div className="container-app">
            {isLoading ? (
              <div className="py-16"><PageLoader /></div>
            ) : error ? (
              <ErrorState onRetry={refetch} />
            ) : !services || services.length === 0 ? (
              <EmptyState title="No services listed yet" description="Check back soon." />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => {
                  const Icon = serviceIcons[service.icon] ?? Code2
                  return (
                    <Card
                      key={service.id}
                      className="group flex flex-col gap-4 p-7 bg-white border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon className="size-6" aria-hidden />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {service.title}
                        </h2>
                        <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{service.summary}</p>
                      </div>

                      {service.benefits && service.benefits.length > 0 && (
                        <div className="mt-2 flex flex-col gap-1.5">
                          {service.benefits.slice(0, 2).map((benefit, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                              <CheckCircle2 className="size-3.5 text-blue-600 shrink-0" />
                              <span className="truncate">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1.5">
                          {service.technologies?.slice(0, 2).map((tech) => (
                            <span key={tech} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <Link
                          to={ROUTES.serviceDetail(service.slug)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Details <ArrowRight className="size-3.5" aria-hidden />
                        </Link>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Process Section */}
        <section className="border-t border-slate-200 bg-white py-16 lg:py-20">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                Delivery Lifecycle
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                How we take your product from concept to production
              </h2>
              <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
                A structured, transparent delivery framework engineered to minimize risk.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: '01', title: 'Technical Discovery', desc: 'Requirements analysis, API contract design, and architecture blueprinting.' },
                { step: '02', title: 'Interactive Prototype', desc: 'Clickable wireframes and UX flows to validate user journeys before writing code.' },
                { step: '03', title: 'Sprint Development', desc: 'Bi-weekly sprint releases with continuous testing and progress visibility.' },
                { step: '04', title: 'Production Launch', desc: 'Cloud provisioning, load testing, security verification, and ongoing monitoring.' },
              ].map((p) => (
                <div key={p.step} className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                  <span className="font-mono text-2xl font-bold text-blue-600">{p.step}</span>
                  <h3 className="mt-3 font-display text-lg font-bold text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <LinkButton to={ROUTES.contact} size="lg">
                Discuss Your Project Scope
              </LinkButton>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
