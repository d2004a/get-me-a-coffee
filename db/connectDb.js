
import mongoose from "mongoose";

const connectDb = async () => {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/coffee', {
                useNewUrlParser: true,
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            return conn;
            
        } catch (error) {
            console.error("Database Connection Error:", error.message);
            throw error; // Let the caller handle it
        }
    }

  export default connectDb;