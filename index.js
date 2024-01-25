const express = require("express");
const app = express();
const PORT = 3000;
 
const routes = require("./routes");
const connectDB = require("./models/db");
app.use("/", routes);
 
connectDB();
 
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
 