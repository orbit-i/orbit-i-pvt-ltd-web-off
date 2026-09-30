"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    project: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    title: { type: String, required: true },
    isComplete: { type: Boolean, default: false },
    dueDate: { type: Date },
}, { timestamps: true });
taskSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Task = (0, mongoose_1.model)('Task', taskSchema);
//# sourceMappingURL=Task.js.map