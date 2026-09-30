"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const milestoneSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    dueDate: { type: Date, required: true },
    isComplete: { type: Boolean, default: false },
}, { timestamps: true });
const projectSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    client: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['planning', 'in_progress', 'on_hold', 'completed'], default: 'planning' },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    assignedTeam: { type: [String], default: [] },
    milestones: { type: [milestoneSchema], default: [] },
    documents: { type: [{ name: String, url: String }], default: [] },
    updates: { type: [{ message: String, postedAt: { type: Date, default: Date.now } }], default: [] },
    startDate: { type: Date, required: true },
    targetDate: { type: Date },
}, { timestamps: true });
projectSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Project = (0, mongoose_1.model)('Project', projectSchema);
//# sourceMappingURL=Project.js.map