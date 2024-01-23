const express = require("express");
const routes = require("./routes");
const config = require("./config");
const dbConnection = require(".models/db");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = config.port;
 
app.use(bodyParser.json()); 
app.use("/", routes);

mongoose.connect('mongodb://localhost:27017/MyAirtel', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});