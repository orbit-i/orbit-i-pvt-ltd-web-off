"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const catalogValidators_1 = require("../validators/catalogValidators");
const roles_1 = require("../constants/roles");
const router = (0, express_1.Router)();
// Client
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(roles_1.ROLES.CLIENT), (0, validate_1.validateBody)(catalogValidators_1.createOrderSchema), orderController_1.orderController.create);
router.get('/mine', auth_1.authenticate, (0, auth_1.authorize)(roles_1.ROLES.CLIENT), orderController_1.orderController.listMine);
router.get('/mine/:id', auth_1.authenticate, (0, auth_1.authorize)(roles_1.ROLES.CLIENT), orderController_1.orderController.getMine);
// Admin
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), orderController_1.orderController.listAll);
router.patch('/:id/status', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), (0, validate_1.validateBody)(catalogValidators_1.updateOrderStatusSchema), orderController_1.orderController.updateStatus);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map