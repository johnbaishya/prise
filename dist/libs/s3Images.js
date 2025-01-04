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
exports.deleteS3Image = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3Config_1 = __importDefault(require("../config/s3Config"));
const deleteS3Image = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME, // Bucket name
            Key: key
        };
        const deleteCommand = new client_s3_1.DeleteObjectCommand(params);
        const response = yield s3Config_1.default.send(deleteCommand);
        return response;
    }
    catch (error) {
        console.log("error from delete image", error);
    }
});
exports.deleteS3Image = deleteS3Image;
