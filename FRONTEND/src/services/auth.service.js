import axios from "axios";

class UserAuthService{
    constructor(){
        this.httpClient=axios.create({
            baseURL:"http://localhost:8088/api/v1/users/",
            withCredentials:true
        })

        this.setupInterceptors()
    }

    setupInterceptors(){
        this.httpClient.interceptors.response.use(
            (response)=>{
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
                header:{
                    'Content-type':'multipart/form-data'
                }
            }

            const response = await this.httpClient.post('/register',formData,config);
            //But i'm using the files and form data
            return response
        } catch (error) {
            throw this.handleError(error)            
        }
    }

    async login(credentials){
        try {
            const response = await this.httpClient.post('/login',credentials)
            return response
        } catch (error) {
            throw this.handleError(error)
        }
    }

    async logout(){
        try {
            await this.httpClient.post('/logout');
            this.clearState()
        } catch (error) {
            throw this.handleError(error)
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
            return response
        } catch (error) {
            throw this.handleError(error)
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
        //Redux Clear
        window.location.href='/login'
    }
}

export default new UserAuthService()