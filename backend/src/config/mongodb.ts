import mongoose = require("mongoose");
import process = require("node:process");

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MongoURI as string);
        console.log(`MongoDB connected : ${conn.connection.host}`);
    }
    catch (error) {
        console.log("Database connection failed");
        process.exit(1);
    }
};