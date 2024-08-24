import { Router } from "express";
import { registerUser, loginUser, logoutUser, haverefreshAccessToken } from '../controllers/user.controller.js';
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

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
ROUTER.route('/refresh-token').post(haverefreshAccessToken)
export default ROUTER