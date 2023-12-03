import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/refreshToken";

export const generateToken = async (
  password: any,
  hashPassword: any,
  userDetail: any
) => {
  const isPasswordMatch = await bcrypt.compare(password, hashPassword);
  let newObj = { ...userDetail };
  delete newObj?.password;
  if (Boolean(isPasswordMatch)) {
    const accessTokenKey: any = process.env.ACCESSTOKENKEY;
    const accessToken = await jwt.sign(newObj, accessTokenKey, {
      expiresIn: 30,
    });
    const refreshTokenKey: any = process.env.REFRESHTOKENKEY;
    const refreshToken = await jwt.sign(newObj, refreshTokenKey, {
      expiresIn: "365d",
    });
    const refreshTokenObj = {
      userId: userDetail?._id,
      token: refreshToken,
    };
    await RefreshToken.create(refreshTokenObj);
    return {
      accessToken,
      refreshToken,
    };
  }
};
