"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = exports.signIn = void 0;
const signIn = (req, res) => {
    const { name, email, password } = req === null || req === void 0 ? void 0 : req.body;
    if (!name) {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: "Please enter the name properly."
        });
    }
    if (!email) {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: "Please enter the email."
        });
    }
    if (!password) {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: "Please enter the password."
        });
    }
    return res.status(201).json({
        status: "OK",
        statusCode: 201,
        message: "Success.",
    });
};
exports.signIn = signIn;
const signUp = (req, res) => {
    const { name, email, password } = req.body;
    console.log("🚀 ~ file: user.ts:38 ~ signUp ~ name,email,password:", name, email, password);
};
exports.signUp = signUp;
