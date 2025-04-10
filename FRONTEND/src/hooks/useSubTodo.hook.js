import { useSelector,useDispatch } from "react-redux";
import {
    createSubTodoThunk,
    deleteSubTodoThunk,
    toggleSubTodoThunk
} from "../stores/subtodo.slice.js";

export const useSubTodo = () => {
    const dispatch = useDispatch();
    const createSubTodoDispatcher = (subTodoDoc) => dispatch(createSubTodoThunk(subTodoDoc));
    const deleteSubTodoDispatcher = (subTodoDoc) => dispatch(deleteSubTodoThunk(subTodoDoc));
    const toggleSubTodoDispatcher = (subTodoId) => dispatch(toggleSubTodoThunk(subTodoId));

    return {
        createSubTodoDispatcher,
        deleteSubTodoDispatcher,
        toggleSubTodoDispatcher
    }
}

export const useSubTodoGetAllOf = (id) => {
    const {subtodos} = useSelector((state)=>state.subtodo);
    const requiredSubTodo = subtodos.find(item=>item._id === id);
    return { requiredSubTodo }
}

export const useSubTodoLoading = () => {
    const { loading } = useSelector((state)=>state.subtodo);
    return { loading };
}

export const useSubTodoError = () => {
    const { error } = useSelector((state)=>state.error);
    return { error };
}