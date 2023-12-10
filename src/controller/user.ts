import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { signInService, signUpService } from "../service/user";
import { authUser } from "../models/user";
import { RefreshToken } from "../models/refreshToken";
import { generateToken } from "../utils/generateToken";
import jwt from 'jsonwebtoken';
import { useRefreshToken } from "../utils/refreshToken";
import { request_get_auth_code_url } from "../utils/o-auth";

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
      ,accessTokenKey,async(err:any,detail:any) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            statusCode: 500,
            err,
          });
        }
        const response = await authUser
          .findOne({ _id: detail?._id })
          .select({ password: 0 });
        return res.status(200).json({
          status: "OK",
          statusCode: 200,
          message: "User detail get successfully.",
          data: response,
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

export const googleOAuth = async (req: Request, res: Response) => {
  try {
    const client_id = process.env.CLIENT_ID
    const redirect_url = process.env.REDIRECT_URI
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_url}&response_type=code&scope=profile email`;
    res.redirect (url);
  } catch (error) {
    res.sendStatus (500);
    console.log (error);
  }
}

export const googleAuthCallback =async (req: Request, res: Response)=>{
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    const requestObj: any ={
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    }
    await fetch("https://oauth2.googleapis.com/token", {
      method: "post",
      body: requestObj,
    })
      .then(async(data: any) => await data.json())
      .then(async (data: any) => {
        
        const { access_token, id_token } = data;
        console.log("🚀 ~ file: user.ts:201 ~ .then ~ data:", data)

        // Use access_token or id_token to fetch user profile
        await fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
          method: "post",
          headers: { Authorization: `Bearer ${access_token}` },
        })
          .then((profile: any) => profile.json())
          .then((profile: any) => {
            console.log("🚀 ~ file: user.ts:209 ~ .then ~ profile:", profile)
            res.redirect("/");
          })
          .catch((error: any) => {
            console.error("Error:", error);
            res.redirect("http://localhost:3002/user/sign-in");
          });
      })
      .catch();
    // Code to handle user authentication and retrieval using the profile data

    res.redirect('/');
  } catch (error:any) {
    console.error('Error:', error);
    res.redirect('/user/sign-in');
  }
}

// router.get('/auth/google', (req, res) => {
//   const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
//   res.redirect(url);
// });
