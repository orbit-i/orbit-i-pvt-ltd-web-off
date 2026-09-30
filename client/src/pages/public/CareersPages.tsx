import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Briefcase, MapPin, Clock, CheckCircle2 } from 'lucide-react'
import { getApiErrorMessage } from '@/utils/apiError'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { ROUTES } from '@/constants'
import { careersService } from '@/services/careersService'
import { useFetch } from '@/hooks/useFetch'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'

const employmentLabel: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
}

export function CareersPage() {
  const { data: jobs, isLoading, error, refetch } = useFetch(() => careersService.listOpenJobs(), [])
  const openJobs = jobs ?? []

  return (
    <div className="pb-24">
      <SEO {...PAGE_SEO.careers} />
      {/* Centered Page Header */}
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
        <div className="container-app">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-xs">
              Engineering Careers &amp; Traineeships
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
              Build software that actually ships
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
              We are a disciplined engineering team that values code clarity, system architecture, and real ownership. Explore our open positions below.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-app">
          {isLoading ? (
            <PageLoader />
          ) : error ? (
            <ErrorState onRetry={refetch} />
          ) : openJobs.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="size-5" aria-hidden />}
              title="No open positions right now"
              description="Check back soon, or reach out via the contact page."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {openJobs.map((job) => (
                <Link key={job.id} to={ROUTES.jobDetail(job.slug)}>
                  <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                        {job.title}
                      </h2>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-text-secondary)]">
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="size-3.5" aria-hidden /> {job.department}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-3.5" aria-hidden /> {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="size-3.5" aria-hidden /> {employmentLabel[job.employmentType]}
                        </span>
                      </div>
                    </div>
                    <Badge tone="primary">{job.experience}</Badge>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

const applicationSchema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  resumeUrl: z.string().url('Add a link to your resume (Google Drive, Dropbox, etc.)'),
  coverLetter: z.string().min(20, 'Say a little about why you\u2019re a fit (20+ characters)'),
})
type ApplicationForm = z.infer<typeof applicationSchema>

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: job, isLoading, error, refetch } = useFetch(() => careersService.getJobBySlug(id!), [id])
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationForm>({ resolver: zodResolver(applicationSchema) })

  if (isLoading) return <div className="py-24"><PageLoader /></div>

  if (error || !job) {
    return (
      <div className="container-app py-24">
        {error && error !== 'Job posting not found' ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <EmptyState
            icon={<Briefcase className="size-5" aria-hidden />}
            title="Position not found"
            description="This role may have closed. See all open positions instead."
          />
        )}
      </div>
    )
  }

  const onSubmit = async (data: ApplicationForm) => {
    setSubmitError(null)
    try {
      await careersService.submitApplication({ jobId: job.id, ...data })
      setSubmitted(true)
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'Could not submit your application. Please try again.'))
    }
  }

  return (
    <div className="pb-24">
      <section className="border-b border-[var(--color-border)] py-20">
        <div className="container-app">
          <Link to={ROUTES.careers} className="text-sm text-[var(--color-text-secondary)] hover:text-primary-300">
            ← All positions
          </Link>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            {job.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="neutral">{job.department}</Badge>
            <Badge tone="neutral">{job.location}</Badge>
            <Badge tone="neutral">{employmentLabel[job.employmentType]}</Badge>
            <Badge tone="primary">{job.experience}</Badge>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--color-border)] py-16">
        <div className="container-app grid gap-10 lg:grid-cols-2">
          <div>
            <p className="leading-relaxed text-[var(--color-text-secondary)]">{job.description}</p>
            <h2 className="mt-8 text-lg font-semibold text-[var(--color-text-primary)]">Responsibilities</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {job.responsibilities.map((r) => (
                <li key={r} className="text-sm text-[var(--color-text-secondary)]">• {r}</li>
              ))}
            </ul>
            <h2 className="mt-8 text-lg font-semibold text-[var(--color-text-primary)]">Requirements</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {job.requirements.map((r) => (
                <li key={r} className="text-sm text-[var(--color-text-secondary)]">• {r}</li>
              ))}
            </ul>
          </div>

          <Card hoverable={false}>
            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CheckCircle2 className="size-9 text-[var(--color-success)]" aria-hidden />
                <h3 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                  Application submitted
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  We'll review it and reach out if it's a fit.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <h2 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">Apply now</h2>
                <Input label="Full name" placeholder="Jane Doe" error={errors.name?.message} {...register('name')} />
                <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
                <Input label="Phone" placeholder="Optional" {...register('phone')} />
                <Input
                  label="Resume link"
                  placeholder="Google Drive / Dropbox link to your resume"
                  error={errors.resumeUrl?.message}
                  {...register('resumeUrl')}
                />
                <Input label="LinkedIn" placeholder="Optional" {...register('linkedin')} />
                <Input label="Portfolio / GitHub" placeholder="Optional" {...register('portfolio')} />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="coverLetter" className="text-sm font-medium text-[var(--color-text-primary)]">
                    Cover letter
                  </label>
                  <textarea
                    id="coverLetter"
                    rows={4}
                    placeholder="Why are you a fit for this role?"
                    className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-elevated)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                    {...register('coverLetter')}
                  />
                  {errors.coverLetter && (
                    <p className="text-xs text-[var(--color-danger)]">{errors.coverLetter.message}</p>
                  )}
                </div>
                {submitError && <p className="text-sm text-[var(--color-danger)]">{submitError}</p>}
                <Button type="submit" isLoading={isSubmitting} className="mt-2">
                  Submit application
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>
    </div>
  )
}
