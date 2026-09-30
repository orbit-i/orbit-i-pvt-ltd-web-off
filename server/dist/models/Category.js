"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, trim: true, maxlength: 500 },
    seoTitle: { type: String, trim: true, maxlength: 180 },
    metaDescription: { type: String, trim: true, maxlength: 320 },
}, { timestamps: true });
categorySchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Category = (0, mongoose_1.model)('Category', categorySchema);
//# sourceMappingURL=Category.js.map