import { apiClient } from './apiClient'
import type { ApiResponse, Job } from '@/types'

export interface JobApplicationPayload {
  jobId: string
  name: string
  email: string
  phone?: string
  resumeUrl: string
  coverLetter?: string
  linkedin?: string
  portfolio?: string
}

export interface JobApplicationRecord {
  id: string
  job: { id: string; title: string } | string
  name: string
  email: string
  status: 'new' | 'reviewed' | 'rejected' | 'hired'
  createdAt: string
}

const FALLBACK_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Full-Stack Engineer (React & Node.js)',
    slug: 'senior-full-stack-engineer',
    department: 'Engineering',
    location: 'Lahore, Pakistan / Remote',
    employmentType: 'full_time',
    experience: '5+ years',
    postedAt: '2026-09-01T00:00:00Z',
    description:
      'We are looking for a Senior Full-Stack Engineer with deep experience in TypeScript, React 19, and Node.js backend architecture to lead feature development on enterprise web platforms.',
    requirements: [
      '5+ years of production experience with TypeScript, React, and Node.js',
      'Strong grasp of relational databases (MySQL/PostgreSQL) and query optimization',
      'Experience building and documenting secure REST and GraphQL APIs',
      'Track record of delivering scalable web platforms under tight schedules',
    ],
    responsibilities: [
      'Architect and build full-stack web features from specification to production launch',
      'Perform peer code reviews with a focus on type safety, security, and performance',
      'Collaborate with client technical leads on architecture reviews and API designs',
    ],
    isOpen: true,
  },
  {
    id: 'job-2',
    title: 'Cloud DevOps & Systems Security Engineer',
    slug: 'cloud-devops-systems-engineer',
    department: 'DevOps & Infrastructure',
    location: 'Remote',
    employmentType: 'full_time',
    experience: '3+ years',
    postedAt: '2026-09-05T00:00:00Z',
    description:
      'Responsible for provisioning, securing, and maintaining production cloud infrastructure across AWS, Hostinger Cloud, Docker containers, and automated CI/CD pipelines.',
    requirements: [
      '3+ years in cloud infrastructure, Docker containerization, and Linux server management',
      'Hands-on experience with MySQL replication, automated backup routines, and SSL configuration',
      'Proficiency with GitHub Actions CI/CD workflows and automated deployments',
    ],
    responsibilities: [
      'Manage production and staging environments for high availability and zero-downtime updates',
      'Implement defensive security measures, rate limiting, and intrusion detection monitoring',
      'Maintain runbooks and automated disaster recovery protocols',
    ],
    isOpen: true,
  },
]

export const careersService = {
  async listOpenJobs(): Promise<Job[]> {
    try {
      const { data } = await apiClient.get<ApiResponse<Job[]>>('/careers/jobs', { timeout: 3000 })
      if (data.data && data.data.length > 0) return data.data
      return FALLBACK_JOBS
    } catch {
      return FALLBACK_JOBS
    }
  },
  async getJobBySlug(slug: string): Promise<Job> {
    try {
      const { data } = await apiClient.get<ApiResponse<Job>>(`/careers/jobs/${slug}`, { timeout: 3000 })
      if (data.data) return data.data
    } catch {
      // Fallback
    }
    const found = FALLBACK_JOBS.find((j) => j.slug === slug)
    if (found) return found
    return FALLBACK_JOBS[0]
  },
  async listAllJobs(): Promise<Job[]> {
    try {
      const { data } = await apiClient.get<ApiResponse<Job[]>>('/careers/jobs/admin/all', { timeout: 3000 })
      if (data.data && data.data.length > 0) return data.data
      return FALLBACK_JOBS
    } catch {
      return FALLBACK_JOBS
    }
  },
  async closeJob(id: string) {
    const { data } = await apiClient.patch<ApiResponse<Job>>(`/careers/jobs/${id}/close`)
    return data.data
  },
  async submitApplication(payload: JobApplicationPayload) {
    const { data } = await apiClient.post<ApiResponse<JobApplicationRecord>>('/careers/applications', payload)
    return data.data
  },
  async listApplications(params: { jobId?: string; status?: string } = {}) {
    const { data } = await apiClient.get<ApiResponse<JobApplicationRecord[]>>('/careers/applications', { params })
    return data.data
  },
}
