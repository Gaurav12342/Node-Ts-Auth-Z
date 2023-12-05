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
exports.userRefreshToken = exports.getUserDetail = exports.signUp = exports.signIn = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../service/user");
const user_2 = require("../models/user");
const generateToken_1 = require("../utils/generateToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refreshToken_1 = require("../utils/refreshToken");
const signIn = (req, res) => {
    const { email, password } = req === null || req === void 0 ? void 0 : req.body;
    if (!email) {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: "Please enter the email.",
        });
    }
    if (!password) {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: "Please enter the password.",
        });
    }
    const obj = {
        email,
        password,
    };
    (0, user_1.signInService)(obj)
        .then((response) => __awaiter(void 0, void 0, void 0, function* () {
        if (response) {
            const { accessToken, refreshToken } = yield (0, generateToken_1.generateToken)(password, response.password, response);
            return res.status(201).json({
                status: "OK",
                statusCode: 201,
                accessToken,
                refreshToken,
            });
        }
    }))
        .catch((error) => {
        return res.status(500).json({
            status: "error",
            statusCode: 500,
            error,
        });
    });
};
exports.signIn = signIn;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password: plainPassword } = req.body;
    if (!name) {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: "Please enter the name properly.",
        });
    }
    if (!email) {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: "Please enter the email.",
        });
    }
    if (!plainPassword) {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: "Please enter the password.",
        });
    }
    const hashPassword = yield bcrypt_1.default.hash(plainPassword, 10);
    const obj = {
        name,
        email,
        password: hashPassword,
    };
    const isEmail = yield user_2.authUser.findOne({ email }).exec();
    (0, user_1.signUpService)(obj)
        .then((result) => {
        if (isEmail) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                error: result,
            });
        }
        else {
            return res.status(201).json({
                status: "Created",
                statusCode: 201,
                message: "Created",
                data: result,
            });
        }
    })
        .catch((error) => {
        return res.status(500).json({
            status: "Server error",
            statusCode: 500,
            error,
        });
    });
});
exports.signUp = signUp;
const getUserDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userToken = (_a = req["headers"]["authorization"]) === null || _a === void 0 ? void 0 : _a.replace("Bearer", "").trim();
    const accessTokenKey = process.env.ACCESSTOKENKEY;
    if (accessTokenKey) {
        jsonwebtoken_1.default.verify(userToken, accessTokenKey, (err, detail) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    statusCode: 500,
                    err,
                });
            }
            return res.status(200).json({
                status: "OK",
                statusCode: 200,
                message: "User detail get successfully.",
                data: detail,
            });
        });
    }
});
exports.getUserDetail = getUserDetail;
const userRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userToken = (_b = req["headers"]["authorization"]) === null || _b === void 0 ? void 0 : _b.replace("Bearer", "").trim();
    const getAccessToken = yield (0, refreshToken_1.useRefreshToken)(userToken);
    if (!getAccessToken) {
        return res.status(500).json({
            status: "error",
            statusCode: 500,
            error: "Token is not verified.",
        });
    }
    return res.status(201).json({
        status: "OK",
        statusCode: 201,
        token: getAccessToken,
    });
});
exports.userRefreshToken = userRefreshToken;
