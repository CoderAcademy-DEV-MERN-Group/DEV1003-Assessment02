/* eslint-disable no-console */
import mongoose from 'mongoose';

async function dropDatabase() {
  try {
    await mongoose.connection.dropDatabase();
    console.log('Clearing existing movies...');
  } catch (error) {
    console.error('Error clearing database: ', error);
  }
}

dropDatabase();
