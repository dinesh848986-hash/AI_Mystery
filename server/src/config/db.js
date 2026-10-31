import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Set it in the environment or in the project root/server .env file for local development.');
  }
  if (!/^mongodb(?:\+srv)?:\/\//i.test(uri)) {
    throw new Error('MONGODB_URI is invalid. It must start with mongodb:// or mongodb+srv://.');
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  } catch (error) {
    if (error.code === 18 || error.codeName === 'AuthenticationFailed') {
      throw new Error('MongoDB authentication failed. Verify the Atlas database username/password, authSource, and URL-encode special characters in credentials.');
    }
    if (error.name === 'MongoParseError' || error.name === 'MongoInvalidArgumentError') {
      throw new Error('MONGODB_URI could not be parsed. Copy the connection string from Atlas and check its format.');
    }
    if (error.name === 'MongoServerSelectionError' || error.name === 'MongoNetworkError') {
      throw new Error('Could not reach MongoDB. Check that the Atlas cluster is running and its Network Access list allows this service.');
    }
    throw new Error('MongoDB connection failed. Check the MONGODB_URI and Atlas configuration.');
  }
  console.info('MongoDB connected');
}
