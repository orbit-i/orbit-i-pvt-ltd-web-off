"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEO_CONTENT_ROLES = exports.SEO_MANAGER_ROLES = exports.CONTENT_EDITOR_ROLES = exports.ADMIN_ROLES = exports.ALL_ROLES = exports.ROLES = void 0;
exports.ROLES = {
    CLIENT: 'client',
    EDITOR: 'editor',
    SEO_MANAGER: 'seo_manager',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin',
};
exports.ALL_ROLES = Object.values(exports.ROLES);
exports.ADMIN_ROLES = [exports.ROLES.ADMIN, exports.ROLES.SUPER_ADMIN];
exports.CONTENT_EDITOR_ROLES = [exports.ROLES.EDITOR, exports.ROLES.ADMIN, exports.ROLES.SUPER_ADMIN];
exports.SEO_MANAGER_ROLES = [exports.ROLES.SEO_MANAGER, exports.ROLES.ADMIN, exports.ROLES.SUPER_ADMIN];
exports.SEO_CONTENT_ROLES = [exports.ROLES.EDITOR, exports.ROLES.SEO_MANAGER, exports.ROLES.ADMIN, exports.ROLES.SUPER_ADMIN];
//# sourceMappingURL=roles.js.map