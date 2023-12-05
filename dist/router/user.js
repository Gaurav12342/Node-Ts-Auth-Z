"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/sign-in", user_1.signIn);
router.post("/sign-up", user_1.signUp);
router.get("/user-detail", auth_1.isAuth, user_1.getUserDetail);
router.get("/refresh-token", user_1.userRefreshToken);
exports.default = router;
