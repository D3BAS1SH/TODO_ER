import { useDispatch, useSelector } from "react-redux";
import {RegisterUser,LoginOut,LoginUser} from "../stores/auth.slice.js";

export const useAuth = () =>{
    const dispatch = useDispatch();
    const {user,isAuthenticated,loading,error} = useSelector((state)=>state.auth);

    const login = (credential) => dispatch(LoginUser(credential));
    const logout= () => dispatch(LoginOut());
    const register = (userData) => dispatch(RegisterUser(userData));

    return {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        register
    }
}