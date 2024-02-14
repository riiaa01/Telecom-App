// const { MongoClient } = require("mongodb");

// const uri = "mongodb://localhost:27017"; 

// const dbName = "MyAirtel"; 

// // MongoDB Client
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// // Function to connect to the MongoDB database
// function dbConnection() {
//   try {
//      client.connect();
//     console.log("Connected to the database");

//   } catch (error) {
//     console.error("Error connecting to the database:", error);
//     throw error;
//   }
// }
// module.exports =  dbConnection;

// const mongoose = require('mongoose');

// // New connection options
// mongoose.connect('mongodb://localhost:27017/MyAirtel', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false, // To avoid a deprecation warning
// });

// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', function () {
//   console.log('Connected to MongoDB');
// });


// module.exports =  db;

const mongoose = require('mongoose');
const { connectionLink } = require('../config');
 
const connectDB = async () => {
    try {
      //  await mongoose.connect('mongodb://0.0.0.0:27017/MyAirtel', {//put the url in config
      await mongoose.connect(connectionLink, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
 