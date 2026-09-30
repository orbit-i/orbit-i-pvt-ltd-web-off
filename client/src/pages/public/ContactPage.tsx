import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, MapPin, CheckCircle2, Phone, Globe, MessageSquare } from 'lucide-react'
import { getApiErrorMessage } from '@/utils/apiError'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui'
import { contactService } from '@/services/contactService'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { CONTACT_EMAIL, CONTACT_PHONE, WEBSITE_URL, WHATSAPP_CHANNEL_URL } from '@/config/socialLinks'
import { OFFICE_LOCATION } from '@/config/companyInfo'

const contactSchema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(3, 'Add a short subject'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
})
type ContactForm = z.infer<typeof contactSchema>

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (data: ContactForm) => {
    setSubmitError(null)
    try {
      await contactService.submit(data)
      setSubmitted(true)
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'Could not send your message. Please try again.'))
    }
  }

  return (
    <div className="pb-24">
      <SEO {...PAGE_SEO.contact} />
      {/* Centered Page Header */}
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
        <div className="container-app">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-xs">
              Direct Technical Consultation
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
              Let's discuss your software roadmap
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
              Tell us about what you are engineering. Our lead software architects review every message and reply within one business day.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-app grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-5">
            <ContactInfoRow icon={Phone} label="Official Phone" value={CONTACT_PHONE} isLink href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`} />
            <ContactInfoRow icon={Mail} label="Official Email" value={CONTACT_EMAIL} isLink href={`mailto:${CONTACT_EMAIL}`} />
            <ContactInfoRow icon={Globe} label="Website" value={WEBSITE_URL} isLink href={WEBSITE_URL} />
            <ContactInfoRow icon={MessageSquare} label="WhatsApp Channel" value="Join Official Channel" isLink href={WHATSAPP_CHANNEL_URL} />
            <ContactInfoRow icon={MapPin} label="Office Location" value={OFFICE_LOCATION} />
          </div>

          <Card hoverable={false}>
            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <CheckCircle2 className="size-10 text-[var(--color-success)]" aria-hidden />
                <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">
                  Message sent
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Thanks — we'll get back to you within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Name" placeholder="Jane Doe" error={errors.name?.message} {...register('name')} />
                  <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Phone" placeholder="Optional" {...register('phone')} />
                  <Input label="Company" placeholder="Optional" {...register('company')} />
                </div>
                <Input label="Subject" placeholder="What's this about?" error={errors.subject?.message} {...register('subject')} />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-medium text-[var(--color-text-primary)]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us about your project…"
                    className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-elevated)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                    {...register('message')}
                  />
                  {errors.message && <p className="text-xs text-[var(--color-danger)]">{errors.message.message}</p>}
                </div>
                {submitError && <p className="text-sm text-[var(--color-danger)]">{submitError}</p>}
                <Button type="submit" isLoading={isSubmitting} size="lg" className="mt-2">
                  Send message
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>
    </div>
  )
}

function ContactInfoRow({
  icon: Icon,
  label,
  value,
  isLink,
  href,
}: {
  icon: any
  label: string
  value: string
  isLink?: boolean
  href?: string
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-500/10 text-primary-300">
        <Icon className="size-4.5" aria-hidden />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
        {isLink && href ? (
          <a
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-sm font-medium text-[var(--color-text-primary)] hover:text-primary-400 hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{value}</p>
        )}
      </div>
    </div>
  )
}
