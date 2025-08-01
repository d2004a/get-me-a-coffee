
import mongoose from "mongoose";

const connectDb = async () => {
        try {
            const conn = await mongoose.connect('mongodb://localhost:27017/coffee', {
                useNewUrlParser: true,
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            return conn;
            
        } catch (error) {
            console.error(error.message);
            process.exit(1);
        }
    }

  export default connectDb;