import dotenv from 'dotenv';
import { APP } from './app.js';

dotenv.config({
    path:'./env'
})

import connectDB from './db/index.js';

connectDB()
.then(()=>{
    APP.on('error',(err)=>{
        console.log("Server Error : ",err);
    })

    const mySever = APP.listen(process.env.PORT||8000,()=>{
        console.log(`Server is running at port : ${mySever.address().port}`);
    })
    
})
.catch((err)=>{
    console.log(`MongoDB Connection error.`,err);
})