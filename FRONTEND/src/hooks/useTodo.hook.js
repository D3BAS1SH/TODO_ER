import { useSelector,useDispatch } from "react-redux";
import {
    createTodoThunk,
    getAllTodoThunk,
    deleteTodoThunk,
    updateTodoThunk,
    selectTodo
} from "../stores/todo.slice.js";

export const useTodo = () => {
    const dispatch = useDispatch();
    const createTodoDispatcher = (TodoObject) => dispatch(createTodoThunk(TodoObject));
    const getAllTodoDispatcher = (ParamValue) => dispatch(getAllTodoThunk(ParamValue));
    const deleteTodoDispatcher = (id) => dispatch(deleteTodoThunk(id));
    const updateTodoDispatcher = (updateInfo) => dispatch(updateTodoThunk(updateInfo));
    const selectTodoDispatcher = (todoId) => dispatch(selectTodo(todoId));

    return {
        createTodoDispatcher,
        getAllTodoDispatcher,
        deleteTodoDispatcher,
        updateTodoDispatcher,
        selectTodoDispatcher
    }
}

export const useTodoAllTodo = () => {
    const {todos} = useSelector((state)=>state.todo);
    return {todos};
}

export const useTodoLoading = () => {
    const {loading} = useSelector((state)=>state.todo);
    return {loading}
}

export const useTodoError = () => {
    const {error} = useSelector((state)=>state.todo);
    return {error}
}

export const useTodoSelectedTodo = () => {
    const {selectedTodo} = useSelector((state)=>state.todo);
    return {selectedTodo}
}