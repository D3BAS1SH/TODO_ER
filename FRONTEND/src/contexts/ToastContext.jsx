
import React, { createContext, useContext } from 'react'
import toast from 'react-hot-toast';

const ToastContext = createContext();

export const ToastProvider = ({children}) => {
    const showToast = (message,type='success')=>{
        switch (type) {
            case "success":
                toast.success(message);
                break;
            case "error":
                toast.error(message);
                break;
            case "loading":
                toast.loading(message);
                break;

            default:
                toast(message);
        }
    };
    return (
        <ToastContext.Provider value={{showToast}}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if(!context){
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}