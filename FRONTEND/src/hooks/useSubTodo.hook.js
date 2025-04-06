import { useSelector,useDispatch } from "react-redux";
import {
    createSubTodoThunk
} from "../stores/subtodo.slice.js";

export const useSubTodo = () => {
    const dispatch = useDispatch();
    const createSubTodoDispatcher = (subTodoDoc) => dispatch(createSubTodoThunk(subTodoDoc))

    return {
        createSubTodoDispatcher
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