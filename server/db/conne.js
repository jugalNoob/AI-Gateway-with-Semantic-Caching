import mongoose from "mongoose";


export const connectMongoDB = async () => {
  const mongodbconnect=process.env.MONGO_URIS
  try {
    await mongoose.connect(mongodbconnect, {
      maxPoolSize: 50,
      minPoolSize: 5,
      connectTimeoutMS: 100000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 10000,
      monitorCommands: true,
    });

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("💥 MongoDB connection failed:");
    console.error(err.message);

    process.exit(1);
  }
};

export default connectMongoDB;
