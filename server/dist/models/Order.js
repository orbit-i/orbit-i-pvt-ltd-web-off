"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const orderItemSchema = new mongoose_1.Schema({
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
}, { _id: false });
const orderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [orderItemSchema], required: true, validate: (v) => v.length > 0 },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
        default: 'pending',
        index: true,
    },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    // Left open for future payment gateway integration — never hard-code a
    // specific provider's fields directly onto the order.
    paymentReference: { type: String },
}, { timestamps: true });
orderSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
//# sourceMappingURL=Order.js.map