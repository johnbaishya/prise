"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccessResponse = exports.sendResponseWithMessage = exports.sendErrorResponse = void 0;
const sendErrorResponse = (res, error) => {
    res.status(500).send(error);
};
exports.sendErrorResponse = sendErrorResponse;
const sendResponseWithMessage = (res, status, message) => {
    res.status(status).json({ message });
};
exports.sendResponseWithMessage = sendResponseWithMessage;
const sendSuccessResponse = (res, data) => {
    res.status(200).json(data);
};
exports.sendSuccessResponse = sendSuccessResponse;
