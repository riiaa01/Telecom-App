const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
const routes = require("./routes");
const connectDB = require("./models/db");
app.use("/", routes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
