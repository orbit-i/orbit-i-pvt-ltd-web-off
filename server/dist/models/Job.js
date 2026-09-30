"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplication = exports.Job = void 0;
const mongoose_1 = require("mongoose");
const jobSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    employmentType: {
        type: String,
        enum: ['full_time', 'part_time', 'contract', 'internship'],
        required: true,
    },
    experience: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    responsibilities: { type: [String], default: [] },
    isOpen: { type: Boolean, default: true, index: true },
}, { timestamps: true });
jobSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Job = (0, mongoose_1.model)('Job', jobSchema);
const jobApplicationSchema = new mongoose_1.Schema({
    job: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String },
    linkedin: { type: String },
    portfolio: { type: String },
    status: { type: String, enum: ['new', 'reviewed', 'rejected', 'hired'], default: 'new' },
}, { timestamps: true });
jobApplicationSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.JobApplication = (0, mongoose_1.model)('JobApplication', jobApplicationSchema);
//# sourceMappingURL=Job.js.map