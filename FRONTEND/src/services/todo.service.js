import axios from "axios";
import { Store } from "../stores";
import UserAuthService from "./auth.service.js";
import {
    deleteTodo,
    setAddTodo,
    setError,
    setLoading,
    setSelectedTodo,
    setTodo,
    updateTodo
} from '../stores/todo.slice.js';

class TodoService{
    constructor(){
        this.httpClient = axios.create({
            baseURL:"http://localhost:8088/api/v1/todos/",
            withCredentials:true,
            headers:{
                'Content-Type':"application/json"
            }
        });

        this.setupInterceptor();
    }

    //Request Intereptor
    setupInterceptor(){
        this.httpClient.interceptors.request.use(
            (config)=>{
                Store.dispatch(setLoading(true));
                return config
            },
            (error)=>{
                Store.dispatch(setLoading(false));
                return Promise.reject(error);
            }
        )

        this.httpClient.interceptors.response.use(
            (response)=>{
                Store.dispatch(setLoading(false))
                return response
            },
            async (error)=>{
                const originalRequest = error.config;
                if(error.response?.status===401 && !originalRequest._retry){
                    originalRequest._retry=true;

                    try {
                        await UserAuthService.getRefreshTokens();
                        return this.httpClient(originalRequest)
                    } catch (error) {
                        await UserAuthService.logout();
                        throw error;
                    }
                }

                Store.dispatch(setLoading(false));
                return Promise.reject(error);
            }
        );
    }

    // async getAllTodos(page=1,limit=5){
    //     try {
    //         const response = await this.httpClient.get(`/get-all-todo/`,{params:{
    //             page,
    //             limit
    //         }});
    //         Store.dispatch(setTodo(response.data));
    //         return response.data;
    //     } catch (error) {
    //         const handledError=this.handleError(error);
    //         Store.dispatch(setError(handledError.message));
    //         throw handledError
    //     }
    // }

    // async getTodoById(todoId){

    //     try {
    //         const response = await this.httpClient.get(`/get-a-todo/${todoId}`)
    //         Store.dispatch(setSelectedTodo(response.data))
    //         return response.data
    //     } catch (error) {
    //         const handledError = this.handleError(error);
    //         Store.dispatch(setError(handledError.message));
    //         return handledError
    //     }
    // }
    
    async createTodo(data){
        try {
            const response = await this.httpClient.post('/create-todo/',data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        } 
    }

    // async createTodo(data){
        
    //     try {
    //         Store.dispatch(setLoading(true))
    //         const response = await this.httpClient.post('/create-todo',data)
    //         Store.dispatch(setAddTodo(response.data));
    //         return response.data
    //     } catch (error) {
    //         const handledError = this.handleError(error)
    //         Store.dispatch(setError(handledError.message))
    //         throw handledError
    //     }
    // }
    
    // async updateTodo(todoId,todoChange){
        
    //     try {
    //         const response = await this.httpClient.patch(`/update-todo/${todoId}`,todoChange)
    //         Store.dispatch(updateTodo(response.data));
    //         return response.data;
    //     } catch (error) {
    //         const handledError=this.handleError(error);
    //         Store.dispatch(setError(handledError.message))
    //         return handledError;
    //     }
    // }
    
    // async deleteaTodo(todoId){
        
    //     try {
    //         const response = await this.httpClient.delete(`/delete-a-todo/${todoId}`);
    //         Store.dispatch(deleteTodo(response.data));
    //         return response.data
    //     } catch (error) {
    //         const handledError=this.handleError(error);
    //         Store.dispatch(setError(handledError.message));
    //         return handledError;
    //     }
    // }

    handleError(error){
        if(error.response){
            return new Error(error.response.data.message || "Server Error")
        }
        if(error.request){
            return new Error(error.request.data.message||"No response from the server");
        }
        return new Error('Request failed');
    }
}

export const todoServiceO = new TodoService();