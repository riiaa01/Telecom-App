const express = require("express");
const router = express.Router();
 
const authenticate = require("./middlewares");
const controller=require("./controllers");
 
router.get("/", controller.rootController);
 
router.get("/signup", authenticate, controller.signupController);
 
router.get("/userRiya", authenticate, controller.userPlansController);
 
router.get("/expiringPlans",authenticate, controller.expiringPlansController);
 
router.post('/purchase', authenticate,  controller.purchasePlanController);
 
module.exports = router;