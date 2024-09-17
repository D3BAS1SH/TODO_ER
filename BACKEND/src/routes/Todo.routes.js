import { Router } from 'express';
import { CreateTodo, UpdateTodo, getAllTodo } from '../controllers/todo.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const TodoRouter = Router()

//Secure Routes
TodoRouter.route('/create-todo').post(verifyJWT,CreateTodo)
TodoRouter.route('/update-todo/:id').patch(verifyJWT,UpdateTodo)
TodoRouter.route('/get-all-todo').get(verifyJWT,getAllTodo)

export default TodoRouter