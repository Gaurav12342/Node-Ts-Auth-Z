"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userModal = new mongoose_1.default.Schema({
    name: { required: [true, "Please enter the user name"], type: String },
    email: {
        required: [true, "Please enter the email address"],
        type: String,
        unique: true,
        trim: true,
    },
    password: { required: [true, "Please enter the password"], type: String },
}, { collection: "auth-user", timestamps: true, minimize: false });
exports.authUser = mongoose_1.default.model("Auth-User", userModal);
// module.exports = authUser;
