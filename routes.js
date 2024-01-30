// const express = require("express");
// const router = express.Router();
 
// const authenticate = require("./middlewares");
// const controller=require("./controllers");
//  //available plans-separate route
// router.get("/", controller.rootController);
 
// router.get("/signup", authenticate, controller.signupController);
//  //no name in the route: myPlans
// router.get("/userRiya", authenticate, controller.userPlansController);
 
// router.get("/expiringPlans",authenticate, controller.expiringPlansController);
//  //purchase plans se add in available plans
// router.post('/purchase', authenticate,  controller.purchasePlanController);
 
// module.exports = router;

const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
 
const authenticate = require("./middlewares");
const controller=require("./controllers");
 
router.get("/", (req, res)=>{
    res.send("Welcome to Airtel/Jio!");
});
//all available plans
router.get("/signup", controller.signupController);
 
router.get("/login", controller.loginController);
 
router.get("/allPlans", authenticate, controller.allPlansController);
 
router.get("/myPlans", authenticate, controller.userPlansController);
 
router.get("/expiringPlans",authenticate, controller.expiringPlansController);
 
router.post('/purchase', authenticate,  controller.purchasePlanController);
 
module.exports = router;