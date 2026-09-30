"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogPostSchema = exports.createBlogPostSchema = exports.updateTagSchema = exports.createTagSchema = exports.updateCategorySchema = exports.createCategorySchema = exports.jobApplicationSchema = exports.createSupportTicketSchema = exports.contactMessageSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(160),
    slug: zod_1.z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
    category: zod_1.z.string().min(1, 'Category is required'),
    shortDescription: zod_1.z.string().trim().min(10).max(240),
    description: zod_1.z.string().trim().min(20),
    images: zod_1.z.array(zod_1.z.string().url()).default([]),
    features: zod_1.z.array(zod_1.z.string()).default([]),
    price: zod_1.z.number().min(0),
    currency: zod_1.z.string().default('USD'),
    status: zod_1.z.enum(['available', 'coming_soon', 'archived']).default('available'),
});
exports.updateProductSchema = exports.createProductSchema.partial();
exports.createOrderSchema = zod_1.z.object({
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.string().min(1),
        quantity: zod_1.z.number().int().min(1).default(1),
    }))
        .min(1, 'At least one item is required'),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
});
exports.contactMessageSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(120),
    email: zod_1.z.string().trim().toLowerCase().email(),
    phone: zod_1.z.string().trim().optional(),
    company: zod_1.z.string().trim().optional(),
    subject: zod_1.z.string().trim().min(3).max(160),
    message: zod_1.z.string().trim().min(10).max(5000),
});
exports.createSupportTicketSchema = zod_1.z.object({
    subject: zod_1.z.string().trim().min(3).max(160),
    message: zod_1.z.string().trim().min(10).max(5000),
});
exports.jobApplicationSchema = zod_1.z.object({
    jobId: zod_1.z.string().min(1, 'Job is required'),
    name: zod_1.z.string().trim().min(2).max(120),
    email: zod_1.z.string().trim().toLowerCase().email(),
    phone: zod_1.z.string().trim().optional(),
    resumeUrl: zod_1.z.string().url('A resume link is required'),
    coverLetter: zod_1.z.string().trim().max(5000).optional(),
    linkedin: zod_1.z.string().trim().optional(),
    portfolio: zod_1.z.string().trim().optional(),
});
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(80),
    slug: zod_1.z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/).optional(),
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
exports.createTagSchema = exports.createCategorySchema;
exports.updateTagSchema = exports.updateCategorySchema;
exports.createBlogPostSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(3).max(180),
    slug: zod_1.z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/).optional(),
    excerpt: zod_1.z.string().trim().min(10).max(320),
    content: zod_1.z.string().min(1).max(500000),
    coverImage: zod_1.z.string().url().optional(),
    ogImage: zod_1.z.string().url().optional(),
    canonicalUrl: zod_1.z.string().url().optional(),
    category: zod_1.z.string().min(1),
    tags: zod_1.z.array(zod_1.z.string().min(1)).default([]),
    status: zod_1.z.enum(['draft', 'scheduled', 'published']).default('draft'),
    publishedAt: zod_1.z.coerce.date().optional(),
    scheduledAt: zod_1.z.coerce.date().optional(),
    seoTitle: zod_1.z.string().trim().max(180).optional(),
    seoDescription: zod_1.z.string().trim().max(320).optional(),
    focusKeyword: zod_1.z.string().trim().max(120).optional(),
    secondaryKeywords: zod_1.z.array(zod_1.z.string().trim().max(120)).default([]),
    ogTitle: zod_1.z.string().trim().max(180).optional(),
    ogDescription: zod_1.z.string().trim().max(320).optional(),
    robots: zod_1.z.enum(['index,follow', 'noindex,follow', 'index,nofollow', 'noindex,nofollow']).optional(),
});
exports.updateBlogPostSchema = exports.createBlogPostSchema.partial();
//# sourceMappingURL=catalogValidators.js.map