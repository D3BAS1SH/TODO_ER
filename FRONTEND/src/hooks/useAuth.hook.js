import { useDispatch, useSelector } from "react-redux";
import {RegisterUser,LoginOut,LoginUser,GetCurrentUser,UpdateAvatar} from "../stores/auth.slice.js";

export const useAuth = () =>{
    const dispatch = useDispatch();
    const login = (credential) => dispatch(LoginUser(credential));
    const logout= () => dispatch(LoginOut());
    const register = (userData) => dispatch(RegisterUser(userData));
    const getCurrentUser = () => dispatch(GetCurrentUser());
    const updateAvatar = (filepath) => dispatch(UpdateAvatar(filepath));

    return {
        login,
        logout,
        register,
        getCurrentUser,
        updateAvatar
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