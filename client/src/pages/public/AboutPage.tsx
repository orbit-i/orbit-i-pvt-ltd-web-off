import { Target, Eye, Compass, HeartHandshake } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { LinkButton } from '@/components/ui'
import { ROUTES } from '@/constants'

const VALUES = [
  {
    title: 'Clarity over Cleverness',
    description: 'We choose the robust, maintainable solution over the convoluted one, every single time. Simple architecture scales; brittle complexity fails.',
  },
  {
    title: 'Direct Senior Engineering',
    description: 'No account-manager relay or junior offshore handoffs — you communicate directly with the software architects designing and writing your system.',
  },
  {
    title: 'True Client Ownership',
    description: 'We deliver complete intellectual property, clear documentation, and cloud infrastructure setup so your internal team can operate independently.',
  },
  {
    title: 'Transparent Scoping',
    description: 'If a timeline or feature set is technically unfeasible within your budget or schedule, we say so directly upfront and provide pragmatic alternatives.',
  },
]

export function AboutPage() {
  return (
    <>
      <SEO {...PAGE_SEO.about} />
      <div className="pb-24">
        {/* Centered Page Header with UI/UX Visual Balance */}
        <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-xs">
                About ORBIT-I Private Limited
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                A technology company built on engineering discipline
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
                ORBIT-I designs, architects, and deploys software systems for enterprises that require absolute reliability — durable architecture, honest milestones, and code built to outlast the project that created it.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="border-b border-slate-200 bg-slate-50/60 py-16 lg:py-20">
          <div className="container-app grid gap-8 sm:grid-cols-2">
            <Card hoverable={false} className="flex flex-col gap-4 p-8 bg-white border-slate-200 shadow-xs">
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Target className="size-6" aria-hidden />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900">Our Mission</h2>
              <p className="text-base leading-relaxed text-slate-600">
                To build high-performance software systems that eliminate real operational friction for our clients — delivering reliable, scalable, and intuitive platforms that drive measurable enterprise value.
              </p>
            </Card>

            <Card hoverable={false} className="flex flex-col gap-4 p-8 bg-white border-slate-200 shadow-xs">
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Eye className="size-6" aria-hidden />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900">Our Vision</h2>
              <p className="text-base leading-relaxed text-slate-600">
                To be the definitive technology partner enterprises turn to when a software project is critical to business continuity and cannot afford to fail, degrade, or require rebuilding within a year.
              </p>
            </Card>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="border-b border-slate-200 bg-white py-16 lg:py-20">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                Guiding Principles
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                The values that drive our engineering decisions
              </h2>
              <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
                Standards we uphold in every line of code, architectural review, and client interaction.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {VALUES.map((value, idx) => (
                <Card key={value.title} hoverable={false} className="p-7 bg-white border-slate-200 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                      0{idx + 1}
                    </span>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      {value.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Approach & Culture Section */}
        <section className="border-b border-slate-200 bg-slate-50/60 py-16 lg:py-20">
          <div className="container-app grid gap-8 sm:grid-cols-2">
            <Card hoverable={false} className="flex flex-col gap-4 p-8 bg-white border-slate-200 shadow-xs">
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Compass className="size-6" aria-hidden />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900">Our Methodology</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Every project begins with technical discovery, followed by an architectural blueprint that you can review before code is written. We deliver in iterative bi-weekly sprints, giving you continuous visibility into development milestones.
              </p>
            </Card>

            <Card hoverable={false} className="flex flex-col gap-4 p-8 bg-white border-slate-200 shadow-xs">
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <HeartHandshake className="size-6" aria-hidden />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900">Engineering Culture</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                A tight-knit team of senior software engineers and designers who review each other's code rigorously. We maintain deep personal investment in the long-term success of the products we bring to life.
              </p>
            </Card>
          </div>
        </section>

        {/* Action Banner */}
        <section className="pt-16 text-center">
          <div className="container-app">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Ready to work with an engineering team that delivers?
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
              Schedule a technical conversation with our software architects today.
            </p>
            <div className="mt-6">
              <LinkButton to={ROUTES.contact} size="lg">
                Get in Touch
              </LinkButton>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
