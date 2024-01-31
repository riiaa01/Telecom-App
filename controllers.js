const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const authenticate = require("./middlewares");
app.use(express.json());

const userService = require('./services');
const User = require('./models/users');
const Plan = require('./models/plans');
const Transaction = require('./models/transactions');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 
const UserController = {
 
   // landingPage:
 
    // rootController:(req, res, next)=>{
    //     res.send("All available mobile plans: <ul><li>Truly unlimited</li><li>Data</li><li>Talktime(Top Up Voucher)</li><li>Entertainment</li></ul> ");
    // },
 
 //working-signup, login, allPlans, 
    signupController: async (req, res) => {
        try{
            const{
                firstName, lastName, phoneNumber, username, email, password, address
            } = req.body;
            console.log(password);
 
            if(!username|| !email|| !password){
                return res.send("Please fill the required fields");
            }
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
 
            if (existingUser) {
              return res.status(400).json({ error: 'Username or email already exists' });
            }
 
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword);
            const newUser= new User({
            username,
            email,
            password: hashedPassword ,
            firstName,
            lastName,
            phoneNumber,
            address
        });
           
        await newUser.save();
            res.status(201).json({ message: 'User signed up successfully' });
           // res.redirect('/login');
          }
          catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Signup failed' });
          }
    },
 
 
    loginController:async (req, res)=>{
        try {
            const { email, password } = req.body;
       
            if (!email || !password) {
              return res.status(400).json({ error: 'Email and password are required' });
            }
       
         
            const user = await User.findOne({ email });
            if (!user) {
              return res.status(401).json({ error: 'Invalid credentials' });
            }
       
         
            const passwordComp = await bcrypt.compare(password, user.password);
            if (!passwordComp) {
              return res.status(401).json({ error: 'Invalid credentials' });
            }
       
            // Generate a JWT
            const token = jwt.sign({ userId: user._id }, 'jwtkey', { expiresIn: '1h' });
       
            res.json({ message: 'Login successful', token });
            //res.redirect("/myPlans");
          } catch (error) {
            console.error('Error during login:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
          }
 
 
    },
    
    allPlansController: async (req, res) => {
        try {
            const plans = await Plan.find({}, 'planName');
            console.log(plans);
           
            const planNames = plans.map(plan => plan.planName);
            console.log('planName:'+planNames);
 
            res.send(`All available mobile plans: ${planNames.join(', ')}`);
        } catch (error) {
            console.error('Error fetching plan names:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    userPlansController:async (req, res) => {
       
        try {
           
           // const user = await User.findOne({ email: user.email });
           const user = req.user;
           console.log('Userz:' +user);
 
 
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            console.log('plansAssociated' +user.plansAssociated);
           
            const associatedPlans = await Promise.all((user.plansAssociated || []).map(async planId => {
                const plan = await Plan.findById(planId);
                return {
                    planName: plan ? plan.planName : 'Unknown Plan',
                };
            }));
            
 
            console.log(associatedPlans);
            res.json({
                status: 'success',
                message: `${user.username}'s Plans`,
                results: associatedPlans,
            });
        } catch (error) {
            console.error('Error fetching user plans:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
 
 
    purchasePlanController: async (req, res) => {
        try {
            const user=req.user;
            const  planCode  = req.body;
   
            if (!user || !planCode) {
                return res.status(400).json({ error: 'Username and planCode are required' });
            }
   
            // Find user by username
            //const user = await User.findOne({ username });
   
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
   
            // Find plan by planCode
            const plan = await Plan.findOne({ planCode });
   
            if (!plan) {
                return res.status(404).json({ error: 'Plan not found' });
            }
   
            // Check if the user already has the plan
            if (user.plansAssociated.includes(plan._id)) {
                return res.status(400).json({ error: 'User already has this plan' });
            }else{
                user.plansAssociated.push(plan._id);
                await user.save();
            }
           
            // Create a new transaction
            const transaction = new Transaction({
                user: user._id,
                plan: plan._id,
                amount: plan.price,
            });
            await transaction.save();
   
            // Fetch the updated plansAssociated for the user
            const updatedUser = await User.findById(user._id).populate('plansAssociated');
           
            const associatedPlans = updatedUser.plansAssociated.map(plan => {
                return {
                    planName: plan.planName,
                };
           });
          //  const allPlans=Plan.findById({associatedPlans});
           
            //console.log(allPlans);
            res.json({
                message: 'Plan purchased and activated successfully',
                user: {
                    username: updatedUser.username,
                    email: updatedUser.email,
                    associatedPlans: associatedPlans,
                },
            });
        } catch (error) {
            console.error('Error purchasing plan:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
   
    // dateof activation+validity days=date-date.now<=7
    expiringPlansController: async (req, res, next) => {
        try {
            // Calculate the date 7 days from now
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
   
            // Find transactions set to expire in the next 7 days
            const expiringTransactions = await Transaction.find({
                activationDate: { $lte: sevenDaysFromNow },
            }).populate('user plan');
   
            // Prepare the response
            const expiringPlansDetails = expiringTransactions.map(transaction => {
                const { plan, activationDate, user } = transaction;
               
                // Calculate expiration date based on plan's validity
                const expirationDate = new Date(activationDate);
                expirationDate.setDate(expirationDate.getDate() + plan.validity);
   
                const daysUntilExpiration = Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24));
   
                return {
                    planName: plan.planName, // Assuming a field named 'planName' in your Plan model
                    expiryDate: expirationDate,
                    daysUntilExpiration: daysUntilExpiration,
                    userDetails: {
                        username: user.username,
                        email: user.email,
                        // Include other user details as needed
                    },
                };
            });
   
            res.json({
                status: 'success',
                message: 'Expiring Plans',
                results: expiringPlansDetails,
            });
        } catch (error) {
            console.error('Error fetching expiring plans:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
 
module.exports = UserController;