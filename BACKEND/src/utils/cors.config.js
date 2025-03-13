const corsConfig = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS',"PATCH"],
    allowedHeaders: ['Content-Type', 'Authorization','X-Requested-With'],
};
  
export default corsConfig;