import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  Gauge,
  Layers,
  Users2,
  Code2,
  Smartphone,
  Wrench,
  PenTool,
  Cloud,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { LinkButton } from '@/components/ui'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Loader'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { ROUTES } from '@/constants'
import { serviceContentService, caseStudyService, testimonialService } from '@/services/contentService'
import { useFetch } from '@/hooks/useFetch'
import orbitLogo from '@/assets/brand/orbit-i-logo.png'

const serviceIcons: Record<string, typeof Code2> = {
  Code2,
  Smartphone,
  Wrench,
  PenTool,
  Cloud,
  Sparkles,
}

const WHY_ORBIT = [
  {
    icon: ShieldCheck,
    title: 'Enterprise Architecture',
    description: 'Typed, thoroughly tested, and documented codebases that scale cleanly without architectural debt.',
  },
  {
    icon: Gauge,
    title: 'Predictable Delivery',
    description: 'Disciplined sprints, transparent milestones, and reliable production schedules with zero surprises.',
  },
  {
    icon: Layers,
    title: 'Scalable Systems',
    description: 'Engineered for real-world transaction volume and high concurrency from initial deployment.',
  },
  {
    icon: Users2,
    title: 'Direct Senior Engineering',
    description: 'Direct collaboration with lead software architects and system engineers — no intermediaries.',
  },
]

