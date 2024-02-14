const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const config = require("./config.js");
const User = require("./models/users");
const Plan = require("./models/plans");
const Transaction = require("./models/transactions");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Plans = require("./models/plans");
const Transactions = require("./models/transactions");
const sendEmailNotification= require("./sendEmailCron.js");

// const UserController = {
//   // landingPage:

//   // rootController:(req, res, next)=>{
//   //     res.send("All available mobile plans: <ul><li>Truly unlimited</li><li>Data</li><li>Talktime(Top Up Voucher)</li><li>Entertainment</li></ul> ");
//   // },

//   //working-signup, login, allPlans,
//   signupController: async (req, res) => {
//     try {
//       const {
//         firstName,
//         lastName,
//         phoneNumber,
//         username,
//         email,
//         password,
//         address,
//       } = req.body;
//       console.log(password);

//       if (!username || !email || !password) {
//         return res.send("Please fill the required fields");
//       }
//       const existingUser = await User.findOne({
//         $or: [{ username }, { email }],
//       });

//       if (existingUser) {
//         return res
//           .status(400)
//           .json({ error: "Username or email already exists" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
//       console.log(hashedPassword);
//       const newUser = new User({
//         username,
//         email,
//         password: hashedPassword,
//         firstName,
//         lastName,
//         phoneNumber,
//         address,
//       });

//       await newUser.save();
//       res.status(201).json({ message: "User signed up successfully" });
//       // res.redirect('/login');
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Signup failed" });
//     }
//   },

//   loginController: async (req, res) => {
//     try {
//       const { email, password } = req.body;

//       if (!email || !password) {
//         return res
//           .status(400)
//           .json({ error: "Email and password are required" });
//       }

//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.status(401).json({ error: "Invalid credentials" });
//       }

//       const passwordComp = await bcrypt.compare(password, user.password);
//       if (!passwordComp) {
//         return res.status(401).json({ error: "Invalid credentials" });
//       }

//       // Generate a JWT
//       const token = jwt.sign({ userId: user._id }, config.secretKey, {
//         expiresIn: "1h",
//       });

//       res.json({ message: "Login successful", token });
//       //res.redirect("/myPlans");
//     } catch (error) {
//       console.error("Error during login:", error.message);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   },
// //details
//   allPlansController: async (req, res) => {
//     try {
//       const plans = await Plan.find({}, "planName");
//       console.log(plans);

//       const planNames = plans.map((plan) => plan.planName);
//       console.log("planName:" + planNames);

//       res.send(`All available mobile plans: ${planNames.join(", ")}`);
//     } catch (error) {
//       console.error("Error fetching plan names:", error.message);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   },
//   userPlansController: async (req, res) => {
//     //try {

//     //    // const user = await User.findOne({ email: user.email });
//     //    const user = req.user;
//     //    console.log('Userz:' ,user);

//     //     if (!user) {
//     //         return res.status(404).json({ error: 'User not found' });
//     //     }
//     //     console.log('plansAssociated' +user.plansAssociated);

//     //     const associatedPlans = await Promise.all((user.plansAssociated || []).map(async planId => {
//     //         const plan = await Plan.findById(planId);
//     //         return {
//     //             planName: plan ? plan.planName : 'Unknown Plan',
//     //         };
//     //     }));

//     //     console.log(associatedPlans);
//     //     res.json({
//     //         status: 'success',
//     //         message: `${user.username}'s Plans`,
//     //         results: associatedPlans,
//     //     });
//     // } catch (error) {
//     //     console.error('Error fetching user plans:', error.message);
//     //     res.status(500).json({ error: 'Internal Server Error' });
//     // }

//     try {

//       const user = req.user;
//       console.log("req.user:", user);

//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       const associatedPlans = await Promise.all(
//         user.plansAssociated.map(async (planId) => {
//           const plan = await Plan.findById(planId);
//           return {
//             planName: plan ? plan.planName : "Unknown Plan", // Replace 'Unknown Plan' with a default value
//           };
//         })
//       );

//       console.log(associatedPlans);
//       res.json({
//         status: "success",
//         message: `${user.username}'s Plans`,
//         results: associatedPlans,
//       });
//     } catch (error) {
//       console.error("Error fetching user plans:", error.message);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   },

//   purchasePlanController: async (req, res) => {
//     try {
//       const user = req.user;
//       const { planCode } = req.body;
//       console.log("User:", user);

//       if (!user || !planCode) {
//         return res
//           .status(400)
//           .json({ error: "Username and planCode are required" });
//       }

//       //const user = await User.findOne({ username });

//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       const plan = await Plan.findOne({ planCode });

//       if (!plan) {
//         return res.status(404).json({ error: "Plan not found" });
//       }

//       if (!user.plansAssociated) {
//         user.plansAssociated = [];
//       }

//       if (user.plansAssociated.includes(plan._id)) {
//         return res.status(400).json({ error: "User already has this plan" });
//       } else {
//         user.plansAssociated.push(plan._id);
//         await user.save();
//       }

//       const transaction = new Transaction({
//         user: user._id,
//         plan: plan._id,
//         amount: plan.price,
//       });
//       await transaction.save();

