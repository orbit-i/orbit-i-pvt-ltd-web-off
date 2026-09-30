"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRevision = void 0;
const mongoose_1 = require("mongoose");
const postRevisionSchema = new mongoose_1.Schema({
    post: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlogPost', required: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    changedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, enum: ['save', 'restore', 'autosave'], default: 'save' },
}, { timestamps: true });
postRevisionSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.PostRevision = (0, mongoose_1.model)('PostRevision', postRevisionSchema);
//# sourceMappingURL=PostRevision.js.map