import { app } from "../app.js";
import dotenv from 'dotenv';    // Import the dotenv library for managing environment variables
import mongoose from 'mongoose';  // Import Mongoose for MongoDB interactions

dotenv.config();

// Function to establish a connection to the MongoDB database
const connect = async () => {
  try {
      await mongoose.connect(process.env.MONGO); // Connect to MongoDB using the MONGO environment variable
      console.log("Connected to DB server")
  } catch (error) {
      throw error; // Throw an error if the connection attempt fails
  }
}

// Start the Express server and listen on port 3000
app.listen(3000, () => {
  connect() // calling the connect async function
  console.log("Server is listening on port 3000!"); // Log a message when the server is successfully started
});
