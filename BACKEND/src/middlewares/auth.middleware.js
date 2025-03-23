import { ApiError } from "../utils/ApiError.js"
import {asynHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"

export const verifyJWT = asynHandler(async(req,res,next)=>{
    try {
        console.log("Verification middleware")
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")        
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }

        const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const Obtaineduser = await User.findById(decodedToken?._id).select("-password -refreshToken")        

        if(!Obtaineduser){
            throw new ApiError(401,"Invalid Access Token")
        }

        req.user = Obtaineduser;
        next()
        
    } catch (error) {
        console.log("AccessToken error Log");
        console.log(error);
        throw new ApiError(401,error?.message || "invalid access token.")
    }

})

export const refreshTokenVerify = asynHandler(async (req,res,next)=>{
    try {
        const incomingRefreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ","");
        
        if(!incomingRefreshToken){
            throw new ApiError(401,"No token found.");
        }

        const decodedRefreshToken = await jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
        const Obtaineduser = await User.findById(decodedRefreshToken?._id).select('-password');
        
        if(incomingRefreshToken!==Obtaineduser?.refreshToken){
            throw new ApiError(401,"Invalid RefreshToken ");
        }

        req.user = Obtaineduser;
        next()

    } catch (error) {
        console.log("Logging Error");
        console.log(error);
        throw new ApiError(401,error?.message || "Verification Error")
    }
})