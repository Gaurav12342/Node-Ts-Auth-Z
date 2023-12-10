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
exports.googleAuthCallback = exports.googleOAuth = exports.userRefreshToken = exports.getUserDetail = exports.signUp = exports.signIn = void 0;
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
        jsonwebtoken_1.default.verify(userToken, accessTokenKey, (err, detail) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    statusCode: 500,
                    err,
                });
            }
            const response = yield user_2.authUser
                .findOne({ _id: detail === null || detail === void 0 ? void 0 : detail._id })
                .select({ password: 0 });
            return res.status(200).json({
                status: "OK",
                statusCode: 200,
                message: "User detail get successfully.",
                data: response,
            });
        }));
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
const googleOAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client_id = process.env.CLIENT_ID;
        const redirect_url = process.env.REDIRECT_URI;
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_url}&response_type=code&scope=profile email`;
        res.redirect(url);
    }
    catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
});
exports.googleOAuth = googleOAuth;
const googleAuthCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    try {
        // Exchange authorization code for access token
        const requestObj = {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code',
        };
        yield fetch("<https://oauth2.googleapis.com/token>", {
            method: "post",
            body: requestObj,
        })
            .then((data) => data.json())
            .then((data) => __awaiter(void 0, void 0, void 0, function* () {
            const { access_token, id_token } = data;
            // Use access_token or id_token to fetch user profile
            yield fetch("<https://www.googleapis.com/oauth2/v1/userinfo>", {
                method: "post",
                headers: { Authorization: `Bearer ${access_token}` },
            })
                .then((profile) => profile.json())
                .then((profile) => {
                res.redirect("/");
            })
                .catch((error) => {
                console.error("Error:", error.response.data.error);
                res.redirect("/user/sign-in");
            });
        }))
            .catch();
        // Code to handle user authentication and retrieval using the profile data
        res.redirect('/');
    }
    catch (error) {
        console.error('Error:', error.response.data.error);
        res.redirect('/user/sign-in');
    }
});
exports.googleAuthCallback = googleAuthCallback;
// router.get('/auth/google', (req, res) => {
//   const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
//   res.redirect(url);
// });
