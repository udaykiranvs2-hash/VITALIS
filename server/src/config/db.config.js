import mongoose from 'mongoose';
import dns from 'dns';

// Bypass local router SRV resolution issues by using Cloudflare/Google DNS servers
try {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
} catch (err) {
  console.warn('Unable to set custom DNS servers, using system defaults.');
}

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.warn('MONGODB_URI is not defined in your .env file. Continuing without MongoDB for local development.');
      return false;
    }

    mongoose.set('bufferCommands', false);
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
