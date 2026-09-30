"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const Product_1 = require("../models/Product");
const ApiError_1 = require("../utils/ApiError");
exports.productService = {
    async list(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 12;
        const filter = {};
        if (query.search)
            filter.$text = { $search: query.search };
        if (query.category)
            filter.category = query.category;
        if (query.status)
            filter.status = query.status;
        const [items, totalItems] = await Promise.all([
            Product_1.Product.find(filter)
                .populate('category', 'name slug')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Product_1.Product.countDocuments(filter),
        ]);
        return { items, page, totalItems, totalPages: Math.ceil(totalItems / limit) };
    },
    async getBySlug(slug) {
        const product = await Product_1.Product.findOne({ slug }).populate('category', 'name slug');
        if (!product)
            throw ApiError_1.ApiError.notFound('Product not found');
        return product;
    },
    async getById(id) {
        const product = await Product_1.Product.findById(id);
        if (!product)
            throw ApiError_1.ApiError.notFound('Product not found');
        return product;
    },
    async create(data) {
        const existing = await Product_1.Product.findOne({ slug: data.slug });
        if (existing)
            throw ApiError_1.ApiError.conflict('A product with this slug already exists');
        return Product_1.Product.create(data);
    },
    async update(id, data) {
        const product = await Product_1.Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!product)
            throw ApiError_1.ApiError.notFound('Product not found');
        return product;
    },
    async archive(id) {
        const product = await Product_1.Product.findByIdAndUpdate(id, { status: 'archived' }, { new: true });
        if (!product)
            throw ApiError_1.ApiError.notFound('Product not found');
        return product;
    },
};
//# sourceMappingURL=productService.js.map