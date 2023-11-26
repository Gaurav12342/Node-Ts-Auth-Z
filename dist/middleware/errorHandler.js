"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    const statusCode = (res === null || res === void 0 ? void 0 : res.statusCode) ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null
    });
};
exports.default = errorHandler;
