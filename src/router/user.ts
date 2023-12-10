import express from "express";
import { getUserDetail, googleAuthCallback, googleOAuth, signIn, signUp, userRefreshToken } from "../controller/user";
import { isAuth } from "../middleware/auth";

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);
router.get("/user-detail", isAuth, getUserDetail);
router.get("/refresh-token", userRefreshToken);
router.get("/auth", googleOAuth);
router.get("/api/callback", googleAuthCallback);

export default router;
