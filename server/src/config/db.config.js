import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.warn('MONGODB_URI is not defined in your .env file. Continuing without MongoDB for local development.');
      return false;
    }

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`MongoDB Connection Error: ${error.message}. Continuing without MongoDB for local development.`);
    return false;
  }
};

export default connectDB;
