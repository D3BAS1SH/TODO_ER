import axios from "axios";
import { Store } from "../stores";
import UserAuthService from "./auth.service.js";
import {
    /*deleteTodo,
    setAddTodo,
    setError,*/
    setLoading,
    /*setSelectedTodo,
    setTodo,
    updateTodo*/
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

    setupInterceptors(){

        this.httpClient.interceptors.request.use(
            (config)=>{
                return config;
            },
            (error)=>{
                return Promise.reject(error);
            }
        )

        this.httpClient.interceptors.response.use(
            (response)=>{
                return response
            },
            async(error)=>{
                
                const originalRequest=error.config;

                const isPublicEndpoint = this.publicEndpoints.some(
                    endpoint => originalRequest.url.includes(endpoint)
                );

                if (isPublicEndpoint) {
                    return Promise.reject(error);
                }
                
                if(error.response?.status===401 && !originalRequest._retry){

                    console.log("Getting Error Response")
                    console.log(error);
                    
                    originalRequest._retry=true

                    if (!this.isRefreshing) {
                        this.isRefreshing = true;

                        try {
                            await this.getRefreshTokens();
                            
                            this.pendingRequests.forEach(cb => cb());
                            this.pendingRequests = [];
                            
                            return this.httpClient(originalRequest);
                        } catch (refreshError) {
                            this.pendingRequests.forEach(cb => cb(refreshError));
                            this.pendingRequests = [];
                            
                            await this.logout();
                            return Promise.reject(refreshError);
                        } finally {
                            this.isRefreshing = false;
                        }
                    } else {
                        return new Promise((resolve, reject) => {
                            this.pendingRequests.push((error) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(this.httpClient(originalRequest));
                                }
                            });
                        });
                    }
                }

                if (error.response?.status === 429) {
                    return this.retryWithBackoff(originalRequest);
                }

                return Promise.reject(error)
            }
        );
    }

    async retryWithBackoff(request, retries = 3, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try {
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
                return await this.httpClient(request);
            } catch (error) {
                if (i === retries - 1) throw error;
            }
        }
    }

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