"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const refreshTokenModal = new mongoose_1.default.Schema({
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});
exports.RefreshToken = mongoose_1.default.model("Refresh-Token", refreshTokenModal);
