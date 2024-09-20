import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {AddSubTodo} from "../controllers/subtodo.controlller.js";

const SubTodoRouter = Router()

//secure routes
SubTodoRouter.route('/add-subtodo/:todoId').post(verifyJWT,AddSubTodo);

export default SubTodoRouter