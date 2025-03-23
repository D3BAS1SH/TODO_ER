import { Router } from "express";
import { registerUser, loginUser, logoutUser, haverefreshAccessToken, changeCurrentPassword, getCurrentUser,updateAccountDetails,updateAvatar,updateCoverImage } from '../controllers/user.controller.js';
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT,refreshTokenVerify } from "../middlewares/auth.middleware.js";

const ROUTER=Router()

ROUTER.route('/register').post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

ROUTER.route('/login').post(loginUser)

//Secure Routes
ROUTER.route('/logout').post(verifyJWT, logoutUser)
ROUTER.route('/refresh-token').post(refreshTokenVerify,haverefreshAccessToken)
ROUTER.route('/change-Password').post(verifyJWT,changeCurrentPassword)
ROUTER.route('/get-current-user').get(verifyJWT,getCurrentUser)
ROUTER.route('/update-account-detail').patch(verifyJWT,updateAccountDetails)
ROUTER.route('/update-avatar').patch(verifyJWT,upload.single("avatar"),updateAvatar)
ROUTER.route('/update-coverimage').patch(verifyJWT,upload.single("coverImage"),updateCoverImage)
export default ROUTER