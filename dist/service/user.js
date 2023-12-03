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
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInService = exports.signUpService = void 0;
const user_1 = require("../models/user");
const signUpService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isEmail = yield user_1.authUser.findOne({ email: data === null || data === void 0 ? void 0 : data.email }).exec();
        if (isEmail) {
            return "Email is already exists.";
        }
        const createRes = yield user_1.authUser.create(data);
        const response = yield user_1.authUser.findById(createRes === null || createRes === void 0 ? void 0 : createRes._id).select("-password").exec();
        return response;
    }
    catch (error) {
        return error;
    }
});
exports.signUpService = signUpService;
const signInService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = data;
    try {
        const response = yield user_1.authUser.findOne({ email }).exec();
        return response;
    }
    catch (error) {
        return error;
    }
});
exports.signInService = signInService;