//       const updatedUser = await User.findById(user._id).populate(
//         "plansAssociated"
//       );

//       const associatedPlans = updatedUser.plansAssociated.map((plan) => {
//         return {
//           planName: plan.planName,
//         };
//       });
//       //  const allPlans=Plan.findById({associatedPlans});

//       //console.log(allPlans);
//       res.json({
//         message: "Plan purchased and activated successfully",
//         user: {
//           username: updatedUser.username,
//           email: updatedUser.email,
//           associatedPlans: associatedPlans,
//         },
//       });
//     } catch (error) {
//       console.error("Error purchasing plan:", error.message);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   },

//   // dateof activation+validity days=date-date.now<=7
//   expiringPlansController: async (req, res, next) => {
//     //     try {
//     //         // Calculate the date 7 days from now
//     //         const sevenDaysFromNow = new Date();
//     //         sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

//     //         // Find transactions set to expire in the next 7 days
//     //         const expiringTransactions = await Transaction.find({
//     //             activationDate: { $lte: sevenDaysFromNow },
//     //         }).populate('user plan');

//     //         // Prepare the response
//     //         const expiringPlansDetails = expiringTransactions.map(transaction => {
//     //             const { plan, activationDate, user } = transaction;

//     //             // Calculate expiration date based on plan's validity
//     //             const expirationDate = new Date(activationDate);
//     //             expirationDate.setDate(expirationDate.getDate() + plan.validity);

//     //             const daysUntilExpiration = Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24));

//     //             return {
//     //                 planName: plan.planName, // Assuming a field named 'planName' in your Plan model
//     //                 expiryDate: expirationDate,
//     //                 daysUntilExpiration: daysUntilExpiration,
//     //                 userDetails: {
//     //                     username: user.username,
//     //                     email: user.email,
//     //                     // Include other user details as needed
//     //                 },
//     //             };
//     //         });

//     //         res.json({
//     //             status: 'success',
//     //             message: 'Expiring Plans',
//     //             results: expiringPlansDetails,
//     //         });
//     //     } catch (error) {
//     //         console.error('Error fetching expiring plans:', error.message);
//     //         res.status(500).json({ error: 'Internal Server Error' });
//     //     }
//     const user = req.user;
//     const userTransactions = await Transaction.find({
//       user: user._id,
//     }).populate("plan");
//     const activePlans = [];
//     const upcomingPlans = [];
//     const expiredPlans = [];

//     userTransactions.forEach((transaction) => {
//       const { activationDate, plan } = transaction;
//       const currentDate = Date.now();

//       if (activationDate > currentDate) {
//         upcomingPlans.push(plan);
//       } else if (
//         activationDate + plan.validity * 24 * 60 * 60 * 1000 >
//         currentDate
//       ) {
//         activePlans.push(plan);
//       } else {
//         expiredPlans.push(plan);
//       }
//     });
//   },
// };

// module.exports = UserController;

