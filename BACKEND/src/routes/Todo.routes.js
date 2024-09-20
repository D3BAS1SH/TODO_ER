import { Router } from 'express';
import { CreateTodo, UpdateTodo, getAllTodo, getTodoById, deleteTodo } from '../controllers/todo.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const TodoRouter = Router()

//Secure Routes
TodoRouter.route('/create-todo').post(verifyJWT,CreateTodo)
TodoRouter.route('/update-todo/:id').patch(verifyJWT,UpdateTodo)
TodoRouter.route('/get-all-todo').get(verifyJWT,getAllTodo)
TodoRouter.route('/get-a-todo/:id').get(verifyJWT,getTodoById)
TodoRouter.route('/delete-a-todo/:id').delete(verifyJWT,deleteTodo)

export default TodoRouter