import { useSelector,useDispatch } from "react-redux";
import {

} from "../stores/subtodo.slice.js";

export const useSubTodo = () => {
    const dispatch = useDispatch();


    return {

    }
}

export const useSubTodoGetAllOf = (id) => {
    const {subtodos} = useSelector((state)=>state.subtodo);
    const requiredSubTodo = subtodos.find(item=>item._id === id);
    return { requiredSubTodo }
}