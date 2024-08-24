import express from "express"
import cookieParser from 'cookie-parser'
import cors from 'cors'

const APP=express()

APP.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

APP.use(express.json({limit:"16kb"}))
APP.use(express.urlencoded({extended:true,limit:"16kb"}))
APP.use(express.static("public"))
APP.use(cookieParser())

//Routes Importing
import userRouter from './routes/User.routes.js'

//Route Declaration
APP.use('/api/v1/users',userRouter)

export {APP}