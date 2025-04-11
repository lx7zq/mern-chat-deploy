import mongoose from 'mongoose';

// Connect to the database
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL); 
        console.log("MongoDB connected:" + conn.connection.host);
        
        // สร้าง collection อัตโนมัติ
        await mongoose.connection.db.createCollection('users');
        await mongoose.connection.db.createCollection('messages');
        console.log("Collections created successfully");
    } catch (error) {
        if (error.code === 48) { // Collection already exists
            console.log("Collections already exist");
        } else {
            console.log("MongoDB connection failed", error);
        }
    }
}