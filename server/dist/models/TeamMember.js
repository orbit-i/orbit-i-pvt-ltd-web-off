"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMember = void 0;
const mongoose_1 = require("mongoose");
const teamMemberSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    bio: { type: String, required: true },
    avatarUrl: { type: String },
    linkedinUrl: { type: String },
    skills: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
}, { timestamps: true });
teamMemberSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.TeamMember = (0, mongoose_1.model)('TeamMember', teamMemberSchema);
//# sourceMappingURL=TeamMember.js.map