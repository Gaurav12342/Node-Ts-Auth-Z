import express,{ Express,Request,Response } from "express";

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