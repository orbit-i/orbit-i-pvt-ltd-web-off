import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, FileSearch, ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LinkButton } from '@/components/ui'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { ROUTES } from '@/constants'
import { caseStudyService } from '@/services/contentService'
import { useFetch } from '@/hooks/useFetch'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO, buildCreativeWorkJsonLd, buildBreadcrumbJsonLd } from '@/config/seo'

export function CaseStudiesPage() {
  const { data: caseStudies, isLoading, error, refetch } = useFetch(() => caseStudyService.list(), [])

  return (
    <>
      <SEO {...PAGE_SEO.caseStudies} />
      <div className="pb-24">
        {/* Centered Page Header */}
        <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-xs">
                Real-World Engineering Deployments
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                Proven systems solving complex challenges
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
                Detailed breakdowns of production software systems engineered by ORBIT-I — from high-throughput FinTech platforms to enterprise logistics portals.
              </p>
            </div>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="bg-slate-50/60 py-16 lg:py-20">
          <div className="container-app">
            {isLoading ? (
              <div className="py-16"><PageLoader /></div>
            ) : error ? (
              <ErrorState onRetry={refetch} />
            ) : !caseStudies || caseStudies.length === 0 ? (
              <EmptyState icon={<FileSearch className="size-5" aria-hidden />} title="No case studies published yet" />
            ) : (
              <div className="grid gap-8 sm:grid-cols-2">
                {caseStudies.map((study) => (
                  <Link key={study.id} to={ROUTES.caseStudyDetail(study.slug)} className="group">
                    <Card className="flex h-full flex-col p-8 bg-white border-slate-200 shadow-xs group-hover:border-blue-300 group-hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <Badge tone="primary" className="text-xs">
                          {study.clientIndustry}
                        </Badge>
                        <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                          Explore Case Study &rarr;
                        </span>
                      </div>

                      <h2 className="mt-4 font-display text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {study.projectName}
                      </h2>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600">{study.problem}</p>

                      {study.results && study.results.length > 0 && (
                        <div className="mt-6 border-t border-slate-100 pt-4 flex flex-col gap-2">
                          {study.results.slice(0, 2).map((res, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                              <span>{res}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto pt-6 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {study.technologies.slice(0, 4).map((tech) => (
                          <span key={tech} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export function CaseStudyDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: study, isLoading, error, refetch } = useFetch(() => caseStudyService.getBySlug(slug!), [slug])

  if (isLoading) return <div className="py-24"><PageLoader /></div>

  if (error || !study) {
    return (
      <div className="container-app py-24">
        {error && error !== 'Case study not found' ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <EmptyState
            icon={<FileSearch className="size-5" aria-hidden />}
            title="Case study not found"
            description="This case study may have been renamed or removed."
          />
        )}
      </div>
    )
  }

  return (
    <div className="pb-24">
      <SEO
        title={`${study.projectName} — Engineering Case Study | ORBIT-I`}
        description={study.problem.slice(0, 155)}
        path={ROUTES.caseStudyDetail(study.slug)}
        jsonLd={[
          buildCreativeWorkJsonLd(study),
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Case Studies', path: ROUTES.caseStudies },
            { name: study.projectName, path: ROUTES.caseStudyDetail(study.slug) },
          ]),
        ]}
      />

      {/* Centered Detail Header */}
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
        <div className="container-app">
          <div className="mx-auto max-w-3xl text-center">
            <Link to={ROUTES.caseStudies} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-6">
              <ArrowLeft className="size-4" /> Back to Case Studies
            </Link>

            <div className="flex justify-center">
              <Badge tone="primary" className="text-xs">
                {study.clientIndustry}
              </Badge>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
              {study.projectName}
            </h1>
          </div>
        </div>
      </section>

      {/* Problem & Solution Grid */}
      <section className="border-b border-slate-200 bg-slate-50/60 py-16 lg:py-20">
        <div className="container-app grid gap-8 lg:grid-cols-2">
          <Card hoverable={false} className="p-8 bg-white border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="size-2 rounded-full bg-red-500" /> The Challenge
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">{study.problem}</p>
          </Card>

          <Card hoverable={false} className="p-8 bg-white border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" /> The Engineering Solution
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">{study.solution}</p>
          </Card>
        </div>
      </section>

      {/* Key Measurable Outcomes */}
      <section className="border-b border-slate-200 bg-white py-16 lg:py-20">
        <div className="container-app">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
              Measurable Impact
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Verified Production Results
            </h2>
          </div>

          <div className="mx-auto max-w-2xl flex flex-col gap-4">
            {study.results.map((result, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden />
                <span className="text-sm font-medium text-slate-800 leading-relaxed">{result}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 mx-auto max-w-2xl border-t border-slate-100 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 text-center">Technologies Used</p>
            <div className="flex flex-wrap justify-center gap-2">
              {study.technologies.map((tech) => (
                <Badge key={tech} tone="neutral" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="py-16 text-center">
        <div className="container-app">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Facing a similar architectural hurdle?</h2>
          <p className="mt-3 text-base text-slate-600 max-w-lg mx-auto">
            Discuss your system requirements with our senior engineering team.
          </p>
          <div className="mt-6">
            <LinkButton to={ROUTES.contact} size="lg">
              Schedule Consultation <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  )
}
