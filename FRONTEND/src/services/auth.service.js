import axios from "axios";

class UserAuthService{
    constructor(){
        this.httpClient=axios.create({
            baseURL:"http://localhost:8088/api/v1/users/",
            withCredentials:true
        })
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
                        const TokenResponse = await this.getRefreshTokens()
                        return this.httpClient(originalRequest)
                    } catch (error) {
                        await this.logout()
                        throw error
                    }
                }
            }
        );
    }

    async register(userData){
        try {
            const response = await this.httpClient.post('/register',userData);
            //But i'm using the files and form data
            return userData
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