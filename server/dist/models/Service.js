"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const mongoose_1 = require("mongoose");
const serviceSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    summary: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true },
    benefits: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    processSteps: { type: [{ title: String, description: String }], default: [] },
    icon: { type: String, default: 'Code2' },
}, { timestamps: true });
serviceSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Service = (0, mongoose_1.model)('Service', serviceSchema);
//# sourceMappingURL=Service.js.map