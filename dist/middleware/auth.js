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
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userToken = (_a = req["headers"]["authorization"]) === null || _a === void 0 ? void 0 : _a.replace("Bearer", "").trim();
    try {
        const accessTokenKey = process.env.ACCESSTOKENKEY;
        const isToken = yield jsonwebtoken_1.default.verify(userToken, accessTokenKey);
        if (isToken) {
            next();
        }
    }
    catch (error) {
        return res.status(500).json({
            status: "error",
            statusCode: 500,
            error,
        });
    }
});
exports.isAuth = isAuth;
