"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEachGalleryImage = exports.deleteMultipleGalleryImagesByEntityId = exports.deleteMultipleGalleryImages = exports.deleteGalleryImage = exports.deleteGalleryImageAfterUserVerification = exports.getGalleryImages = exports.addGalleryImages = void 0;
const gallery_types_1 = require("./gallery.types");
const gallery_model_1 = __importDefault(require("./gallery.model"));
const ImageHandler_1 = require("@/core/gallery/ImageHandler");
const product_service_1 = require("@/apps/Showcase/services/product.service");
const company_service_1 = require("../company/company.service");
const errorHandler_1 = __importDefault(require("@/libs/errorHandler"));
const addGalleryImages = (entity, entityId, files) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!files) {
            files = [];
        }
        // checking if files are in other format rather than array.
        if (!Array.isArray(files)) {
            files = [];
        }
        let galleriesBody = files.map((item) => {
            return {
                entityType: entity,
                entityId: entityId,
                key: item.key,
                location: item.location,
                bucket: item.bucket,
                acl: item.acl
            };
        });
        let gallery = yield gallery_model_1.default.create(galleriesBody);
        return gallery;
    }
    catch (error) {
        console.log("error from add gallery image", error);
        throw error;
    }
});
exports.addGalleryImages = addGalleryImages;
const getGalleryImages = (entity, entityId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let galleries = yield gallery_model_1.default.find({ entityType: entity, entityId: entityId });
        return galleries;
    }
    catch (error) {
        console.log("error from get gallery images", error);
        throw error;
    }
});
exports.getGalleryImages = getGalleryImages;
// function to delete gallery image after checking if the user is eligible to delete the image.
const deleteGalleryImageAfterUserVerification = (galleryId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let gallery = yield gallery_model_1.default.findById(galleryId);
        if (!gallery) {
            throw new errorHandler_1.default("Gallery image not found", 404);
        }
        let key = gallery === null || gallery === void 0 ? void 0 : gallery.key;
        const entityId = gallery === null || gallery === void 0 ? void 0 : gallery.entityId.toString();
        // check if user is the authorized to delete the image by checking the ownership of the product or company or whatever entity the gallery image is associated with. we can do this by checking the entity type and then checking the ownership of that entity. for example if the entity type is product then we will check the ownership of the product by checking the product's company and then checking the ownership of that company. if the entity type is company then we will check the ownership of the company directly. if the entity type is something else then we will throw an error saying that we don't support this entity type for gallery images.
        switch (gallery.entityType) {
            case gallery_types_1.EntityType.Product:
                yield (0, product_service_1.verifyProductOwnership)(entityId, userId);
                break;
            case gallery_types_1.EntityType.Company:
                yield (0, company_service_1.verifyCompanyOwnershipByCompanyId)(userId, entityId);
                break;
            default:
                throw new Error("We don't support this entity type for gallery images");
        }
        // first delete the image from s3 then delete the gallery document from database
        yield (0, ImageHandler_1.deleteS3Image)(key);
        yield gallery_model_1.default.findByIdAndDelete(galleryId);
        return true;
    }
    catch (error) {
        throw new errorHandler_1.default(error.message, error.status || 500);
    }
});
exports.deleteGalleryImageAfterUserVerification = deleteGalleryImageAfterUserVerification;
// delete gallery image by gallery id without user verification. this function will be used in the scenario where we want to delete all the images of a product when we delete that product from the database. in that case we don't need to check the ownership of the product because if we are deleting the product then we can assume that we have the ownership of that product.
const deleteGalleryImage = (galleryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let gallery = yield gallery_model_1.default.findById(galleryId);
        if (!gallery) {
            throw new errorHandler_1.default("Gallery image not found", 404);
        }
        let key = gallery === null || gallery === void 0 ? void 0 : gallery.key;
        // first delete the image from s3 then delete the gallery document from database
        yield (0, ImageHandler_1.deleteS3Image)(key);
        yield gallery_model_1.default.findByIdAndDelete(galleryId);
        return true;
    }
    catch (error) {
        throw new errorHandler_1.default(error.message, error.status || 500);
    }
});
exports.deleteGalleryImage = deleteGalleryImage;
// function to delete multiple gallery images by passing an array of gallery ids and then we will delete the images from s3 and then we will delete the gallery documents from database.
const deleteMultipleGalleryImages = (galleryIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
    }
});
exports.deleteMultipleGalleryImages = deleteMultipleGalleryImages;
// function to delete multiple gallery images by entity id without user verification. this function will be used in the scenario where we want to delete all the images of a product when we delete that product from the database. in that case we don't need to check the ownership of the product because if we are deleting the product then we can assume that we have the ownership of that product.
const deleteMultipleGalleryImagesByEntityId = (entity, entityId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let galleries = yield gallery_model_1.default.find({ entityType: entity, entityId: entityId });
        let keys = galleries.map(gallery => gallery.key);
        yield (0, ImageHandler_1.deleteMultipleS3Images)(keys);
        yield gallery_model_1.default.deleteMany({ entityType: entity, entityId: entityId });
    }
    catch (error) {
        throw new errorHandler_1.default(error.message, error.status || 500);
    }
});
exports.deleteMultipleGalleryImagesByEntityId = deleteMultipleGalleryImagesByEntityId;
const getEachGalleryImage = (galleryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let gallery = yield gallery_model_1.default.findById(galleryId);
        return gallery;
    }
    catch (error) {
        console.log("error from get each gallery image", error);
        throw error;
    }
});
exports.getEachGalleryImage = getEachGalleryImage;
