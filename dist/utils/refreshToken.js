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
exports.useRefreshToken = void 0;
const refreshToken_1 = require("../models/refreshToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const useRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isFindUserRefreshTokenData = yield refreshToken_1.RefreshToken.findOne({
            token,
        }).lean();
        const refreshTokenKey = process.env.REFRESHTOKENKEY;
        if (isFindUserRefreshTokenData) {
            const verifyRefreshToken = yield jsonwebtoken_1.default.verify(isFindUserRefreshTokenData === null || isFindUserRefreshTokenData === void 0 ? void 0 : isFindUserRefreshTokenData.token, refreshTokenKey);
            if (verifyRefreshToken) {
                const accessTokenKey = process.env.ACCESSTOKENKEY;
                const userData = yield user_1.authUser
                    .findOne({ _id: isFindUserRefreshTokenData === null || isFindUserRefreshTokenData === void 0 ? void 0 : isFindUserRefreshTokenData.userId })
                    .select({ password: 0 })
                    .lean();
                const accessToken = yield jsonwebtoken_1.default.sign(userData, accessTokenKey, {
                    expiresIn: 50,
                });
                return accessToken;
            }
        }
    }
    catch (error) {
        console.log("🚀 ~ file: refreshToken.ts:25 ~ useRefreshToken ~ error:", error);
        return error;
    }
});
exports.useRefreshToken = useRefreshToken;
