"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const ApiError_1 = require("../utils/ApiError");
exports.orderService = {
    async create(input) {
        const products = await Product_1.Product.find({ _id: { $in: input.items.map((i) => i.productId) } });
        if (products.length !== input.items.length) {
            throw ApiError_1.ApiError.badRequest('One or more products in this order could not be found');
        }
        const items = input.items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (product.status !== 'available') {
                throw ApiError_1.ApiError.badRequest(`"${product.name}" is not currently available for purchase`);
            }
            return {
                product: product.id,
                productName: product.name,
                quantity: item.quantity,
                unitPrice: product.price,
            };
        });
        const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        return Order_1.Order.create({ user: input.userId, items, total, currency: 'USD', status: 'pending' });
    },
    async listForUser(userId) {
        return Order_1.Order.find({ user: userId }).sort({ createdAt: -1 });
    },
    async getForUser(orderId, userId) {
        const order = await Order_1.Order.findOne({ _id: orderId, user: userId });
        if (!order)
            throw ApiError_1.ApiError.notFound('Order not found');
        return order;
    },
    async listAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const filter = {};
        if (query.status)
            filter.status = query.status;
        const [items, totalItems] = await Promise.all([
            Order_1.Order.find(filter)
                .populate('user', 'fullName email')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Order_1.Order.countDocuments(filter),
        ]);
        return { items, page, totalItems, totalPages: Math.ceil(totalItems / limit) };
    },
    async updateStatus(orderId, status) {
        const order = await Order_1.Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order)
            throw ApiError_1.ApiError.notFound('Order not found');
        return order;
    },
};
//# sourceMappingURL=orderService.js.map