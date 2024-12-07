import express from "express"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import corsConfig from "./utils/cors.config.js"

const APP=express()

APP.use(cors(corsConfig));

APP.use(express.json({limit:"16kb"}))
APP.use(express.urlencoded({extended:true,limit:"16kb"}))
APP.use(express.static("public"))
APP.use(cookieParser())

//Routes Importing
import userRouter from './routes/User.routes.js';
import TodoRouter from "./routes/Todo.routes.js";
import SubTodoRouter from "./routes/SubTodo.routes.js"

//Route Declaration
APP.use('/api/v1/users',userRouter)
APP.use('/api/v1/todos',TodoRouter)
APP.use('/api/v1/subtodos',SubTodoRouter)
export {APP}