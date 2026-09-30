"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDashboardService = void 0;
const User_1 = require("../models/User");
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const Project_1 = require("../models/Project");
const ContactMessage_1 = require("../models/ContactMessage");
const BlogPost_1 = require("../models/BlogPost");
const Category_1 = require("../models/Category");
const Tag_1 = require("../models/Tag");
exports.adminDashboardService = {
    async getMetrics() {
        const [totalClients, totalOrders, activeProducts, activeProjects, pendingLeads, revenueAgg] = await Promise.all([
            User_1.User.countDocuments({ role: 'client' }),
            Order_1.Order.countDocuments(),
            Product_1.Product.countDocuments({ status: 'available' }),
            Project_1.Project.countDocuments({ status: { $in: ['planning', 'in_progress'] } }),
            ContactMessage_1.ContactMessage.countDocuments({ status: 'new' }),
            Order_1.Order.aggregate([
                { $match: { status: { $in: ['confirmed', 'in_progress', 'completed'] } } },
                { $group: { _id: null, total: { $sum: '$total' } } },
            ]),
        ]);
        return {
            totalClients,
            totalOrders,
            activeProducts,
            activeProjects,
            pendingLeads,
            revenue: revenueAgg[0]?.total ?? 0,
        };
    },
    async getCmsMetrics() {
        const [totalPosts, publishedPosts, draftPosts, scheduledPosts, totalCategories, totalTags, totalAuthors, mostViewedPosts, seoIssues] = await Promise.all([
            BlogPost_1.BlogPost.countDocuments(),
            BlogPost_1.BlogPost.countDocuments({ status: 'published' }),
            BlogPost_1.BlogPost.countDocuments({ status: 'draft' }),
            BlogPost_1.BlogPost.countDocuments({ status: 'scheduled' }),
            Category_1.Category.countDocuments(),
            Tag_1.Tag.countDocuments(),
            BlogPost_1.BlogPost.distinct('author').then((authors) => authors.length),
            BlogPost_1.BlogPost.find({ status: 'published' }).sort({ views: -1 }).limit(5).select('title slug views'),
            BlogPost_1.BlogPost.countDocuments({ $or: [{ seoTitle: { $in: [null, ''] } }, { seoDescription: { $in: [null, ''] } }] }),
        ]);
        return { totalPosts, publishedPosts, draftPosts, scheduledPosts, totalCategories, totalTags, totalAuthors, mostViewedPosts, seoIssues, analytics: { provider: 'application', visitors: null, pageViews: null, organicTraffic: null } };
    },
};
//# sourceMappingURL=adminDashboardService.js.map