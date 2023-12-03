"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const router = express_1.default.Router();
router.post("/sign-in", user_1.signIn);
router.post("/sign-up", user_1.signUp);
router.get("/user-detail", user_1.getUserDetail);
exports.default = router;
