import axios from "axios";

class UserAuthService{
    constructor(){
        this.httpClient=axios.create({
            baseURL: import.meta.env.VITE_SERVER_ORIGIN? import.meta.env.VITE_SERVER_ORIGIN+"/api/v1/users/" : "http://localhost:8088/api/v1/users/",
            withCredentials:true,
            headers:{
                "Content-Type":"application/json"
            }
        })

        this.publicEndpoints = ['/login', '/register'];
        this.isRefreshing = false;
        this.pendingRequests = [];

        this.setupInterceptors()
    }

    setupInterceptors(){

        const MAX_TRIES = 5;

        //Request Interceptor
        this.httpClient.interceptors.request.use(
            (config)=>{
                return config;
            },
            (error)=>{
                return Promise.reject(error);
            }
        )

        //Response Interceptor
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
                            
                            // Process pending requests
                            this.pendingRequests.forEach(cb => cb());
                            this.pendingRequests = [];
                            
                            // Retry the original request
                            return this.httpClient(originalRequest);
                        } catch (refreshError) {
                            // If refresh fails, reject all pending requests
                            this.pendingRequests.forEach(cb => cb(refreshError));
                            this.pendingRequests = [];
                            
                            // Clear state and redirect to login
                            await this.logout();
                            return Promise.reject(refreshError);
                        } finally {
                            this.isRefreshing = false;
                        }
                    } else {
                        // Queue the request if refresh is already in progress
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

                    // try {
                    //     console.log("Triggering from Interceptors.")
                    //     await this.getRefreshTokens()
                    //     return this.httpClient(originalRequest)
                    // } catch (error) {
                    //     await this.logout()
                    //     throw error
                    // }
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
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i))); // Exponential backoff
                return await this.httpClient(request);
            } catch (error) {
                if (i === retries - 1) throw error;
            }
        }
    }

    async register(userData){
        try {

            const {username,fullname,email,password,avatar=null,coverImage=null} = userData;
            const formData = new FormData();

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
            return response;
        } catch (error) {
            const HandledError = this.handleError(error);
            throw HandledError;
        }
    }

    async login(credentials){
        try {
            
            const response = await this.httpClient.post('/login',credentials);
            return response
        } catch (error) {
            console.log(error)
            const HandledError = this.handleError(error)
            throw HandledError
        }
    }

    async logout(){
        try {
            await this.httpClient.post('/logout');
            this.clearState()
        } catch (error) {
            const HandledError = this.handleError(error)
            throw HandledError
        }
    }

    async getRefreshTokens(){
        try {
            const response = await this.httpClient.post('/refresh-token');
            return response
        } catch (error) {
            throw this.handleError(error)
        }
    }

    async getCurrentUser(){
        try {            
            const response = await this.httpClient.get('/get-current-user');
            return response;
        } catch (error) {
            const HandledError = this.handleError(error)
            throw HandledError
        }
    }

    async updateAvatar(filePath){
        try {
            console.log("From Service")
            console.log(filePath);
            if(!filePath){
                throw new Error("File not exists to be sent.")
            }
            const formData = new FormData();
            formData.append('avatar',filePath);

            const config={
                headers:{
                    'Content-type':'multipart/form-data'
                }
            }

            const response = await this.httpClient.patch('/update-avatar',formData,config); 
            return response;
        } catch (error) {
            const HandledError = this.handleError(error)
            throw HandledError
        }
    }

    async updateAccountDetail(accinfo){
        console.log("Service hit");
        const {fullname,email} = accinfo;
        if(!fullname || !email){
            throw new Error("Required info not found.");
        }
        
        const response = await this.httpClient.patch('/update-account-detail',accinfo);
        console.log("Service hit Success");
        return response;
    }

    async changePassword(passwordObj){
        const {oldPassword,newPassword} = passwordObj;
        if(!oldPassword||!newPassword){
            throw new Error("Required Info not found");
        }
        await this.httpClient.post('/change-password',{oldPassword,newPassword});
    }

    handleError(error){
        console.log(error);
        if (error.response) {
            // Server responded with error
            return new Error(error.response?.data?.message || 'Server error');
        }
        if (error.request) {
            // Request made but no response
            return new Error('No response from server');
        }
        if (error.message === 'Network Error') {
            return new Error('Network error. Please check your internet connection.');
        }
        // Something else went wrong
        return new Error('Request failed');
    }
    clearState(){
        window.location.href='/'
    }
}

export default new UserAuthService()