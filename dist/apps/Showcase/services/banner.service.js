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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShowcaseBannerImages = exports.addShowcaseBannerImages = void 0;
const company_service_1 = require("@/core/company/company.service");
const gallery_service_1 = require("@/core/gallery/gallery.service");
const gallery_types_1 = require("@/core/gallery/gallery.types");
// function to add banner images to a product after checking if the user is the owner of the company
const addShowcaseBannerImages = (companyID, userId, imageFiles) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, company_service_1.verifyCompanyOwnershipByCompanyId)(userId, companyID);
        const gallery = yield (0, gallery_service_1.addGalleryImages)(gallery_types_1.EntityType.ShowcaseBanner, companyID, imageFiles);
        return gallery;
    }
    catch (error) {
        throw error;
    }
});
exports.addShowcaseBannerImages = addShowcaseBannerImages;
const getShowcaseBannerImages = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gallery = yield (0, gallery_service_1.getGalleryImages)(gallery_types_1.EntityType.ShowcaseBanner, companyId);
        return gallery;
    }
    catch (error) {
        throw error;
    }
});
exports.getShowcaseBannerImages = getShowcaseBannerImages;
