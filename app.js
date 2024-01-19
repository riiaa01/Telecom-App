const express = require("express");
const routes = require("./routes");
const config = require("./config");
const dbConnection = require(".models/db");
const app = express();
const PORT = config.port;
 
 
app.use("/", routes);
 
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});