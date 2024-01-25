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
            // Extract plan names from the result
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
        const userEmail = req.query.header; // Assuming the user's email is sent in the query parameter
        //const userEmail = req.body;


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
 
            // const associatedPlans = await Promise.all(user.plansAssociated.map(async planId => {
            //     const plan = await Plan.findById(planId);
            //     return {
            //         planName: plan ? plan.planName : 'Unknown Plan',  // Replace 'Unknown Plan' with a default value
            //         // Include other plan details as needed
            //     };
            // }));


            res.json({
                status: 'success',
                message: 'Sign Up Page',
                result: {
                    username: user.username,
                    email: user.email
                },
            });
        } catch (error) {
            console.error('Error fetching user', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },




    userPlansController:async (req, res, next) => {
        const userEmail = req.query.header;
        try {
           
            const user = await User.findOne({ email: userEmail });
           
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }


            const associatedPlans = await Promise.all(user.plansAssociated.map(async planId => {
                const plan = await Plan.findById(planId);
                return {
                    planName: plan ? plan.planName : 'Unknown Plan',  // Replace 'Unknown Plan' with a default value
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
            const { username, planCode } = req.body;
   
            if (!username || !planCode) {
                return res.status(400).json({ error: 'Username and planCode are required' });
            }
   
            const user = await User.findOne({ username });
   
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
   
            const plan = await Plan.findOne({ planCode });
   
            if (!plan) {
                return res.status(404).json({ error: 'Plan not found' });
            }

            if (user.plansAssociated.includes(plan._id)) {
                return res.status(400).json({ error: 'User already has this plan' });
            }else{
                user.plansAssociated.push(plan._id);
                await user.save();
            }
           
            // new transaction
            const transaction = new Transaction({
                user: user._id,
                plan: plan._id,
                amount: plan.price,
            });
            await transaction.save();
   
            // updated plansAssociated for the user
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
       
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
   
         
            const expiringTransactions = await Transaction.find({
                activationDate: { $lte: sevenDaysFromNow },//comparison
            }).populate('user plan');
   
            const expiringPlansDetails = expiringTransactions.map(transaction => {
                const { plan, activationDate, user } = transaction;
               
                // expiration date based on plan's validity
                const expirationDate = new Date(activationDate);
                expirationDate.setDate(expirationDate.getDate() + plan.validity);
   
                const daysUntilExpiration = Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24));
   
                return {
                    planName: plan.planName,
                    expiryDate: expirationDate,
                    daysUntilExpiration: daysUntilExpiration,
                    userDetails: {
                        username: user.username,
                        email: user.email,
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









