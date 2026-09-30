"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportService = void 0;
const Misc_1 = require("../models/Misc");
const ApiError_1 = require("../utils/ApiError");
exports.supportService = {
    async create(data) {
        return Misc_1.SupportTicket.create({ user: data.userId, subject: data.subject, message: data.message, status: 'open' });
    },
    async listForUser(userId) {
        return Misc_1.SupportTicket.find({ user: userId }).sort({ createdAt: -1 });
    },
    async listAll(query) {
        const filter = {};
        if (query.status)
            filter.status = query.status;
        return Misc_1.SupportTicket.find(filter).populate('user', 'fullName email').sort({ createdAt: -1 });
    },
    async updateStatus(id, status) {
        const ticket = await Misc_1.SupportTicket.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        if (!ticket)
            throw ApiError_1.ApiError.notFound('Support ticket not found');
        return ticket;
    },
};
//# sourceMappingURL=supportService.js.map