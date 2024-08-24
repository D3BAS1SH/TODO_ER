import { ApiError } from "../utils/ApiError.js"
import {asynHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"

export const verifyJWT = asynHandler(async(req,res,next)=>{
    try {
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
        throw new ApiError(401,error?.message || "invalid access token.")
    }

})