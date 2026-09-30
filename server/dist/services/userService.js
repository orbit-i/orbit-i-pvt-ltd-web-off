"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const User_1 = require("../models/User");
const ApiError_1 = require("../utils/ApiError");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const roles_1 = require("../constants/roles");
exports.userService = {
    async getById(id) {
        const user = await User_1.User.findById(id);
        if (!user)
            throw ApiError_1.ApiError.notFound('User not found');
        return user;
    },
    async updateProfile(id, updates) {
        const user = await User_1.User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!user)
            throw ApiError_1.ApiError.notFound('User not found');
        return user;
    },
    async listClients(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const filter = { role: 'client' };
        if (query.search) {
            filter.$or = [
                { fullName: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } },
            ];
        }
        const [items, totalItems] = await Promise.all([
            User_1.User.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            User_1.User.countDocuments(filter),
        ]);
        return { items, page, totalItems, totalPages: Math.ceil(totalItems / limit) };
    },
    async setActiveStatus(id, isActive) {
        const user = await User_1.User.findByIdAndUpdate(id, { isActive }, { new: true });
        if (!user)
            throw ApiError_1.ApiError.notFound('User not found');
        return user;
    },
    async listSeoManagers() {
        return User_1.User.find({ role: roles_1.ROLES.SEO_MANAGER }).sort({ createdAt: -1 });
    },
    async deleteSeoManager(id) {
        const user = await User_1.User.findOneAndDelete({ _id: id, role: roles_1.ROLES.SEO_MANAGER });
        if (!user)
            throw ApiError_1.ApiError.notFound('SEO manager not found');
    },
    async createEditor(input) {
        if (await User_1.User.findOne({ email: input.email }))
            throw ApiError_1.ApiError.conflict('An account with this email already exists');
        return User_1.User.create({
            fullName: input.fullName,
            email: input.email,
            passwordHash: await bcryptjs_1.default.hash(input.password, 12),
            role: roles_1.ROLES.EDITOR,
            isVerified: true,
        });
    },
    async createSeoManager(input) {
        if (await User_1.User.findOne({ email: input.email }))
            throw ApiError_1.ApiError.conflict('An account with this email already exists');
        return User_1.User.create({
            fullName: input.fullName,
            email: input.email,
            passwordHash: await bcryptjs_1.default.hash(input.password, 12),
            role: roles_1.ROLES.SEO_MANAGER,
            isVerified: true,
        });
    },
};
//# sourceMappingURL=userService.js.map