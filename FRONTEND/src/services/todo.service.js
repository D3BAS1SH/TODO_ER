import axios from "axios";

class TodoService{
    constructor(){
        this.httpClient = axios.create({
            baseURL:"http://localhost:8088/api/v1/todos/",
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

    async createTodo(TodoObject){
        try {
            if(!TodoObject){
                throw new Error("No New Todo Item Provided.");
            }

            const {Heading,Color} = TodoObject;
            const response = await this.httpClient.post('/create-todo',{Heading:Heading,Color:Color});
            return response;
            
        } catch (error) {
            const HandledError = this.handleError(error)
            throw HandledError
        }
    }

    async getAllTodo(ParamValues){
        try {
            if(!ParamValues){
                throw new Error("No Todo fetching Param values provided");
            }

            const {page = 1,limit = 10} = ParamValues;
            const response = await this.httpClient.get('/get-all-todo/',{
                params:{page,limit}
            })

            return response;
        } catch (error) {
            const HandledError = this.handleError(error);
            throw HandledError;
        }
    }

    async deleteTodo(id){
        try {
            if(!id){
                throw new Error("Id was not provided.");
            }

            await this.httpClient.delete('/delete-a-todo/',{params:{id}});
        } catch (error) {
            const HandledError = this.handleError(error);
            throw HandledError;
        }
    }

    async updateTodo(updateInfo){
        try {
            if(!updateInfo){
                throw new Error("not updated info provided");
            }

            const {Heading, Color, Completed, id} = updateInfo;

            if(!id){
                throw new Error("No Id mentioned to update the value.");
            }

            const response = await this.httpClient.patch("/update-todo/",{Heading,Color,Completed},{params:{id}})

            return response;
        } catch (error) {
            const HandledError = this.handleError(error);
            throw HandledError;
        }
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

export default new TodoService();