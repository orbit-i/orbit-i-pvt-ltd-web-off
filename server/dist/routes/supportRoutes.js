"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supportController_1 = require("../controllers/supportController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const catalogValidators_1 = require("../validators/catalogValidators");
const roles_1 = require("../constants/roles");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(roles_1.ROLES.CLIENT), (0, validate_1.validateBody)(catalogValidators_1.createSupportTicketSchema), supportController_1.supportController.create);
router.get('/mine', auth_1.authenticate, (0, auth_1.authorize)(roles_1.ROLES.CLIENT), supportController_1.supportController.listMine);
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), supportController_1.supportController.listAll);
router.patch('/:id/status', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), supportController_1.supportController.updateStatus);
exports.default = router;
//# sourceMappingURL=supportRoutes.js.map