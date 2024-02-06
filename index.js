const express = require("express");
const bodyParser = require('body-parser');
const config= require('./config.js');
const app = express();
const PORT = config.port;
app.use(bodyParser.json());
const routes = require("./routes");
const connectDB = require("./models/db");
app.use("/", routes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
