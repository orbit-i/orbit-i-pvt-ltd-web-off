import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Code2, Smartphone, Wrench, PenTool, Cloud, Sparkles, ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { LinkButton } from '@/components/ui'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { ROUTES } from '@/constants'
import { serviceContentService } from '@/services/contentService'
import { useFetch } from '@/hooks/useFetch'
import { SEO } from '@/components/seo/SEO'

const serviceIcons: Record<string, typeof Code2> = { Code2, Smartphone, Wrench, PenTool, Cloud, Sparkles }

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: service, isLoading, error, refetch } = useFetch(
    () => serviceContentService.getBySlug(slug!),
    [slug]
  )

  if (isLoading) return <div className="py-24"><PageLoader /></div>

  if (error || !service) {
    return (
      <div className="container-app py-24">
        {error && error !== 'Service not found' ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <EmptyState title="Service not found" description="This service may have been renamed or removed." />
        )}
      </div>
    )
  }

  const Icon = serviceIcons[service.icon] ?? Code2

  return (
    <div className="pb-24">
      <SEO
        title={`${service.title} — Engineering Capabilities | ORBIT-I`}
        description={service.summary}
        path={ROUTES.serviceDetail(service.slug)}
      />

      {/* Centered Page Header */}
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
        <div className="container-app">
          <div className="mx-auto max-w-3xl text-center">
            <Link to={ROUTES.services} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-6">
              <ArrowLeft className="size-4" /> Back to All Services
            </Link>

            <div className="flex justify-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-xs border border-blue-100">
                <Icon className="size-7" aria-hidden />
              </div>
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
              {service.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
              {service.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {service.technologies.map((tech) => (
                <span key={tech} className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits & Process Grid */}
      <section className="border-b border-slate-200 bg-slate-50/60 py-16 lg:py-20">
        <div className="container-app grid gap-8 lg:grid-cols-2">
          {/* Key Advantages */}
          <Card hoverable={false} className="p-8 bg-white border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900">Key Engineering Advantages</h2>
            <div className="mt-6 flex flex-col gap-4">
              {service.benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3.5">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden />
                  <span className="text-sm font-medium text-slate-800 leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Delivery Process */}
          <Card hoverable={false} className="p-8 bg-white border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900">Our Implementation Lifecycle</h2>
            <div className="mt-6 flex flex-col gap-5">
              {service.processSteps.map((step, index) => (
                <div key={step.title} className="flex items-start gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 font-display text-xs font-bold text-blue-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-base font-bold text-slate-900">{step.title}</p>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 text-center">
        <div className="container-app">
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/50 to-white p-10 sm:p-14 text-center shadow-xs max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Ready to architect your {service.title.toLowerCase()} system?
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-lg mx-auto">
              Schedule a technical conversation with our software architects today.
            </p>
            <div className="mt-6">
              <LinkButton to={ROUTES.contact} size="lg" className="shadow-md">
                Initiate Project Consultation <ArrowRight className="size-4" aria-hidden />
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
