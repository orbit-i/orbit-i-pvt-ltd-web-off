"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseStudy = void 0;
const mongoose_1 = require("mongoose");
const caseStudySchema = new mongoose_1.Schema({
    projectName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    clientIndustry: { type: String, required: true },
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    technologies: { type: [String], default: [] },
    results: { type: [String], default: [] },
    coverImage: { type: String },
    gallery: { type: [String], default: [] },
    content: { type: String },
    testimonial: {
        quote: { type: String },
        author: { type: String },
        role: { type: String },
    },
    metrics: { type: [{ label: String, value: String }], default: [] },
    seoTitle: { type: String, trim: true, maxlength: 180 },
    seoDescription: { type: String, trim: true, maxlength: 320 },
    isPublished: { type: Boolean, default: true },
}, { timestamps: true });
caseStudySchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.CaseStudy = (0, mongoose_1.model)('CaseStudy', caseStudySchema);
//# sourceMappingURL=CaseStudy.js.map