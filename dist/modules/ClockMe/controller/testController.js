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
exports.test1 = void 0;
const test1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let file = await uploadImage.single("image");
        let file = req.file;
        res.status(200).json(file);
        // console.log(file)
    }
    catch (error) {
        console.log("error from test 1", error);
    }
});
exports.test1 = test1;