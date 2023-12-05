import { RefreshToken } from "../models/refreshToken";
import jwt from "jsonwebtoken";
import { authUser } from "../models/user";

export const useRefreshToken = async (token: any) => {
  try {
    const isFindUserRefreshTokenData: any = await RefreshToken.findOne({
      token,
    }).lean();
    const refreshTokenKey: any = process.env.REFRESHTOKENKEY;

    if (isFindUserRefreshTokenData) {
      const verifyRefreshToken = await jwt.verify(
        isFindUserRefreshTokenData?.token,
        refreshTokenKey
      );
      if (verifyRefreshToken) {
        const accessTokenKey: any = process.env.ACCESSTOKENKEY;
        const userData:any = await authUser
          .findOne({ _id: isFindUserRefreshTokenData?.userId })
          .select({ password: 0 })
          .lean();
        const accessToken = await jwt.sign(
        userData,
          accessTokenKey,
          {
            expiresIn: 50,
          }
        );
        return accessToken
      }
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: refreshToken.ts:25 ~ useRefreshToken ~ error:",
      error
    );
    return error;
  }
};
