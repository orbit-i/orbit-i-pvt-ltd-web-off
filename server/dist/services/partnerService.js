"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerService = void 0;
const mysql_1 = require("../config/mysql");
const ApiError_1 = require("../utils/ApiError");
// In-memory fallback dataset for verified corporate partners
let memoryPartners = [
    {
        id: 1,
        name: 'JazzCash Merchant Solutions',
        logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&q=80',
        websiteUrl: 'https://www.jazzcash.com.pk/',
        category: 'fintech',
        description: 'Direct mobile wallet and payment gateway merchant integration for corporate invoice settlements.',
        orderIndex: 1,
        isFeatured: true,
    },
    {
        id: 2,
        name: 'EasyPaisa Business Gateways',
        logoUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=200&q=80',
        websiteUrl: 'https://easypaisa.com.pk/',
        category: 'fintech',
        description: 'Instant OTC and direct wallet checkout integration across web & mobile portals.',
        orderIndex: 2,
        isFeatured: true,
    },
    {
        id: 3,
        name: 'Meezan Bank Limited',
        logoUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=200&q=80',
        websiteUrl: 'https://www.meezanbank.com/',
        category: 'enterprise',
        description: 'Corporate banking partner for verified IBAN wire settlements and institutional accounts.',
        orderIndex: 3,
        isFeatured: true,
    },
    {
        id: 4,
        name: 'Hostinger Cloud Infrastructure',
        logoUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=200&q=80',
        websiteUrl: 'https://www.hostinger.com/',
        category: 'cloud',
        description: 'High-availability Node.js runtime and MySQL cloud cluster hosting partner.',
        orderIndex: 4,
        isFeatured: true,
    },
    {
        id: 5,
        name: 'Cloudflare Enterprise Edge',
        logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80',
        websiteUrl: 'https://www.cloudflare.com/',
        category: 'cloud',
        description: 'DDoS mitigation, web application firewall (WAF), and edge SSL caching layer.',
        orderIndex: 5,
        isFeatured: true,
    },
    {
        id: 6,
        name: 'NayaPay Financial',
        logoUrl: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=200&q=80',
        websiteUrl: 'https://www.nayapay.com/',
        category: 'fintech',
        description: 'Digital wallet and Visa debit settlement rails for online transactions.',
        orderIndex: 6,
        isFeatured: true,
    },
    {
        id: 7,
        name: 'FAST-NUCES Innovation Hub',
        logoUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80',
        websiteUrl: 'https://nu.edu.pk/',
        category: 'academic',
        description: 'Academic partnership for graduate trainee onboarding, AI research, and verified internships.',
        orderIndex: 7,
        isFeatured: true,
    },
    {
        id: 8,
        name: 'Stripe Global Payments',
        logoUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=200&q=80',
        websiteUrl: 'https://stripe.com/',
        category: 'fintech',
        description: 'International card processing engine for USD and global enterprise clients.',
        orderIndex: 8,
        isFeatured: true,
    },
];
exports.partnerService = {
    async list() {
        if ((0, mysql_1.isMySQLActive)()) {
            try {
                const rows = await (0, mysql_1.query)('SELECT * FROM partners ORDER BY order_index ASC, id ASC');
                if (rows && rows.length > 0) {
                    return rows.map((r) => ({
                        id: r.id,
                        name: r.name,
                        logoUrl: r.logo_url,
                        websiteUrl: r.website_url,
                        category: r.category,
                        description: r.description,
                        orderIndex: r.order_index,
                        isFeatured: Boolean(r.is_featured),
                        createdAt: r.created_at,
                    }));
                }
            }
            catch (err) {
                console.warn('[partnerService] MySQL list error, falling back to memory:', err);
            }
        }
        return memoryPartners;
    },
    async listFeatured() {
        const all = await this.list();
        return all.filter((p) => p.isFeatured);
    },
    async create(data) {
        if ((0, mysql_1.isMySQLActive)()) {
            try {
                const result = await (0, mysql_1.execute)(`INSERT INTO partners (name, logo_url, website_url, category, description, order_index, is_featured)
           VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                    data.name || '',
                    data.logoUrl || null,
                    data.websiteUrl || null,
                    data.category || 'enterprise',
                    data.description || null,
                    data.orderIndex || 0,
                    data.isFeatured ?? true,
                ]);
                return {
                    id: result.insertId,
                    name: data.name,
                    logoUrl: data.logoUrl,
                    websiteUrl: data.websiteUrl,
                    category: data.category || 'enterprise',
                    description: data.description,
                    orderIndex: data.orderIndex || 0,
                    isFeatured: data.isFeatured ?? true,
                };
            }
            catch (err) {
                console.warn('[partnerService] MySQL create error, using memory fallback:', err);
            }
        }
        const newId = memoryPartners.length ? Math.max(...memoryPartners.map((p) => Number(p.id))) + 1 : 1;
        const item = {
            id: newId,
            name: data.name || '',
            logoUrl: data.logoUrl || null,
            websiteUrl: data.websiteUrl || null,
            category: data.category || 'enterprise',
            description: data.description || null,
            orderIndex: data.orderIndex || 0,
            isFeatured: data.isFeatured ?? true,
            createdAt: new Date().toISOString(),
        };
        memoryPartners.push(item);
        return item;
    },
    async update(id, data) {
        const numId = Number(id);
        if ((0, mysql_1.isMySQLActive)()) {
            try {
                await (0, mysql_1.execute)(`UPDATE partners SET
            name = COALESCE(?, name),
            logo_url = COALESCE(?, logo_url),
            website_url = COALESCE(?, website_url),
            category = COALESCE(?, category),
            description = COALESCE(?, description),
            order_index = COALESCE(?, order_index),
            is_featured = COALESCE(?, is_featured)
           WHERE id = ?`, [
                    data.name ?? null,
                    data.logoUrl ?? null,
                    data.websiteUrl ?? null,
                    data.category ?? null,
                    data.description ?? null,
                    data.orderIndex ?? null,
                    data.isFeatured !== undefined ? (data.isFeatured ? 1 : 0) : null,
                    numId,
                ]);
            }
            catch (err) {
                console.warn('[partnerService] MySQL update error:', err);
            }
        }
        const idx = memoryPartners.findIndex((p) => String(p.id) === String(id));
        if (idx !== -1) {
            memoryPartners[idx] = { ...memoryPartners[idx], ...data };
            return memoryPartners[idx];
        }
        throw ApiError_1.ApiError.notFound('Partner not found');
    },
    async remove(id) {
        const numId = Number(id);
        if ((0, mysql_1.isMySQLActive)()) {
            try {
                await (0, mysql_1.execute)('DELETE FROM partners WHERE id = ?', [numId]);
            }
            catch (err) {
                console.warn('[partnerService] MySQL delete error:', err);
            }
        }
        const idx = memoryPartners.findIndex((p) => String(p.id) === String(id));
        if (idx !== -1) {
            memoryPartners.splice(idx, 1);
            return;
        }
        throw ApiError_1.ApiError.notFound('Partner not found');
    },
};
//# sourceMappingURL=partnerService.js.map