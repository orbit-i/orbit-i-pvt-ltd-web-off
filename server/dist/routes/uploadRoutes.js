"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const roles_1 = require("../constants/roles");
const router = (0, express_1.Router)();
router.post('/image', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), upload_1.uploadImage.single('image'), uploadController_1.uploadController.image);
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map