import express from "express";
import { getUserDetail, signIn, signUp } from "../controller/user";

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);
router.get("/user-detail", getUserDetail);

export default router;
