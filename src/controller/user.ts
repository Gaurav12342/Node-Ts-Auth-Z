import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { signInService, signUpService } from "../service/user";
import { authUser } from "../models/user";
import { RefreshToken } from "../models/refreshToken";
import { generateToken } from "../utils/generateToken";
import jwt from 'jsonwebtoken';
import { useRefreshToken } from "../utils/refreshToken";

export const signIn = (req: Request, res: Response) => {
  const { email, password } = req?.body;
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
  signInService(obj)
    .then(async (response: any) => {
      if (response) {
        const { accessToken, refreshToken }: any = await generateToken(
          password,
          response.password,
          response
        );

        return res.status(201).json({
          status: "OK",
          statusCode: 201,
          accessToken,
          refreshToken,
        });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        status: "error",
        statusCode: 500,
        error,
      });
    });
};

export const signUp = async (req: Request, res: Response) => {
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

  const hashPassword = await bcrypt.hash(plainPassword, 10);

  const obj = {
    name,
    email,
    password: hashPassword,
  };
  const isEmail = await authUser.findOne({ email }).exec();

  signUpService(obj)
    .then((result) => {
      if (isEmail) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          error: result,
        });
      } else {
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
};

export const getUserDetail = async (req: Request, res: Response) => {
  const userToken: any = req["headers"]["authorization"]
  ?.replace("Bearer", "")
  .trim();
  const accessTokenKey: any = process.env.ACCESSTOKENKEY;
  if(accessTokenKey){
    jwt.verify(userToken
      ,accessTokenKey,(err:any,detail:any)=>{
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
};

export const userRefreshToken = async (req: Request, res: Response) => {
  const userToken: any = req["headers"]["authorization"]
    ?.replace("Bearer", "")
    .trim();
  const getAccessToken = await useRefreshToken(userToken);
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
};
