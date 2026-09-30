"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamService = void 0;
const mysql_1 = require("../config/mysql");
const ApiError_1 = require("../utils/ApiError");
// In-memory fallback for local development or when MySQL is offline
let memoryTeam = [
    {
        id: 1,
        name: 'Muhammad Saad',
        designation: 'Chief Executive Officer & Founder',
        department: 'Executive Leadership',
        bio: 'Technologist and executive steering ORBIT-I Private Limited. Focused on building high-performance enterprise systems, sustainable technology architecture, and digital engineering partnerships across Pakistan and international markets.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        skills: ['Enterprise Architecture', 'Strategic Growth', 'Cloud Operations', 'FinTech Delivery'],
        linkedinUrl: 'https://www.linkedin.com/company/orbit-i-private-limited/',
        githubUrl: 'https://github.com/orbit-i',
        orderIndex: 1,
        isPublished: true,
    },
    {
        id: 2,
        name: 'Abdul Rehman',
        designation: 'Chief Technology Officer',
        department: 'Engineering Leadership',
        bio: 'Lead architect specializing in distributed systems, high-concurrency microservices, and secure relational database design. Oversees all core engineering pipelines, CI/CD, and host infrastructure.',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        skills: ['TypeScript', 'Node.js', 'MySQL Optimization', 'Kubernetes', 'System Security'],
        linkedinUrl: 'https://www.linkedin.com/company/orbit-i-private-limited/',
        githubUrl: 'https://github.com/orbit-i',
        orderIndex: 2,
        isPublished: true,
    },
    {
        id: 3,
        name: 'Syeda Fatima Zahra',
        designation: 'Principal AI & Machine Learning Engineer',
        department: 'AI Research & Data',
        bio: 'Specialist in applied Natural Language Processing, computer vision, and predictive analytics. Designs and deploys enterprise LLM integrations and intelligent workflow automation engines.',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        skills: ['Python', 'PyTorch', 'Transformers', 'FastAPI', 'MLOps'],
        linkedinUrl: 'https://www.linkedin.com/company/orbit-i-private-limited/',
        githubUrl: 'https://github.com/orbit-i',
        orderIndex: 3,
        isPublished: true,
    },
    {
        id: 4,
        name: 'Bilal Ahmed Khan',
        designation: 'Lead Full-Stack Solutions Engineer',
        department: 'Full Stack Engineering',
        bio: 'Full-stack specialist with deep expertise in modern React, Vite, Node.js REST APIs, and financial transaction processing pipelines with multi-tier payment gateways.',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        skills: ['React 19', 'Next.js', 'Node/Express', 'PostgreSQL', 'Payment Gateways'],
        linkedinUrl: 'https://www.linkedin.com/company/orbit-i-private-limited/',
        githubUrl: 'https://github.com/orbit-i',
        orderIndex: 4,
        isPublished: true,
    },
    {
        id: 5,
        name: 'Ayesha Tariq',
        designation: 'Head of Product Design & UX',
        department: 'Product & Design',
        bio: 'Corporate design system architect with a focus on accessible, static enterprise interfaces, frictionless client portals, and brand consistency across web and mobile surfaces.',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        skills: ['Design Systems', 'Figma', 'WCAG Accessibility', 'Enterprise UI/UX'],
        linkedinUrl: 'https://www.linkedin.com/company/orbit-i-private-limited/',
        githubUrl: null,
        orderIndex: 5,
        isPublished: true,
    },
    {
        id: 6,
        name: 'Hassan Raza',
        designation: 'Cloud Infrastructure & Security Engineer',
        department: 'DevOps & Security',
        bio: 'Hardens host infrastructure, manages Hostinger cPanel / Linux daemon deployments, orchestrates SSL termination, firewalls, and automated MySQL backup routines.',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        skills: ['Linux Security', 'cPanel/Hostinger', 'Docker', 'Nginx', 'Database Hardening'],
        linkedinUrl: 'https://www.linkedin.com/company/orbit-i-private-limited/',
        githubUrl: 'https://github.com/orbit-i',
        orderIndex: 6,
        isPublished: true,
    },
];
exports.teamService = {
    async list() {
        if ((0, mysql_1.isMySQLActive)()) {
            try {
                const rows = await (0, mysql_1.query)('SELECT * FROM team_members WHERE is_published = 1 ORDER BY order_index ASC, id ASC');
                if (rows && rows.length > 0) {
                    return rows.map((r) => ({
                        id: r.id,
                        name: r.name,
                        designation: r.designation,
                        department: r.department,
                        bio: r.bio,
                        avatarUrl: r.avatar_url,
                        skills: typeof r.skills_json === 'string' ? JSON.parse(r.skills_json) : (r.skills_json || []),
                        linkedinUrl: r.linkedin_url,
                        githubUrl: r.github_url,
                        orderIndex: r.order_index,
                        isPublished: Boolean(r.is_published),
                        createdAt: r.created_at,
                    }));
                }
            }
            catch (err) {
                console.warn('[teamService] MySQL list error, falling back to memory cache:', err);
            }
        }
        return memoryTeam.filter((m) => m.isPublished);
    },
    async listAll() {
        if ((0, mysql_1.isMySQLActive)()) {
            try {
                const rows = await (0, mysql_1.query)('SELECT * FROM team_members ORDER BY order_index ASC, id ASC');
                if (rows && rows.length > 0) {
                    return rows.map((r) => ({
                        id: r.id,
                        name: r.name,
                        designation: r.designation,
                        department: r.department,
                        bio: r.bio,
                        avatarUrl: r.avatar_url,
                        skills: typeof r.skills_json === 'string' ? JSON.parse(r.skills_json) : (r.skills_json || []),
                        linkedinUrl: r.linkedin_url,
                        githubUrl: r.github_url,
                        orderIndex: r.order_index,
                        isPublished: Boolean(r.is_published),
                        createdAt: r.created_at,
                    }));
                }
            }
            catch (err) {
                console.warn('[teamService] MySQL listAll error, falling back to memory cache:', err);
            }
        }
        return memoryTeam;
    },
    async create(data) {
        const skillsJson = JSON.stringify(data.skills || []);
        if ((0, mysql_1.isMySQLActive)()) {
            try {
                const result = await (0, mysql_1.execute)(`INSERT INTO team_members (name, designation, department, bio, avatar_url, skills_json, linkedin_url, github_url, order_index, is_published)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    data.name || '',
                    data.designation || '',
                    data.department || 'Engineering',
                    data.bio || '',
                    data.avatarUrl || null,
                    skillsJson,
                    data.linkedinUrl || null,
                    data.githubUrl || null,
                    data.orderIndex || 0,
                    data.isPublished ?? true,
                ]);
                return {
                    id: result.insertId,
                    name: data.name,
                    designation: data.designation,
                    department: data.department || 'Engineering',
                    bio: data.bio,
                    avatarUrl: data.avatarUrl,
                    skills: data.skills || [],
                    linkedinUrl: data.linkedinUrl,
                    githubUrl: data.githubUrl,
                    orderIndex: data.orderIndex || 0,
                    isPublished: data.isPublished ?? true,
                };
            }
            catch (err) {
                console.warn('[teamService] MySQL create error, falling back to memory:', err);
            }
        }
        const newId = memoryTeam.length ? Math.max(...memoryTeam.map((m) => Number(m.id))) + 1 : 1;
        const newMember = {
            id: newId,
            name: data.name || '',
            designation: data.designation || '',
            department: data.department || 'Engineering',
            bio: data.bio || '',
            avatarUrl: data.avatarUrl || null,
            skills: data.skills || [],
            linkedinUrl: data.linkedinUrl || null,
            githubUrl: data.githubUrl || null,
            orderIndex: data.orderIndex || 0,
            isPublished: data.isPublished ?? true,
            createdAt: new Date().toISOString(),
        };
        memoryTeam.push(newMember);
        return newMember;
    },
    async update(id, data) {
        const numId = Number(id);
        const skillsJson = data.skills ? JSON.stringify(data.skills) : undefined;
        if ((0, mysql_1.isMySQLActive)()) {
            try {
                await (0, mysql_1.execute)(`UPDATE team_members SET 
            name = COALESCE(?, name),
            designation = COALESCE(?, designation),
            department = COALESCE(?, department),
            bio = COALESCE(?, bio),
            avatar_url = COALESCE(?, avatar_url),
            skills_json = COALESCE(?, skills_json),
            linkedin_url = COALESCE(?, linkedin_url),
            github_url = COALESCE(?, github_url),
            order_index = COALESCE(?, order_index),
            is_published = COALESCE(?, is_published)
           WHERE id = ?`, [
                    data.name ?? null,
                    data.designation ?? null,
                    data.department ?? null,
                    data.bio ?? null,
                    data.avatarUrl ?? null,
                    skillsJson ?? null,
                    data.linkedinUrl ?? null,
                    data.githubUrl ?? null,
                    data.orderIndex ?? null,
                    data.isPublished !== undefined ? (data.isPublished ? 1 : 0) : null,
                    numId,
                ]);
            }
            catch (err) {
                console.warn('[teamService] MySQL update error:', err);
            }
        }
        const idx = memoryTeam.findIndex((m) => String(m.id) === String(id));
        if (idx !== -1) {
            memoryTeam[idx] = { ...memoryTeam[idx], ...data };
            return memoryTeam[idx];
        }
        throw ApiError_1.ApiError.notFound('Team member not found');
    },
    async remove(id) {
        const numId = Number(id);
        if ((0, mysql_1.isMySQLActive)()) {
            try {
                await (0, mysql_1.execute)('DELETE FROM team_members WHERE id = ?', [numId]);
            }
            catch (err) {
                console.warn('[teamService] MySQL delete error:', err);
            }
        }
        const idx = memoryTeam.findIndex((m) => String(m.id) === String(id));
        if (idx !== -1) {
            memoryTeam.splice(idx, 1);
            return;
        }
        throw ApiError_1.ApiError.notFound('Team member not found');
    },
};
//# sourceMappingURL=teamService.js.map