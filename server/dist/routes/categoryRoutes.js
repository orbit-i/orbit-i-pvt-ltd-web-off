"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryService_1 = require("../services/categoryService");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../constants/roles");
const validate_1 = require("../middleware/validate");
const catalogValidators_1 = require("../validators/catalogValidators");
const router = (0, express_1.Router)();
router.get('/', (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const categories = await categoryService_1.categoryService.list();
    return (0, ApiResponse_1.sendSuccess)(res, 200, 'Categories fetched', categories);
}));
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.SEO_CONTENT_ROLES), (0, validate_1.validateBody)(catalogValidators_1.createCategorySchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const category = await categoryService_1.categoryService.create(req.body);
    return (0, ApiResponse_1.sendSuccess)(res, 201, 'Category created', category);
}));
router.patch('/:id', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.SEO_CONTENT_ROLES), (0, validate_1.validateBody)(catalogValidators_1.updateCategorySchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => (0, ApiResponse_1.sendSuccess)(res, 200, 'Category updated', await categoryService_1.categoryService.update(req.params.id, req.body))));
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.SEO_CONTENT_ROLES), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await categoryService_1.categoryService.remove(req.params.id);
    return (0, ApiResponse_1.sendSuccess)(res, 200, 'Category deleted', null);
}));
const tagRouter = (0, express_1.Router)();
tagRouter.get('/', (0, asyncHandler_1.asyncHandler)(async (_req, res) => (0, ApiResponse_1.sendSuccess)(res, 200, 'Tags fetched', await categoryService_1.tagService.list())));
tagRouter.post('/', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.SEO_CONTENT_ROLES), (0, validate_1.validateBody)(catalogValidators_1.createTagSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => (0, ApiResponse_1.sendSuccess)(res, 201, 'Tag created', await categoryService_1.tagService.create(req.body))));
tagRouter.patch('/:id', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.SEO_CONTENT_ROLES), (0, validate_1.validateBody)(catalogValidators_1.updateTagSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => (0, ApiResponse_1.sendSuccess)(res, 200, 'Tag updated', await categoryService_1.tagService.update(req.params.id, req.body))));
tagRouter.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.SEO_CONTENT_ROLES), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await categoryService_1.tagService.remove(req.params.id);
    return (0, ApiResponse_1.sendSuccess)(res, 200, 'Tag deleted', null);
}));
tagRouter.post('/:id/merge/:targetId', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.SEO_CONTENT_ROLES), (0, asyncHandler_1.asyncHandler)(async (req, res) => (0, ApiResponse_1.sendSuccess)(res, 200, 'Tags merged', await categoryService_1.tagService.merge(req.params.id, req.params.targetId))));
router.use('/tags', tagRouter);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map