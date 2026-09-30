"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.careersService = exports.contactService = void 0;
const ContactMessage_1 = require("../models/ContactMessage");
const Job_1 = require("../models/Job");
const ApiError_1 = require("../utils/ApiError");
const db_1 = require("../config/db");
const FALLBACK_JOBS = [
    {
        id: 'job-1',
        title: 'Senior Full-Stack Engineer (React & Node.js)',
        slug: 'senior-full-stack-engineer',
        department: 'Engineering',
        location: 'Lahore, Pakistan / Remote',
        type: 'full_time',
        description: 'We are looking for a Senior Full-Stack Engineer with deep experience in TypeScript, React 19, and Node.js backend architecture to lead feature development on enterprise web platforms.',
        requirements: [
            '5+ years of production experience with TypeScript, React, and Node.js',
            'Strong grasp of relational databases (MySQL/PostgreSQL) and query optimization',
            'Experience building and documenting secure REST and GraphQL APIs',
        ],
        responsibilities: [
            'Architect and build full-stack web features from specification to production launch',
            'Perform peer code reviews with a focus on type safety, security, and performance',
        ],
        isOpen: true,
    },
];
exports.contactService = {
    async submit(data) {
        if (!(0, db_1.isMongoConnected)())
            return { id: 'contact-temp', ...data, createdAt: new Date() };
        return ContactMessage_1.ContactMessage.create(data);
    },
    async list(query) {
        if (!(0, db_1.isMongoConnected)())
            return { items: [], page: 1, totalItems: 0, totalPages: 0 };
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const filter = {};
        if (query.status)
            filter.status = query.status;
        const [items, totalItems] = await Promise.all([
            ContactMessage_1.ContactMessage.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            ContactMessage_1.ContactMessage.countDocuments(filter),
        ]);
        return { items, page, totalItems, totalPages: Math.ceil(totalItems / limit) };
    },
    async updateStatus(id, status) {
        if (!(0, db_1.isMongoConnected)())
            return null;
        const message = await ContactMessage_1.ContactMessage.findByIdAndUpdate(id, { status }, { new: true });
        if (!message)
            throw ApiError_1.ApiError.notFound('Message not found');
        return message;
    },
};
exports.careersService = {
    async listOpenJobs() {
        if (!(0, db_1.isMongoConnected)())
            return FALLBACK_JOBS;
        return Job_1.Job.find({ isOpen: true }).sort({ createdAt: -1 });
    },
    async getJobBySlug(slug) {
        if (!(0, db_1.isMongoConnected)()) {
            const match = FALLBACK_JOBS.find((j) => j.slug === slug);
            if (match)
                return match;
            return FALLBACK_JOBS[0];
        }
        const job = await Job_1.Job.findOne({ slug });
        if (!job)
            throw ApiError_1.ApiError.notFound('Job posting not found');
        return job;
    },
    async listAllJobs() {
        if (!(0, db_1.isMongoConnected)())
            return FALLBACK_JOBS;
        return Job_1.Job.find().sort({ createdAt: -1 });
    },
    async createJob(data) {
        const existing = await Job_1.Job.findOne({ slug: data.slug });
        if (existing)
            throw ApiError_1.ApiError.conflict('A job with this slug already exists');
        return Job_1.Job.create(data);
    },
    async updateJob(id, data) {
        const job = await Job_1.Job.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!job)
            throw ApiError_1.ApiError.notFound('Job posting not found');
        return job;
    },
    async closeJob(id) {
        const job = await Job_1.Job.findByIdAndUpdate(id, { isOpen: false }, { new: true });
        if (!job)
            throw ApiError_1.ApiError.notFound('Job posting not found');
        return job;
    },
    async submitApplication(data) {
        const job = await Job_1.Job.findById(data.jobId);
        if (!job || !job.isOpen) {
            throw ApiError_1.ApiError.badRequest('This position is no longer accepting applications');
        }
        const { jobId, ...rest } = data;
        return Job_1.JobApplication.create({ job: jobId, ...rest });
    },
    async listApplications(query) {
        const filter = {};
        if (query.jobId)
            filter.job = query.jobId;
        if (query.status)
            filter.status = query.status;
        return Job_1.JobApplication.find(filter).populate('job', 'title').sort({ createdAt: -1 });
    },
    async updateApplicationStatus(id, status) {
        const application = await Job_1.JobApplication.findByIdAndUpdate(id, { status }, { new: true });
        if (!application)
            throw ApiError_1.ApiError.notFound('Application not found');
        return application;
    },
};
//# sourceMappingURL=contactAndCareersService.js.map