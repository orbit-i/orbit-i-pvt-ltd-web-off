"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const cloudinary_1 = require("../config/cloudinary");
exports.uploadController = {
    image: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.file)
            throw ApiError_1.ApiError.badRequest('Select an image to upload');
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                if (error) {
                    console.error('[Cloudinary Upload Error]', error);
                    reject(ApiError_1.ApiError.internal(`Failed to upload image: ${error.message}`));
                }
                else if (result) {
                    resolve((0, ApiResponse_1.sendSuccess)(res, 201, 'Image uploaded', { url: result.secure_url }));
                }
            });
            uploadStream.end(req.file.buffer);
        });
    }),
};
//# sourceMappingURL=uploadController.js.map