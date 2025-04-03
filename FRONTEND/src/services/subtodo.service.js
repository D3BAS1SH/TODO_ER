import axios from "axios";

class SubTodoService {
    constructor(){
        this.httpClient = axios.create({
            baseURL:"http://localhost:8088/api/v1/subtodos/",
            withCredentials:true,
            headers:{
                'Content-Type':"application/json"
            }
        });

        this.setupInterceptors();
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

    

    handleError(error){
        console.log(error);
        if (error.response) {
            return new Error(error.response?.data?.message || 'Server error');
        }
        if (error.request) {
            return new Error('No response from server');
        }
        if (error.message === 'Network Error') {
            return new Error('Network error. Please check your internet connection.');
        }
        return new Error('Request failed');
    }
}