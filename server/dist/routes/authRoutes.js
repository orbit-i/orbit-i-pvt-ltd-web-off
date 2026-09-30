"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validate_1 = require("../middleware/validate");
const rateLimiter_1 = require("../middleware/rateLimiter");
const authValidators_1 = require("../validators/authValidators");
const router = (0, express_1.Router)();
router.post('/register', rateLimiter_1.authRateLimiter, (0, validate_1.validateBody)(authValidators_1.registerSchema), authController_1.authController.register);
router.post('/login', rateLimiter_1.authRateLimiter, (0, validate_1.validateBody)(authValidators_1.loginSchema), authController_1.authController.login);
router.post('/refresh', authController_1.authController.refresh);
router.post('/logout', authController_1.authController.logout);
router.post('/forgot-password', rateLimiter_1.authRateLimiter, (0, validate_1.validateBody)(authValidators_1.forgotPasswordSchema), authController_1.authController.forgotPassword);
router.post('/reset-password', rateLimiter_1.authRateLimiter, (0, validate_1.validateBody)(authValidators_1.resetPasswordSchema), authController_1.authController.resetPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map