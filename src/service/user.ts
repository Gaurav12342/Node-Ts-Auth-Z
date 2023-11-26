import mongoose from "mongoose";
import {authUser} from '../models/user';


export const signUpService = async(data:any)=>{
    try {
        const createRes = await authUser.create(data);
        const response = await authUser.findById(createRes?._id).select("-password").exec();
        return response
    } catch (error) {
        return error
    }
}