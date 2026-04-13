import { config } from "../configrations/config.js";
import mongoose from "mongoose";


export const connectToDataBase = async () =>{
    try {
        const dbInstance = await mongoose.connect(config.MONGO_DB_URI);
        console.log("Databse connection host is :-",dbInstance.connection.host);
    } catch (error) {
        console.log("Failed to connect mongodb host",error);
        process.exit(1)        
    }
}