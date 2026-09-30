"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const roles_1 = require("../constants/roles");
const userSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: roles_1.ALL_ROLES, default: roles_1.ROLES.CLIENT },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    avatarUrl: { type: String },
    emailVerificationToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
}, { timestamps: true });
userSchema.methods.comparePassword = function (candidate) {
    return bcryptjs_1.default.compare(candidate, this.passwordHash);
};
userSchema.set('toJSON', {
    transform: (_doc, ret) => {
        delete ret.passwordHash;
        delete ret.emailVerificationToken;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.User = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=User.js.map