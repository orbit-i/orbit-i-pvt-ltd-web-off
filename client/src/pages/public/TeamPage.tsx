import { useState, useMemo } from 'react'
import { Users, Shield, Code2, Award } from 'lucide-react'
import { TeamCard } from '@/components/team/TeamCard'
import { PageLoader } from '@/components/ui/Loader'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { teamService } from '@/services/teamService'
import { useFetch } from '@/hooks/useFetch'
import type { TeamMember } from '@/types'

const FALLBACK_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Muhammad Saad',
    designation: 'Chief Executive Officer & Founder',
    department: 'Leadership',
    bio: 'Technologist and executive steering ORBIT-I Private Limited. Focused on building high-performance enterprise systems, sustainable technology architecture, and digital engineering partnerships across Pakistan and international markets.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    skills: ['Enterprise Architecture', 'Strategic Growth', 'Cloud Operations', 'FinTech Delivery'],
    linkedinUrl: 'https://www.linkedin.com/company/orbit-i-private-limited/',
    githubUrl: 'https://github.com/orbit-i',
    order: 1,
    isPublished: true,
  },
  {
    id: '2',
    name: 'Abdul Rehman',
    designation: 'Chief Technology Officer',
    department: 'Engineering',
    bio: 'Lead architect specializing in distributed systems, high-concurrency microservices, and secure relational database design. Oversees all core engineering pipelines, CI/CD, and host infrastructure.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    skills: ['TypeScript', 'Node.js', 'MySQL Optimization', 'Kubernetes', 'System Security'],
    linkedinUrl: 'https://www.linkedin.com/company/orbit-i-private-limited/',
    githubUrl: 'https://github.com/orbit-i',
    order: 2,
    isPublished: true,
  },
  {
    id: '3',
    name: 'Syeda Fatima Zahra',
    designation: 'Principal AI & Machine Learning Engineer',
    department: 'AI Research',
    bio: 'Specialist in applied Natural Language Processing, computer vision, and predictive analytics. Designs and deploys enterprise LLM integrations and intelligent workflow automation engines.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    skills: ['Python', 'PyTorch', 'Transformers', 'FastAPI', 'MLOps'],
    linkedinUrl: 'https://www.linkedin.com/company/orbit-i-private-limited/',
    githubUrl: 'https://github.com/orbit-i',
    order: 3,
    isPublished: true,
  },
  {
    id: '4',
    name: 'Bilal Ahmed Khan',
    designation: 'Lead Full-Stack Solutions Engineer',
    department: 'Engineering',
    bio: 'Full-stack specialist with deep expertise in modern React, Vite, Node.js REST APIs, and financial transaction processing pipelines with multi-tier payment gateways.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    skills: ['React 19', 'Next.js', 'Node/Express', 'PostgreSQL', 'Payment Gateways'],
    linkedinUrl: 'https://www.linkedin.com/company/orbit-i-private-limited/',
    githubUrl: 'https://github.com/orbit-i',
    order: 4,
    isPublished: true,
  },
  {
    id: '5',
    name: 'Ayesha Tariq',
    designation: 'Head of Product Design & UX',
    department: 'Product & Design',
    bio: 'Corporate design system architect with a focus on accessible, static enterprise interfaces, frictionless client portals, and brand consistency across web and mobile surfaces.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    skills: ['Design Systems', 'Figma', 'WCAG Accessibility', 'Enterprise UI/UX'],
    linkedinUrl: 'https://www.linkedin.com/company/orbit-i-private-limited/',
    order: 5,
    isPublished: true,
  },
  {
    id: '6',
    name: 'Hassan Raza',
    designation: 'Cloud Infrastructure & Security Engineer',
    department: 'DevOps & Security',
    bio: 'Hardens host infrastructure, manages Hostinger cPanel / Linux daemon deployments, orchestrates SSL termination, firewalls, and automated MySQL backup routines.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    skills: ['Linux Security', 'cPanel/Hostinger', 'Docker', 'Nginx', 'Database Hardening'],
    linkedinUrl: 'https://www.linkedin.com/company/orbit-i-private-limited/',
    githubUrl: 'https://github.com/orbit-i',
    order: 6,
    isPublished: true,
  },
]

export function TeamPage() {
  const { data: remoteTeam, isLoading } = useFetch(() => teamService.list(), [])
  const [selectedDept, setSelectedDept] = useState<string>('all')

  const teamList = useMemo(() => {
    if (remoteTeam && remoteTeam.length > 0) return remoteTeam
    return FALLBACK_TEAM
  }, [remoteTeam])

  const departments = useMemo(() => {
    const set = new Set<string>()
    teamList.forEach((m) => {
      if (m.department) set.add(m.department)
    })
    return ['all', ...Array.from(set)]
  }, [teamList])

  const filteredTeam = useMemo(() => {
    if (selectedDept === 'all') return teamList
    return teamList.filter((m) => m.department === selectedDept)
  }, [teamList, selectedDept])

  return (
    <>
      <SEO {...PAGE_SEO.team} />
      <div className="pb-24">
        {/* Centered Page Header */}
        <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-xs">
                <Users className="size-3.5" /> Corporate Leadership &amp; Engineering
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                The engineers and leaders building ORBIT-I
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
                A seasoned in-house engineering and architecture core dedicated to enterprise software development, resilient database systems, and state-of-the-art corporate solutions.
              </p>

              {/* Department Filter Pills */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedDept(dept)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      selectedDept === dept
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                    }`}
                  >
                    {dept === 'all' ? 'All Departments' : dept}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-16">
          <div className="container-app">
            {isLoading && (!remoteTeam || remoteTeam.length === 0) ? (
              <PageLoader />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTeam.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Engineering Philosophy Section */}
        <section className="border-t border-[var(--color-border)] py-16">
          <div className="container-app">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <Code2 className="size-6 text-primary-400 mb-3" />
                <h4 className="font-display text-base font-semibold text-[var(--color-text-primary)]">
                  Senior Engineering Culture
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  Zero junior outsourcing. Every codebase is architected, reviewed, and maintained by experienced specialists.
                </p>
              </div>

              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <Shield className="size-6 text-primary-400 mb-3" />
                <h4 className="font-display text-base font-semibold text-[var(--color-text-primary)]">
                  Security-First Mindset
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  Parameterized queries, cryptographic token issuance, strict file header inspections, and proactive brute-force mitigation.
                </p>
              </div>

              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <Award className="size-6 text-primary-400 mb-3" />
                <h4 className="font-display text-base font-semibold text-[var(--color-text-primary)]">
                  Verifiable Credentials
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  All software engineers, team leads, and interns are tracked in our official digital verification registry.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
