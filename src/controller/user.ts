import express,{ Express,Request,Response } from "express";
import bcrypt from 'bcrypt';
import { signUpService } from "../service/user";
import { authUser } from "../models/user";

export const signIn = (req:Request,res:Response)=>{
  const { name, email, password } = req?.body;
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

  if(!password){
    return res.status(400).json({
      status: "error",
      statusCode:400,
      message : "Please enter the password."
    });
  }

  
  return res.status(201).json({
      status: "OK",
      statusCode:201,
      message : "Success.",
    });
}

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