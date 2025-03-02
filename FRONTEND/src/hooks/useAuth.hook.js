import { useDispatch, useSelector } from "react-redux";
import {RegisterUser,LoginOut,LoginUser} from "../stores/auth.slice.js";

export const useAuth = () =>{
    const dispatch = useDispatch();
    const login = (credential) => dispatch(LoginUser(credential));
    const logout= () => dispatch(LoginOut());
    const register = (userData) => dispatch(RegisterUser(userData));

    return {
        login,
        logout,
        register
    }
}

export const useAuthIsAuthentic = () =>{
    const {isAuthenticated} = useSelector((state)=>state.auth);
    return {isAuthenticated};
}

export const useAuthIsLoading = () =>{
    const {loading} = useSelector((state)=>state.auth);
    return {loading};
}

export const useAuthError = () =>{
    const {error} = useSelector((state)=>state.auth);
    return {error};
}

export const useAuthUserData = () => {
    const {user} = useSelector((state)=>state.auth);
    return {user};
}