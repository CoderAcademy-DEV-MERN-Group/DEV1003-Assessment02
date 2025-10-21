// Functions for setting up, clearing and tearing down in memory MongoDB for testing
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Declare mongoServer globally so it can be used by all functions
let mongoServer;

// Create and connect to temporary in memory MongoDB database
export async function setupTestDb() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}

// Function for clearing all data from database between tests
export async function clearTestDb() {
  const collections = Object.values(mongoose.connection.collections);
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
}

// Function for closing and stopping db after all tests run
export async function teardownTestDb() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}