export function HomePage() {
  return (
    <>
      <SEO {...PAGE_SEO.home} />
      <HeroSection />
      <AboutIntroSection />
      <ServicesSection />
      <WhyOrbitSection />
      <CaseStudiesSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-28">
      {/* Subtle radiant background glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.06) 0%, rgba(37, 99, 235, 0) 70%)',
        }}
        aria-hidden
      />

      <div className="container-app grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-xs">
            <span className="size-2 rounded-full bg-blue-600 animate-pulse" />
            Software &amp; Technology Engineering Firm
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.12]">
            Engineering software solutions that{' '}
            <span className="text-gradient-brand">accelerate enterprise growth</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            ORBIT-I designs, architects, and builds mission-critical web platforms, mobile apps, and custom software systems for forward-thinking enterprises that demand engineering excellence.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton to={ROUTES.contact} size="lg" className="shadow-md">
              Start a Project <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
            <LinkButton to={ROUTES.services} size="lg" variant="outline">
              Explore Services
            </LinkButton>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-200 pt-8">
            <StatBlock value="99.9%" label="High Availability SLA" />
            <StatBlock value="100%" label="Type-Safe Architecture" />
            <StatBlock value="24/7" label="Continuous Systems Monitoring" />
          </div>
        </div>

        <OrbitHeroVisual />
      </div>
    </section>
  )
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">{label}</p>
    </div>
  )
}

function OrbitHeroVisual() {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
      {/* Outer orbit circle */}
      <div
        className="absolute inset-0 rounded-full border border-blue-200/70"
        style={{ animation: 'spin 26s linear infinite' }}
        aria-hidden
      >
        <span className="absolute -top-1.5 left-1/2 size-3.5 -translate-x-1/2 rounded-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)]" />
      </div>

      {/* Inner orbit circle */}
      <div
        className="absolute inset-10 rounded-full border border-slate-200"
        style={{ animation: 'spin 34s linear infinite reverse' }}
        aria-hidden
      >
        <span className="absolute top-1/2 -right-1.5 size-2.5 -translate-y-1/2 rounded-full bg-slate-400" />
      </div>

      {/* Center brand orb */}
      <div className="relative flex size-52 items-center justify-center rounded-full bg-white shadow-xl border border-slate-100">
        <img src={orbitLogo} alt="ORBIT-I Logo" className="size-32 object-contain" />
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}

function AboutIntroSection() {
  return (
    <section className="border-t border-slate-200 bg-slate-50/60 py-20 lg:py-24">
      <div className="container-app">
        {/* Centered section header adhering to UI/UX hierarchy */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            About ORBIT-I
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            A technology partner built on engineering discipline
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
            ORBIT-I Private Limited designs and builds software for companies that need it done properly — reliable architecture, honest timelines, and code that outlives the project that created it.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card hoverable={false} className="flex flex-col gap-3 p-7 bg-white shadow-xs border-slate-200">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-sm">
              01
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">Engineering Clarity</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              We choose robust, maintainable architecture over fragile shortcuts. Every system is structured for clarity and long-term maintainability.
            </p>
          </Card>

          <Card hoverable={false} className="flex flex-col gap-3 p-7 bg-white shadow-xs border-slate-200">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-sm">
              02
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">Direct Collaboration</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              You collaborate directly with the engineers architecting and writing your software, ensuring transparent communication and rapid feedback cycles.
            </p>
          </Card>

          <Card hoverable={false} className="flex flex-col gap-3 p-7 bg-white shadow-xs border-slate-200 sm:col-span-2 lg:col-span-1">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-sm">
              03
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">True Client Ownership</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              We deliver complete code ownership, transparent documentation, and cloud infrastructure setup so your internal team can operate independently.
            </p>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <Link
            to={ROUTES.about}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Learn more about our methodology &amp; leadership <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  const { data: services, isLoading } = useFetch(() => serviceContentService.list(), [])
  const displayServices = (services ?? []).slice(0, 6)

  return (
    <section className="border-t border-slate-200 bg-white py-20 lg:py-24">
      <div className="container-app">
        {/* Centered header adhering to UX psychology */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Core Capabilities
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Software services tailored to your objectives
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
            From greenfield architecture to scaling high-throughput systems, every engagement follows proven engineering standards.
          </p>
        </div>

        {isLoading ? (
          <div className="py-16"><PageLoader /></div>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayServices.map((service) => {
              const Icon = serviceIcons[service.icon] ?? Code2
              return (
                <Card key={service.id} className="group flex flex-col gap-4 p-7 bg-white border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                      {service.summary}
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      {service.technologies?.slice(0, 2).join(' · ')}
                    </span>
                    <Link
                      to={ROUTES.serviceDetail(service.slug)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Details <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <LinkButton to={ROUTES.services} variant="outline" size="lg">
            View All Services
          </LinkButton>
        </div>
      </div>
    </section>
  )
}

function WhyOrbitSection() {
  return (
    <section className="border-t border-slate-200 bg-slate-50/70 py-20 lg:py-24">
      <div className="container-app">
        {/* Centered header adhering to UX typography */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            The ORBIT-I Standard
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Why leading businesses partner with us
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
            We focus on software discipline, system resilience, and predictable outcomes rather than empty marketing buzzwords.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_ORBIT.map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex size-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <item.icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CaseStudiesSection() {
  const { data: caseStudies, isLoading } = useFetch(() => caseStudyService.list(), [])
  const displayStudies = (caseStudies ?? []).slice(0, 4)

  if (!isLoading && displayStudies.length === 0) return null

  return (
    <section className="border-t border-slate-200 bg-white py-20 lg:py-24">
      <div className="container-app">
        {/* Centered header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Proven Results
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Featured engineering case studies
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
            Explore how we solved critical technical challenges and built scalable platforms for real-world clients.
          </p>
        </div>

        {isLoading ? (
          <div className="py-16"><PageLoader /></div>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {displayStudies.map((study) => (
              <Link key={study.id} to={ROUTES.caseStudyDetail(study.slug)} className="group">
                <Card className="h-full p-8 border-slate-200 bg-white group-hover:border-blue-300 group-hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <Badge tone="primary" className="text-xs">
                      {study.clientIndustry}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                      View Case Study &rarr;
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {study.projectName}
                  </h3>
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
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <LinkButton to={ROUTES.caseStudies} variant="outline" size="lg">
            Browse All Case Studies
          </LinkButton>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const { data: testimonials, isLoading } = useFetch(() => testimonialService.list(), [])
  const displayTestimonials = testimonials ?? []

  if (!isLoading && displayTestimonials.length === 0) return null

  return (
    <section className="border-t border-slate-200 bg-slate-50/70 py-20 lg:py-24">
      <div className="container-app">
        {/* Centered header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Client Feedback
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Trusted by founders and engineering leaders
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
            Read what executives and teams have to say about collaborating with ORBIT-I.
          </p>
        </div>

        {isLoading ? (
          <div className="py-16"><PageLoader /></div>
        ) : (
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {displayTestimonials.map((testimonial) => (
              <Card key={testimonial.id} hoverable={false} className="flex flex-col justify-between p-8 bg-white border-slate-200 shadow-xs">
                <p className="text-base sm:text-lg leading-relaxed text-slate-800 italic">“{testimonial.quote}”</p>
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-sm font-bold text-slate-900">{testimonial.authorName}</p>
                  <p className="text-xs text-slate-500">
                    {testimonial.authorRole} · {testimonial.company}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="border-t border-slate-200 bg-white py-20 lg:py-28">
      <div className="container-app">
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/60 to-white p-10 sm:p-16 text-center shadow-xs">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-100/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 mb-4">
            Ready to Build?
          </div>
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Let's build software that powers your business
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-slate-600">
            Tell us about your product roadmap. Our software architects will review your requirements and provide technical guidance within one business day.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <LinkButton to={ROUTES.contact} size="lg" className="shadow-md">
              Schedule Technical Consultation <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
            <LinkButton to={ROUTES.caseStudies} size="lg" variant="outline">
              Review Past Projects
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  )
}
