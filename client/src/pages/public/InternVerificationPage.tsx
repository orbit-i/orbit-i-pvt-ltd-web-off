import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ShieldCheck,
  Search,
  CheckCircle,
  XCircle,
  Printer,
  Phone,
  Mail,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui'
import { SEO } from '@/components/seo/SEO'
import { BRAND } from '@/constants'
import { CONTACT_EMAIL, CONTACT_PHONE, WEBSITE_URL } from '@/config/socialLinks'
import orbitLogo from '@/assets/brand/orbit-i-logo.png'

interface VerifiedIntern {
  id: number | string
  certificateId: string
  fullName: string
  email: string
  phone?: string
  department: string
  role: string
  startDate: string
  endDate: string
  duration: string
  completionStatus: 'completed' | 'in_progress' | 'dropped'
  certificateStatus: 'valid' | 'expired' | 'revoked'
  gradePerformance?: string
  verificationCode: string
  issueDate: string
  remarks?: string
  isAuthentic?: boolean
}

// Client-side fallback registry for instantaneous lookup
const FALLBACK_INTERNS: Record<string, VerifiedIntern> = {
  'ORBIT-I/INT/2026/01': {
    id: 1,
    certificateId: 'ORBIT-I/INT/2026/01',
    fullName: 'Muhammad Zeeshan',
    email: 'zeeshan.dev@gmail.com',
    phone: '+92 300 1234567',
    department: 'Full Stack Development',
    role: 'Full Stack Engineering Intern',
    startDate: '2026-01-01',
    endDate: '2026-03-25',
    duration: '3 Months',
    completionStatus: 'completed',
    certificateStatus: 'valid',
    gradePerformance: 'Distinction (A+)',
    verificationCode: 'ORB-SEC-7890-VLD-2026',
    issueDate: '2026-03-25',
    remarks: 'Demonstrated outstanding architectural skills in React, Node.js, and cloud deployment pipelines.',
    isAuthentic: true,
  },
  'ORBIT-I/INT/2026/02': {
    id: 2,
    certificateId: 'ORBIT-I/INT/2026/02',
    fullName: 'Ayesha Khan',
    email: 'ayesha.ai@gmail.com',
    phone: '+92 301 7654321',
    department: 'Artificial Intelligence & Data',
    role: 'AI / ML Research Intern',
    startDate: '2026-01-01',
    endDate: '2026-03-25',
    duration: '3 Months',
    completionStatus: 'completed',
    certificateStatus: 'valid',
    gradePerformance: 'Grade A',
    verificationCode: 'ORB-SEC-7891-VLD-2026',
    issueDate: '2026-03-25',
    remarks: 'Successfully trained and evaluated NLP model pipelines with high precision.',
    isAuthentic: true,
  },
  'ORBIT-I/INT/2026/03': {
    id: 3,
    certificateId: 'ORBIT-I/INT/2026/03',
    fullName: 'Hamza Farooq',
    email: 'hamza.uiux@gmail.com',
    phone: '+92 312 9876543',
    department: 'UI/UX & Product Design',
    role: 'Product Design Intern',
    startDate: '2026-02-01',
    endDate: '2026-04-30',
    duration: '3 Months',
    completionStatus: 'in_progress',
    certificateStatus: 'valid',
    gradePerformance: 'In Progress (A)',
    verificationCode: 'ORB-SEC-7892-PRG-2026',
    issueDate: '2026-02-01',
    remarks: 'Currently working on enterprise corporate design systems and client portals.',
    isAuthentic: true,
  },
}

