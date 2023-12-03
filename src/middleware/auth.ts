import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userToken: any = req["headers"]["authorization"]
    ?.replace("Bearer", "")
    .trim();
  try {
    const accessTokenKey: any = process.env.ACCESSTOKENKEY;
    const isToken = await jwt.verify(userToken, accessTokenKey);
    if (isToken) {
      next();
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      error,
    });
  }
};
