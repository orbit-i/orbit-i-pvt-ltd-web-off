"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true },
    shortDescription: { type: String, required: true, maxlength: 240 },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    features: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['available', 'coming_soon', 'archived'], default: 'available', index: true },
}, { timestamps: true });
productSchema.index({ name: 'text', shortDescription: 'text' });
productSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Product = (0, mongoose_1.model)('Product', productSchema);
//# sourceMappingURL=Product.js.map