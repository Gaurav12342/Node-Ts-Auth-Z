import express,{ Express,Request,Response } from "express";
import bcrypt from 'bcrypt';
import { signInService, signUpService } from "../service/user";
import { authUser } from "../models/user";
import jwt from 'jsonwebtoken';
import { RefreshToken } from "../models/refreshToken";

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
      if (res) {
        const isPasswordMatch = await bcrypt.compare(password, response.password);
        let newObj = { ...response };
        delete newObj?.password;
        if (Boolean(isPasswordMatch)) {
          const accessTokenKey: any = process.env.ACCESSTOKENKEY;
          const tokenGen = await jwt.sign(newObj, accessTokenKey, {
            expiresIn: 30,
          });

          const refreshTokenObj = {
            userId : response?._id,
            token: tokenGen
          }
          await RefreshToken.create(refreshTokenObj);
          return res.status(201).json({
            status: "OK",
            statusCode: 201,
            token : tokenGen
          });
        }
      }
    })
    .catch((error)=>{
      return res.status(500).json({
        status: "error",
        statusCode: 500,
        error
      });
    });
  };

export const signUp = async (req: Request, res: Response) => {
  const { name, email, password:plainPassword } = req.body;
  
  if(!name){
    return res.status(400).json({
      status: "error",
      statusCode:400,
      message : "Please enter the name properly."
    });
  }

  if(!email){
    return res.status(400).json({
      status: "error",
      statusCode:400,
      message : "Please enter the email."
    });
  }

  if(!plainPassword){
    return res.status(400).json({
      status: "error",
      statusCode:400,
      message : "Please enter the password."
    });
  }

  const hashPassword = await bcrypt.hash(plainPassword, 10);

  const obj = {
    name,
    email,
    password: hashPassword,
  };
  const isEmail = await authUser.findOne({email}).exec();
  
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

export const getUserDetail = async(req: Request, res: Response)=>{
  const userToken = req['headers']['authorization']?.replace("Bearer","").trim();
  const isCheckToken = RefreshToken.findOne();
  console.log("Result body",userToken)


}