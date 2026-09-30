"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Testimonial = exports.SupportTicket = exports.Invoice = exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String },
}, { timestamps: true });
notificationSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Notification = (0, mongoose_1.model)('Notification', notificationSchema);
const invoiceSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    order: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order' },
    project: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['paid', 'unpaid', 'overdue'], default: 'unpaid' },
    issuedAt: { type: Date, default: Date.now },
    dueAt: { type: Date },
}, { timestamps: true });
invoiceSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Invoice = (0, mongoose_1.model)('Invoice', invoiceSchema);
const supportTicketSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
}, { timestamps: true });
supportTicketSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.SupportTicket = (0, mongoose_1.model)('SupportTicket', supportTicketSchema);
const testimonialSchema = new mongoose_1.Schema({
    authorName: { type: String, required: true },
    authorRole: { type: String, required: true },
    company: { type: String, required: true },
    quote: { type: String, required: true },
    avatarUrl: { type: String },
    isPublished: { type: Boolean, default: true },
}, { timestamps: true });
testimonialSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Testimonial = (0, mongoose_1.model)('Testimonial', testimonialSchema);
//# sourceMappingURL=Misc.js.map