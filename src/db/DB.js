import mongoos from "mongoose";
import { DB_NAME } from  "../constants.js";

const  connectDB = async () => {
    try{
    const connectionInstance =    await mongoos.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`Connected to DB: ${connectionInstance.connection.host}`);
    ;

    }catch{
        console.error("ERROR - DB", error);
        throw error;
        
    }
}

export default connectDB;