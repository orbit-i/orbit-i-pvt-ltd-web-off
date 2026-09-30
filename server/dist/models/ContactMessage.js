"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactMessage = void 0;
const mongoose_1 = require("mongoose");
const contactMessageSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new', index: true },
}, { timestamps: true });
contactMessageSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.ContactMessage = (0, mongoose_1.model)('ContactMessage', contactMessageSchema);
//# sourceMappingURL=ContactMessage.js.map