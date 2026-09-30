"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tag = void 0;
const mongoose_1 = require("mongoose");
const tagSchema = new mongoose_1.Schema({ name: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true } }, { timestamps: true });
tagSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Tag = (0, mongoose_1.model)('Tag', tagSchema);
//# sourceMappingURL=Tag.js.map