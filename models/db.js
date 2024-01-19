const { MongoClient } = require("mongodb");

// Connection URI
const uri = "mongodb://localhost:27017"; // Change this URI based on your MongoDB setup

// Database Name
const dbName = "your_database_name"; // Change this to your desired database name

// MongoDB Client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to connect to the MongoDB database
function dbConnection() {
  try {
     client.connect();
    console.log("Connected to the database");

    // Access your MongoDB collections using client.db(dbName).collection("your_collection_name");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

// Export the connectToDatabase function to use it in other parts of your application
module.exports =  dbConnection;
