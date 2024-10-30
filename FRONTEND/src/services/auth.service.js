import axios from "axios";
import { Store } from "../stores";
import {clearAuth,setError,setLoading,setUser} from "../stores/auth.slice.js";

class UserAuthService{
    constructor(){
        this.httpClient=axios.create({
            baseURL:"http://localhost:8088/api/v1/users/",
            withCredentials:true,
            headers:{
                "Content-Type":"application/json"
            }
        })

        this.setupInterceptors()
    }

    setupInterceptors(){

        //Request Interceptor
        this.httpClient.interceptors.request.use(
            (config)=>{
                Store.dispatch(setLoading(true));
                return config;
            },
            (error)=>{
                Store.dispatch(setLoading(false));
                return Promise.reject(error);
            }
        )

        //Response Interceptor
        this.httpClient.interceptors.response.use(
            (response)=>{
                Store.dispatch(setLoading(false))
                return response
            },
            async(error)=>{
                
                const originalRequest=error.config;
                
                if(error.response?.status===401 && !originalRequest._retry){
                    
                    originalRequest._retry=true

                    try {
                        await this.getRefreshTokens()
                        return this.httpClient(originalRequest)
                    } catch (error) {
                        await this.logout()
                        throw error
                    }
                }
                Store.dispatch(setLoading(false))
                return Promise.reject(error)
            }
        );
    }

    async register(userData){
        try {

            const {username,fullname,email,password,avatar=null,coverImage=null} = userData
            const formData = new FormData()

            formData.append('username',username)
            formData.append('fullname',fullname)
            formData.append('email',email)
            formData.append('password',password)
            
            if(avatar){
                formData.append('avatar',avatar)
            }

            if(coverImage){
                formData.append('coverImage',coverImage)
            }

            const config={
                headers:{
                    'Content-type':'multipart/form-data'
                }
            }

            const response = await this.httpClient.post('/register',formData,config);
            Store.dispatch(setUser(response.data.user))
            return response
        } catch (error) {
            const HandledError = this.handleError(error)
            Store.dispatch(setError(HandledError.message))
            throw HandledError
        }
    }

    async login(credentials){
        try {
            
            const response = await this.httpClient.post('/login',credentials)
            Store.dispatch(setUser(response.data.user))
            return response
        } catch (error) {
            const HandledError = this.handleError(error)
            Store.dispatch(setError(HandledError.message))
            throw HandledError
        }
    }

    async logout(){
        try {
            
            await this.httpClient.post('/logout');
            this.clearState()
        } catch (error) {
            const HandledError = this.handleError(error)
            Store.dispatch(setError(HandledError.message))
            throw HandledError
        }
    }

    async getRefreshTokens(){
        try {
            const response = await this.httpClient.post('refresh-token');
            return response
        } catch (error) {
            throw this.handleError(error)
        }
    }

    async getCurrentUser(){
        try {
            
            const response = await this.httpClient.get('/get-current-user');
            Store.dispatch(setUser(response.data.user))
            return response
        } catch (error) {
            const HandledError = this.handleError(error)
            Store.dispatch(setError(HandledError.message))
            throw HandledError
        }
    }

    handleError(error){
        if (error.response) {
            // Server responded with error
            return new Error(error.response.data.message || 'Server error');
        }
        if (error.request) {
            // Request made but no response
            return new Error('No response from server');
        }
        // Something else went wrong
        return new Error('Request failed');
    }
    clearState(){
        Store.dispatch(clearAuth())
        window.location.href='/login'
    }
}

export default new UserAuthService()