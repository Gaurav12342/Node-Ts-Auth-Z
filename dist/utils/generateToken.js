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
exports.generateToken = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refreshToken_1 = require("../models/refreshToken");
const generateToken = (password, hashPassword, userDetail) => __awaiter(void 0, void 0, void 0, function* () {
    const isPasswordMatch = yield bcrypt_1.default.compare(password, hashPassword);
    let newObj = Object.assign({}, userDetail);
    newObj === null || newObj === void 0 ? true : delete newObj.password;
    if (Boolean(isPasswordMatch)) {
        const accessTokenKey = process.env.ACCESSTOKENKEY;
        const accessToken = yield jsonwebtoken_1.default.sign(newObj, accessTokenKey, {
            expiresIn: 30,
        });
        const refreshTokenKey = process.env.REFRESHTOKENKEY;
        const refreshToken = yield jsonwebtoken_1.default.sign(newObj, refreshTokenKey, {
            expiresIn: "365d",
        });
        const refreshTokenObj = {
            userId: userDetail === null || userDetail === void 0 ? void 0 : userDetail._id,
            token: refreshToken,
        };
        yield refreshToken_1.RefreshToken.create(refreshTokenObj);
        return {
            accessToken,
            refreshToken,
        };
    }
});
exports.generateToken = generateToken;
