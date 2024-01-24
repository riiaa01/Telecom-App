const userService = require('./services');
const Plan = require('./models/plans');
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
 
    signupController: (req, res, next) => {
        res.send("List of all plans associated with Riya: <ul><li>airtel xstream</li><li>airtel unlimited</li></ul>");
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
     
        // Validate user and plan (Replace this with your actual validation logic)
        const user = users.find(u => u.id === userId);
        const plan = plans.find(p => p.id === planId);
     
        if (!user || !plan) {
          return res.status(400).json({ error: 'Invalid user or plan' });
        }
     
        // Simulate plan activation (You can add more logic based on your requirements)
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