const UserController = {
  signupController: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        phoneNumber,
        username,
        email,
        password,
        address,
      } = req.body;
      console.log(password);

      if (!username || !email || !password) {
        return res.send("Please fill the required fields");
      }
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Username or email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        address,
      });

      await newUser.save();
      res.status(201).json({ message: "User signed up successfully" });
      // res.redirect('/login');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Signup failed" });
    }
  },

  loginController: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const passwordComp = await bcrypt.compare(password, user.password);
      if (!passwordComp) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user._id }, config.secretKey, {
        expiresIn: "3h",
      });

      res.json({
        message: "Login successful",
        token,
      });
      //res.redirect("/myPlans");
    } catch (error) {
      console.error("Error during login:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  allPlansController: async (req, res) => {
    try {
      const plans = await Plan.find().lean();

      res.json({
        status: "success",
        message: "All Plans Details",
        results: plans,
      });
    } catch (error) {
      console.error("Error fetching plan details:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // userPlansController: async (req, res) => {
  //   try {
  //     const { username, email } = req.body;

  //     const user = await User.findOne({ $or: [{ username }, { email }] });

  //     if (!user) {
  //       return res.status(404).json({ error: "User not found" });
  //     }

  //     const transactions = await Transaction.find({ user: user._id }).populate(
  //       "plan"
  //     );

  //     const associatedPlans = transactions.map((transaction) => {
  //       const { plan, activationDate, expirationDate } = transaction;
  //       const planStatus = (activationDate, expirationDate) => {
  //         const currentDate = Date.now();

  //         if (activationDate > currentDate) {
  //           return "Upcoming";
  //         } else if (
  //           currentDate >= activationDate &&
  //           currentDate <= expirationDate
  //         ) {
  //           return "Active";
  //         } else {
  //           return "Expired";
  //         }
  //       };
  //       const statusOfPlan = planStatus(activationDate, expirationDate);

  //       return {
  //         planName: plan.planName,
  //         statusOfPlan,
  //         activationDate,
  //         expirationDate,
  //       };
  //     });

  //     const groupedPlans = {
  //       Active: [],
  //       Upcoming: [],
  //       Expired: [],
  //     };

  //     associatedPlans.forEach((plan) => {
  //       groupedPlans[plan.statusOfPlan].push(plan);
  //     });

  //     res.json({
  //       message: "User plans retrieved successfully",
  //       user: {
  //         username: user.username,
  //         email: user.email,
  //         associatedPlans: groupedPlans,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error fetching user plans:", error.message);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // },

  userPlansController: async (req, res) => {
    try {
      const { username, email } = req.body;

      const user = await User.findOne({ $or: [{ username }, { email }] });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const transactions = await Transaction.aggregate([
        {
          $match: { user: user._id },
        },
        {
          $lookup: {
            from: "plans",
            localField: "plan",
            foreignField: "_id",
            as: "plan",
          },
        },
        {
          $unwind: "$plan",
        },
        {
          $project: {
            planName: "$plan.planName",
            activationDate: "$activationDate",
            expirationDate: "$expirationDate",
          },
        },

        {
          $addFields: {
            // Add field for plan status based on provided logic
            planStatus: {
              $cond: {
                // If expirationDate is in the future
                if: { $gt: ["$expirationDate", new Date()] },
                then: {
                  $cond: {
                    // If activationDate is in the future
                    if: { $lte: ["$activationDate", new Date()] },
                    then: "Active", // Plan is upcoming
                    else: "Upcoming", // Plan is active
                  },
                },
                else: "Expired", // Plan is expired
              },
            },
          },
        },
        { $sort: { planStatus: 1, purchaseDate: 1 } },
        {
          $group: {
            _id: "$planStatus", //setting grouping key on the basis of planStatus
            plans: { $push: "$$ROOT" }, //push all fields in to the object array With id planStatus
          },
        },
      ]);

      res.json({
        message: "User plans retrieved successfully",
        user: {
          username: user.username,
          email: user.email,
          transactions,
          // associatedPlans: groupedPlans,
        },
      });
    } catch (error) {
      console.error("Error fetching user plans:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  purchasePlanController: async (req, res) => {
    try {
      const user = req.user;
      const { planCode } = req.body;
      console.log("User:", user);

      if (!user || !planCode) {
        return res
          .status(400)
          .json({ error: "Username and planCode are required" });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const plan = await Plan.findOne({ planCode });

      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      if (!user.plansAssociated) {
        user.plansAssociated = [];
      }

      user.plansAssociated.push(plan._id);
      await user.save();

      const activePlans = await Transaction.find({
        user: user._id,
        // activationDate:{$lte: new Date()},
        // expirationDate: { $gt: new Date() }
      }).sort({ purchaseDate: -1 });

      let activationDate = Date.now();
      let expirationDate = new Date();

      if (activePlans.length > 0) {
        const latestActivePlan = activePlans[0]; // Get the most recently activated plan
        activationDate = new Date(latestActivePlan.expirationDate);
        activationDate.setDate(activationDate.getDate() + 1);
      }

      expirationDate = new Date(activationDate);
      expirationDate.setDate(expirationDate.getDate() + plan.validity);

      const transaction = new Transaction({
        user: user._id,
        plan: plan._id,
        amount: plan.price,
        activationDate,
        expirationDate,
      });
      await transaction.save();

      const updatedUser = await User.findById(user._id).populate(
        "plansAssociated"
      );

      const associatedPlans = updatedUser.plansAssociated.map((plan) => {
        return {
          planName: plan.planName,
        };
      });

      res.json({
        message: "Plan purchased and activated successfully",
        user: {
          username: updatedUser.username,
          email: updatedUser.email,
          associatedPlans: associatedPlans,
        },
      });
    } catch (error) {
      console.error("Error purchasing plan:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  expiringPlansController: async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      const currentDate = new Date();

      const expiringTransactions = await Transaction.find({
        user: user._id,
        expirationDate: { $gt: new Date(), $lt: sevenDaysFromNow },
      }).populate("plan");

      if (expiringTransactions.length === 0) {
        return res.json({
          message: "No plans are expiring in the next seven days",
          user: {
            username: user.username,
            email: user.email,
          },
        });
      }
      const { sendEmailNotification } = require('./sendEmailCron')
      const expiringPlans = expiringTransactions.map((transaction) => {
        const { plan, expirationDate } = transaction;
        const daysLeftForExpiration = Math.ceil(
          (expirationDate.getTime() - currentDate.getTime()) /
            (1000 * 3600 * 24)
        ); 
       
        sendEmailNotification(String(user.email), String(plan.planName)+ " soon to expire", String(daysLeftForExpiration)+" days left for expiration of plan:"+ String(plan.planName));

        return {
          planName: plan.planName,
          statusOfPlan: "Active",
          expirationDate,
          daysLeftForExpiration,
        };
      });

      res.json({
        message: "These plans are about to expire in a week",
        user: {
          username: user.username,
          email: user.email,
          expiringPlans: expiringPlans,
          // daysLeftForExpiration : Math.ceil((expirationDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)),
        },
      });
    } catch (error) {
      console.error("Error fetching expiring plans:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = UserController;
