import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionResponse = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n*************************************************
            \n\tconnectionResponse
            \n*************************************************
            \n->${connectionResponse.connection.host}`);
        console.log(connectionResponse.STATES);
    } catch (error) {
        console.log("MONGODB Connection error : ",error);
        process.exit(1)
    }
}

export default connectDB;