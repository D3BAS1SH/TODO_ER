const corsConfig = {
    origin: [
        process.env.CORS_ORIGIN_LOCAL,
        process.env.CORS_ORIGIN_URL_V1,
        process.env.CORS_ORIGIN_URL_V2
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS',"PATCH"],
    allowedHeaders: ['Content-Type', 'Authorization','X-Requested-With'],
};

export default corsConfig;