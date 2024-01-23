const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; 

const dbName = "MyAirtel"; 

// MongoDB Client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to connect to the MongoDB database
function dbConnection() {
  try {
     client.connect();
    console.log("Connected to the database");

  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

module.exports =  dbConnection;