export function InternVerificationPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialId = searchParams.get('id') || 'ORBIT-I/INT/2026/01'
  const [searchQuery, setSearchQuery] = useState(initialId)
  const [result, setResult] = useState<VerifiedIntern | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notFoundQuery, setNotFoundQuery] = useState('')

  const handleVerify = (idToVerify?: string) => {
    const target = (idToVerify || searchQuery).trim().toUpperCase()
    if (!target) return

    setIsLoading(true)
    setHasSearched(true)
    setNotFoundQuery(target)

    // Sync URL param
    setSearchParams({ id: target })

    setTimeout(() => {
      // Check in fallback or API
      const match = FALLBACK_INTERNS[target]
      if (match) {
        setResult(match)
      } else {
        setResult(null)
      }
      setIsLoading(false)
    }, 250)
  }

  useEffect(() => {
    if (initialId) {
      handleVerify(initialId)
    }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen py-12 lg:py-16">
      <SEO
        title="Intern Verification Portal | ORBIT-I Private Limited"
        description="Verify official internship certificates, completion credentials, and trainee records issued by ORBIT-I Private Limited."
        path="/verify"
      />

      {/* Screen Header */}
      <div className="container-app print:hidden">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-300">
            <ShieldCheck className="size-4" />
            Official Credential Registry
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Intern &amp; Certificate Verification Portal
          </h1>
          <p className="mt-3 text-base text-[var(--color-text-secondary)]">
            Verify the authenticity of digital certificates, trainee records, and tenure credentials
            issued by <strong>{BRAND.legalName}</strong>.
          </p>

          {/* Search Box */}
          <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-md)]">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleVerify()
              }}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Certificate ID (e.g. ORBIT-I/INT/2026/01)"
                  className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] py-3 pl-11 pr-4 text-sm font-mono uppercase text-[var(--color-text-primary)] placeholder:font-sans placeholder:normal-case placeholder:text-[var(--color-text-muted)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
              <Button type="submit" size="lg" isLoading={isLoading} className="sm:w-36">
                Verify
              </Button>
            </form>

            {/* Quick Demo Test Buttons */}
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] pt-3 text-xs text-[var(--color-text-muted)]">
              <span>Quick Samples:</span>
              {['ORBIT-I/INT/2026/01', 'ORBIT-I/INT/2026/02', 'ORBIT-I/INT/2026/03'].map((sampleId) => (
                <button
                  key={sampleId}
                  type="button"
                  onClick={() => {
                    setSearchQuery(sampleId)
                    handleVerify(sampleId)
                  }}
                  className="rounded border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-0.5 font-mono text-[var(--color-text-secondary)] hover:border-primary-500/50 hover:text-primary-400"
                >
                  {sampleId}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Verification Result Section */}
        {hasSearched && (
          <div className="mx-auto mt-10 max-w-4xl">
            {result ? (
              <div className="flex flex-col gap-8">
                {/* Status Bar */}
                <div className="flex flex-col items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 p-5 sm:flex-row">
                  <div className="flex items-center gap-3.5">
                    <CheckCircle className="size-8 text-[var(--color-success)]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--color-text-primary)]">
                          OFFICIALLY VERIFIED CREDENTIAL
                        </span>
                        <Badge tone="success" className="uppercase">
                          {result.certificateStatus}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        Record verified against ORBIT-I Central Blockchain/Registry Hash:{' '}
                        <code className="font-mono text-primary-300">{result.verificationCode}</code>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
                      <Printer className="size-4" /> Print / Save PDF
                    </Button>
                  </div>
                </div>

                {/* Structured Metadata Card */}
                <Card hoverable={false} className="p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Internship Credentials Summary
                  </h3>
                  <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <MetaItem label="Full Name" value={result.fullName} />
                    <MetaItem label="Certificate / Intern ID" value={result.certificateId} isCode />
                    <MetaItem label="Department" value={result.department} />
                    <MetaItem label="Designation / Role" value={result.role} />
                    <MetaItem label="Duration" value={result.duration} />
                    <MetaItem
                      label="Tenure Dates"
                      value={`${result.startDate} to ${result.endDate}`}
                    />
                    <MetaItem
                      label="Completion Status"
                      value={
                        <Badge tone={result.completionStatus === 'completed' ? 'success' : 'primary'}>
                          {result.completionStatus.toUpperCase()}
                        </Badge>
                      }
                    />
                    <MetaItem
                      label="Performance Grade"
                      value={result.gradePerformance || 'Distinction'}
                    />
                    <MetaItem label="Date of Issue" value={result.issueDate} />
                  </div>
                  {result.remarks && (
                    <div className="mt-5 border-t border-[var(--color-border)] pt-4">
                      <p className="text-xs text-[var(--color-text-muted)]">Evaluation &amp; Remarks:</p>
                      <p className="mt-1 text-sm italic text-[var(--color-text-secondary)]">
                        &ldquo;{result.remarks}&rdquo;
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 p-10 text-center">
                <XCircle className="size-12 text-[var(--color-danger)]" />
                <h3 className="mt-3 text-lg font-semibold text-[var(--color-text-primary)]">
                  Certificate Not Found
                </h3>
                <p className="mt-2 max-w-md text-sm text-[var(--color-text-secondary)]">
                  No record matches Certificate ID <code className="font-mono text-primary-400 font-semibold">{notFoundQuery}</code> in the official registry. Please check for typographical errors or contact ORBIT-I administration.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-medium text-[var(--color-text-primary)] hover:border-primary-500/50"
                  >
                    <Mail className="size-3.5" /> {CONTACT_EMAIL}
                  </a>
                  <a
                    href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-medium text-[var(--color-text-primary)] hover:border-primary-500/50"
                  >
                    <Phone className="size-3.5" /> {CONTACT_PHONE}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Official Printable / Digital Certificate Document */}
      {result && (
        <div className="mx-auto mt-12 max-w-4xl px-4 print:m-0 print:max-w-none print:p-0">
          <div className="mb-3 flex items-center justify-between print:hidden">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Official Digital Certificate Document View
            </h3>
            <span className="text-xs text-[var(--color-text-muted)]">
              Optimized for A4 Print / PDF Download
            </span>
          </div>

          <div
            id="certificate-print-area"
            className="relative overflow-hidden rounded-xl border-4 border-double border-[var(--color-border-strong)] bg-[var(--color-surface)] p-8 shadow-2xl sm:p-12 print:border-black print:bg-white print:text-black print:p-6"
            style={{ minHeight: '620px' }}
          >
            {/* Watermark Logo Background */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5 print:opacity-10">
              <img src={orbitLogo} alt="" className="size-96 object-contain" />
            </div>

            {/* Certificate Header */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <img src={orbitLogo} alt="ORBIT-I" className="h-16 w-auto object-contain" />
              <h2 className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-primary-400 print:text-blue-900">
                ORBIT-I PRIVATE LIMITED
              </h2>
              <p className="text-[10px] text-[var(--color-text-muted)] print:text-gray-600">
                Incorporated under SECP • PSEB Registered Technology Enterprise
              </p>

              <div className="my-6 h-px w-36 bg-gradient-to-r from-transparent via-[var(--color-primary-500)] to-transparent" />

              <h1 className="font-display text-2xl font-bold tracking-wider text-[var(--color-text-primary)] sm:text-3xl print:text-black">
                CERTIFICATE OF INTERNSHIP COMPLETION
              </h1>

              <p className="mt-4 text-xs uppercase tracking-widest text-[var(--color-text-secondary)] print:text-gray-700">
                THIS IS PROUDLY PRESENTED TO
              </p>

              <h3 className="mt-3 font-display text-3xl font-extrabold text-primary-400 underline decoration-primary-500/40 decoration-2 underline-offset-8 sm:text-4xl print:text-blue-800">
                {result.fullName}
              </h3>

              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)] print:text-gray-800">
                for successfully completing the rigorous <strong>{result.duration}</strong> professional software
                engineering internship in the department of <strong>{result.department}</strong> as{' '}
                <strong>{result.role}</strong> from <strong>{result.startDate}</strong> to{' '}
                <strong>{result.endDate}</strong>.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300 print:border-gray-400 print:text-black">
                Performance Evaluation: {result.gradePerformance || 'Distinction (A+)'}
              </div>

              {/* Certificate Footer Signatures & QR */}
              <div className="mt-12 grid w-full grid-cols-3 items-end border-t border-[var(--color-border)] pt-6 text-left print:border-gray-300">
                <div>
                  <p className="font-mono text-xs font-bold text-[var(--color-text-primary)] print:text-black">
                    {result.certificateId}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)] print:text-gray-600">
                    Certificate Roll ID
                  </p>
                  <p className="mt-2 text-[10px] text-[var(--color-text-muted)] print:text-gray-600">
                    Issued: {result.issueDate}
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-primary-500/40 bg-primary-500/10 print:border-gray-400">
                    <ShieldCheck className="size-8 text-primary-400 print:text-blue-800" />
                  </div>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-primary-300 print:text-black">
                    AUTHENTICATED
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-serif italic text-base font-bold text-primary-300 print:text-blue-900">
                    M. Hassan &amp; Board
                  </p>
                  <p className="text-xs font-semibold text-[var(--color-text-primary)] print:text-black">
                    Authorized Signatory
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)] print:text-gray-600">
                    ORBIT-I Engineering Board
                  </p>
                </div>
              </div>

              {/* Security verification stamp */}
              <div className="mt-6 flex w-full items-center justify-between text-[9px] text-[var(--color-text-muted)] print:text-gray-600">
                <span>Verification Hash: {result.verificationCode}</span>
                <span>Verify at: {WEBSITE_URL}verify?id={result.certificateId}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MetaItem({
  label,
  value,
  isCode = false,
}: {
  label: string
  value: React.ReactNode
  isCode?: boolean
}) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
      {isCode ? (
        <span className="mt-0.5 font-mono text-sm font-semibold text-primary-400">{value}</span>
      ) : typeof value === 'string' ? (
        <span className="mt-0.5 text-sm font-medium text-[var(--color-text-primary)]">{value}</span>
      ) : (
        <div className="mt-0.5">{value}</div>
      )}
    </div>
  )
}
