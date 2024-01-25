const userService = require('./services');
const User = require('./models/users');
const Plan = require('./models/plans');
const Transaction = require('./models/transactions');


const UserController = {

    // rootController:(req, res, next)=>{
    //     res.send("All available mobile plans: <ul><li>Truly unlimited</li><li>Data</li><li>Talktime(Top Up Voucher)</li><li>Entertainment</li></ul> ");
    // },


    rootController: async (req, res, next) => {
        try {

            const plans = await Plan.find({}, 'planName');
            console.log(plans);
            const planNames = plans.map(plan => plan.planName);
            console.log(planNames);


            res.send(`All available mobile plans: ${planNames.join(', ')}`);
        } catch (error) {
            console.error('Error fetching plan names:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // signupController: (req, res, next) => {
    //     res.send("List of all plans associated with Riya: <ul><li>airtel xstream</li><li>airtel unlimited</li></ul>");
    // },


    signupController: async (req, res, next) => {
        const userEmail = req.query.header; 
        try {
            const user = await User.findOne({ email: userEmail });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }


//            Extract plan details from the populated plansAssociated field
            // const associatedPlans = user.plansAssociated.map(plan => {
            //     return {
            //         planName: plan.planName, // Assuming a field named 'planName' in your Plan model
            //         // Include other plan details as needed
            //     };
            // });
            // console.log('Raw plansAssociated:', user.plansAssociated);


            // const associatedPlans = user.plansAssociated.map(planId => planId.toString());


            // console.log('Stringified plansAssociated:', associatedPlans);
 
            const associatedPlans = await Promise.all(user.plansAssociated.map(async planId => {
                const plan = await Plan.findById(planId);
                return {
                    planName: plan ? plan.planName : 'Unknown Plan',  
                    
                };
            }));
           
            res.json({
                status: 'success',
                message: 'Sign Up Page',
                result: {
                    username: user.username,
                    associatedPlans: associatedPlans,
                },
            });
        } catch (error) {
            console.error('Error fetching user and associated plans:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },


    userPlansController: (req, res, next) => {
        res.send("List of all plans associated with Riya: <ul><li>airtel xstream</li><li>airtel unlimited</li></ul>");
    },


    expiringPlansController: (req, res, next) => {
        const givenDate = new Date('2022-01-01');
        const currentDate = new Date();
   
        if (givenDate > currentDate + 7) {
            res.send("Plans to be renewed:");
        } else {
            res.send("No such plans!");
        }
    },


    purchasePlanController:  (req, res) => {
        const { userId, planId } = req.body;
     
        const user = users.find(u => u.id === userId);
        const plan = plans.find(p => p.id === planId);
     
        if (!user || !plan) {
          return res.status(400).json({ error: 'Invalid user or plan' });
        }
     
        user.activePlans.push(plan);
        res.json({ message: 'Plan purchased and activated successfully' });
      },


    getAllUsers: (req, res, next) => {
        const users = userService.getAllUsers();
        res.json(users);
    },


    getUserById: (req, res, next) => {
        const userId = req.params.userId;
        const user = userService.getUserById(userId);


        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }


        res.json(user);
    },


};


module.exports = UserController;