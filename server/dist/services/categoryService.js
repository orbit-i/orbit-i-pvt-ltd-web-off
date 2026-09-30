"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagService = exports.categoryService = void 0;
const Category_1 = require("../models/Category");
const ApiError_1 = require("../utils/ApiError");
const Tag_1 = require("../models/Tag");
const BlogPost_1 = require("../models/BlogPost");
const sanitize_1 = require("../utils/sanitize");
exports.categoryService = {
    async list() {
        return Category_1.Category.find().sort({ name: 1 });
    },
    async create(data) {
        const payload = { ...data, slug: data.slug || (0, sanitize_1.slugify)(data.name) };
        const existing = await Category_1.Category.findOne({ slug: payload.slug });
        if (existing)
            throw ApiError_1.ApiError.conflict('A category with this slug already exists');
        return Category_1.Category.create(payload);
    },
    async update(id, data) {
        const category = await Category_1.Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!category)
            throw ApiError_1.ApiError.notFound('Category not found');
        return category;
    },
    async remove(id) {
        if (await BlogPost_1.BlogPost.exists({ category: id }))
            throw ApiError_1.ApiError.conflict('Cannot delete a category used by blog posts');
        const category = await Category_1.Category.findByIdAndDelete(id);
        if (!category)
            throw ApiError_1.ApiError.notFound('Category not found');
    },
};
exports.tagService = {
    async list() { return Tag_1.Tag.find().sort({ name: 1 }); },
    async create(data) {
        const payload = { ...data, slug: data.slug || (0, sanitize_1.slugify)(data.name) };
        if (await Tag_1.Tag.findOne({ slug: payload.slug }))
            throw ApiError_1.ApiError.conflict('A tag with this slug already exists');
        return Tag_1.Tag.create(payload);
    },
    async update(id, data) {
        const tag = await Tag_1.Tag.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!tag)
            throw ApiError_1.ApiError.notFound('Tag not found');
        return tag;
    },
    async remove(id) {
        await BlogPost_1.BlogPost.updateMany({ tags: id }, { $pull: { tags: id } });
        const tag = await Tag_1.Tag.findByIdAndDelete(id);
        if (!tag)
            throw ApiError_1.ApiError.notFound('Tag not found');
    },
    async merge(sourceId, targetId) {
        if (sourceId === targetId)
            throw ApiError_1.ApiError.badRequest('Source and target tags must be different');
        const [source, target] = await Promise.all([Tag_1.Tag.findById(sourceId), Tag_1.Tag.findById(targetId)]);
        if (!source || !target)
            throw ApiError_1.ApiError.notFound('Source or target tag not found');
        await BlogPost_1.BlogPost.updateMany({ tags: sourceId }, { $addToSet: { tags: targetId } });
        await BlogPost_1.BlogPost.updateMany({ tags: sourceId }, { $pull: { tags: sourceId } });
        await Tag_1.Tag.findByIdAndDelete(sourceId);
        return target;
    },
};
//# sourceMappingURL=categoryService.js.map