import express from "express";
import { signIn } from "../controller/user";

const router = express.Router();

router.post("/sign-in", signIn);

export default router;
