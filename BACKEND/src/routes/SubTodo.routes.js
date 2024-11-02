import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {AddSubTodo,DeleteSubtodo,UpdateSubTodo,BatchAddSubtodos} from "../controllers/subtodo.controlller.js";

const SubTodoRouter = Router()

//secure routes
SubTodoRouter.route('/add-batch-subtodo/:todoId').post(verifyJWT,BatchAddSubtodos);
SubTodoRouter.route('/add-subtodo/:todoId').post(verifyJWT,AddSubTodo);
SubTodoRouter.route('/update-subtodo/:subtodoid').patch(verifyJWT,UpdateSubTodo);
SubTodoRouter.route('/delete-subtodo/:subtodoid').delete(verifyJWT,DeleteSubtodo);

export default SubTodoRouter