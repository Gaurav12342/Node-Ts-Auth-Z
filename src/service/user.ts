import mongoose from "mongoose";
import {authUser} from '../models/user';


export const signUpService = async (data: any) => {
  try {
    const isEmail = await authUser.findOne({ email: data?.email }).exec();
    if (isEmail) {
      return "Email is already exists.";
    }
    const createRes = await authUser.create(data);
    const response = await authUser
      .findById(createRes?._id)
      .select("-password")
      .exec();
    return response;
  } catch (error) {
    return error;
  }
};

export const signInService = async (data: any) => {
  const { email } = data;
  try {
    const response = await authUser.findOne({ email }).lean();
    return response;
  } catch (error) {
    return error;
  }
};