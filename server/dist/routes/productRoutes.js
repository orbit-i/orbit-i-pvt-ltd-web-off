"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const catalogValidators_1 = require("../validators/catalogValidators");
const roles_1 = require("../constants/roles");
const router = (0, express_1.Router)();
// Public
router.get('/', productController_1.productController.list);
router.get('/:slug', productController_1.productController.getBySlug);
// Admin
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), (0, validate_1.validateBody)(catalogValidators_1.createProductSchema), productController_1.productController.create);
router.patch('/:id', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), (0, validate_1.validateBody)(catalogValidators_1.updateProductSchema), productController_1.productController.update);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), productController_1.productController.archive);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map