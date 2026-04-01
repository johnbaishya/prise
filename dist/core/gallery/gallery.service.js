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
exports.getEachGalleryImage = exports.deleteGalleryImage = exports.getGalleryImages = exports.addGalleryImages = void 0;
const gallery_model_1 = __importDefault(require("./gallery.model"));
const ImageHandler_1 = require("@/services/ImageHandler");
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
                entity_name: entity,
                record_id: entityId,
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
        let galleries = yield gallery_model_1.default.find({ entity_name: entity, record_id: entityId });
        return galleries;
    }
    catch (error) {
        console.log("error from get gallery images", error);
        throw error;
    }
});
exports.getGalleryImages = getGalleryImages;
const deleteGalleryImage = (galleryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let gallery = yield gallery_model_1.default.findById(galleryId);
        if (!gallery) {
            throw new Error("Gallery image not found");
        }
        let key = gallery === null || gallery === void 0 ? void 0 : gallery.key;
        // first delete the image from s3 then delete the gallery document from database
        yield (0, ImageHandler_1.deleteS3Image)(key);
        yield gallery_model_1.default.findByIdAndDelete(galleryId);
        return true;
    }
    catch (error) {
        console.log("error from delete gallery image", error);
        throw error;
    }
});
exports.deleteGalleryImage = deleteGalleryImage;
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
