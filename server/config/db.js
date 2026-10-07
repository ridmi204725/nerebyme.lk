import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI?.trim();

        if (!uri) {
            throw new Error('MONGODB_URI is missing or empty in server/.env');
        }

        const conn = await mongoose.connect(uri);
        console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
