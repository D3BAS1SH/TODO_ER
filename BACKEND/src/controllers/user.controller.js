import {asynHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import jwt from "jsonwebtoken"

const generateAccessNRefreshToken = async(userID)=>{
    try {
        const user_ = await User.findById(userID);
        const AccessToken = user_.generateAccessToken();
        const RefreshToken = user_.generateRefreshToken();

        user_.refreshToken = RefreshToken;
        await user_.save({validateBeforeSave:false});

        return {AccessToken,RefreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong.")
    }
}

const registerUser = asynHandler(async(req,res)=>{

    //console.log(req);

    //getting fields from Form
    const {username, email, fullname, password} = req.body;
    
    //Checking if there is some empty fields.
    if(
        [username,email,fullname,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"Some fields are empty")
    }

    //check if the user exists akready.
    const existedUser = await User.findOne({
        $or:[{ username },{ email }]
    })
    console.log(existedUser);

    if(existedUser){
        throw new ApiError(409,"User with email or username already exists.")
    }

    //check if the cover image and avatar obtained.
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverLocalPath = req.files?.coverImage[0]?.path;
    }
    
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }

    const AvatarResponse = await uploadOnCloudinary(avatarLocalPath);
    const CoverImageResponse = await uploadOnCloudinary(coverLocalPath);

    if(!AvatarResponse){
        throw new ApiError(400,"Avatar upload error");
    }

    //console.log(AvatarResponse);
    
    const UserRes = await User.create({
        fullname,
        email,
        username,
        avatar:AvatarResponse.url,
        coverImage:CoverImageResponse?.url || "",
        password
    })

    const CreatedUser = await User.findById(UserRes._id).select("-password -refreshToken")

    if(!CreatedUser){
        throw new ApiError(500,"Server failed the request")
    }

    return res.status(200).json(new ApiResponse(200,CreatedUser,"User registered Successfully."))
})

const loginUser = asynHandler(async(req,res)=>{
    const {username,email,password} = req.body;

    if(!(username || email)){
        throw new ApiError(400,"Username or email is required.")
    }

    const myUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(!myUser){
        throw new ApiError(404,"User doesn't exists.")
    }

    const PasswordValidation = await myUser.isPasswordCorrect(password);

    if(!PasswordValidation){
        throw new ApiError(401,"Invalid user credential.")
    }

    const {AccessToken,RefreshToken} = await generateAccessNRefreshToken(myUser._id)

    const loggedInUser = await User.findById(myUser._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200).cookie("accessToken",AccessToken,options).cookie("refreshToken",RefreshToken,options).json(new ApiResponse(200,{user : loggedInUser,AccessToken,RefreshToken}))

})

const logoutUser = asynHandler(async(req,res)=>{
    
    await User.findByIdAndUpdate(req.user._id,{
        $set:{ refreshToken : 1}
    },{new:true})

    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"User Logged out"))
})

const haverefreshAccessToken = asynHandler( async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized Request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired")
        }
    
        const options={
            httpOnly:true,
            secure:true
        }
    
        const {AccessToken,RefreshToken} = await generateAccessNRefreshToken(user._id)
    
        return res.status(200).cookie("accessToken",AccessToken,options).cookie("refreshToken",RefreshToken,options).json(new ApiResponse(200,{AccessToken,RefreshToken},"Successfully refreshed tokens."))
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid RefreshToken")
    }
})

const changeCurrentPassword= asynHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body;

    const theUser = await User.findById(req.user?._id)
    const isPassOk = await theUser.isPasswordCorrect(oldPassword)
    if(!isPassOk){
        throw new ApiError(403,"Incorrect OldPassword")
    }

    theUser.password=newPassword
    await theUser.save({validateBeforeSave:false})

    return res.status(202).json(
        new ApiResponse(202,{},"Password Changed successfully.")
    )
    
})

const getCurrentUser = asynHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,req.user,"Current user fetchd successfully."))
})

const updateAccountDetails = asynHandler(async(req,res)=>{
    const {fullname,email} = req.body

    if(!fullname || !email){
        throw new ApiError(400,"Not enough information provided.")
    }

    const newuser = await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                fullname,
                email
            }
        },
        {new:true}
    ).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(200,newuser,"User Updated successfully.")
    )

})

const updateAvatar = asynHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file not found.")
    }

    const avatarRes = await uploadOnCloudinary(avatarLocalPath)

    if(!avatarRes.url){
        throw new ApiError(400,"Error while uploading the avatar.")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {$set:{avatar:avatarRes.url}},{new:true}
    ).select("-password -refreshToken")

    return res.status(200).json(new ApiResponse(200,{user},"updated avatar successfully"))
})

const updateCoverImage = asynHandler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400,"CoverImage file not found.")
    }

    const BgRes = await uploadOnCloudinary(coverImageLocalPath)

    if(!BgRes.url){
        throw new ApiError(400,"Error while uploading the CoveImage.")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {$set:{coverImage:BgRes.url}},{new:true}
    ).select("-password -refreshToken")

    return res.status(200).json(new ApiResponse(200,{},"updated avatar successfully"))
})


export {registerUser,loginUser,logoutUser,haverefreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateAvatar,updateCoverImage}