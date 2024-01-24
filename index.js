const express = require("express");
const app = express();
const PORT = 3000;
 
const routes = require("./Routes");
const connectDB = require("./models/db");
app.use("/", routes);
 
connectDB();
 
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
 