"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testFunction = void 0;
const testFunction = (req, res) => {
    res.status(200).json({ message: "welcome to prise" });
};
exports.testFunction = testFunction;
