const express = require("express");
const app = express();
const PORT = 3000;

let plans = [];

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/", (req, res, next) => {
  res.send(
    "All available mobile plans: <ul><li>Truly unlimited</li><li>Data</li><li>Talktime(Top Up Voucher)</li><li>Entertainment</li></ul> "
  );
});

const authenticate = (req, res, next) => {
  console.log(req.headers);
  if (req.query.header === "abc@gmail") {
    next(); // Authentication successful, proceed to the next middleware or route handler
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

app.get("/signup", authenticate, (req, res, next) => {
  res.json({
    status: "success",
    message: "Sign Up Page",
    result: "User Details: Name: Riya Singh, Ongoing plans:...",
  });
});

app.get("/userRiya", authenticate, (req, res, next) => {
  res.send(
    "List of all plans associated with Riya: <ul><li>airtel xstream</li><li>airtel unlimited</li></ul>"
  );
});

app.get("/ExpiringPlans", authenticate, (req, res, next) => {
  const givenDate = new Date("2022-01-01");//kebab case
  const currentDate = new Date();

  if (givenDate > currentDate() + 7) {
    res.send("Plans to be renewed:");
  } else res.send("No such plans!");
});

app.post("/purchase", authenticate, (req, res) => {
  const { userId, planId } = req.body;

  // Validate user and plan (Replace this with your actual validation logic)
  const user = users.find((u) => u.id === userId);
  const plan = plans.find((p) => p.id === planId);

  if (!user || !plan) {
    return res.status(400).json({ error: "Invalid user or plan" });
  }

  // Simulate plan activation (You can add more logic based on your requirements)
  user.activePlans.push(plan);
  res.json({ message: "Plan purchased and activated successfully" });
});

//middleware function to check if user is logged in or not
// function authenticate(req, res, next){
//     //if the user is already logged in then call the next middleware
//     if(req.query.apikey=="abc"){
//         next();
//     }else{
//         console.error("Invalid access");
//     }
// }
