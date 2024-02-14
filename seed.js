const mongoose = require('mongoose');
const User = require('./models/users');
const Plan = require('./models/plans');
const Transaction = require('./models/transactions');
 
// Connect to MongoDB
mongoose.connect('mongodb+srv://riya:Riya_12345@cluster0.u0xz4bw.mongodb.net/MyAirtel?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
 
 
// insert sample data
const insertSampleData = async () => {
    try {
       // const usersData = [
            // {
            //     username: 'ria_sng',
            //     email: 'ria@gmail.com',
            //     password: 'hashedpassword124', 
            //     firstName: 'Riya',
            //     lastName: 'Singh',
            //     phoneNumber: '123-456-7674',
            //     address: '37B Block Street, Maryland',
            //     plans:[]
 
            // },
            // {
            //     username: 'jane_smith',
            //     email: 'jane.smith@example.com',
            //     password: 'password456',
            //     firstName: 'Jane',
            //     lastName: 'Smith',
            //     phoneNumber: '9876543210',
            //     address: '456 Oak St, Townsville',
            //     plans: [], // Empty plans array for now
            //   },
        //       {
        //         username: 'john_doe',
        //         email: 'john.doe@example.com',
        //         password: 'password123',
        //         firstName: 'John',
        //         lastName: 'Doe',
        //         phoneNumber: '1234567890',
        //         address: '123 Main St, Cityville',
        //         plans: [], 
        //       },
        // ];
 
       
        const plansData = [
            // {
            //     planCode: 'plan_01_2M',
            //     planName: 'Truly Unlimited',
            //     description: 'Unlimited Talktime + 5GB/day data',
            //     validity: 60,
            //     dataLimit: 5,
            //     talktimeLimit:null,
            //     smsLimit: null,
            //     price: 50,
            // },
           
            // {
            //     planCode: 'plan_02_2M',
            //     planName: 'Basic Plan',
            //     description: 'A simple plan with basic features',
            //     validity: 30, // Validity in days
            //     dataLimit: 5, // Data limit in GB
            //     talktimeLimit: 100, // Talktime limit in minutes
            //     price: 10, // Price in dollars
            //   },

              {
                planCode: 'plan_03_2]6M',
                planName: 'Premium Plan',
                description: 'A premium plan with advanced features',
                validity: 60, // Validity in days
                dataLimit: 10, // Data limit in GB
                talktimeLimit: 200, // Talktime limit in minutes
                price: 20, // Price in dollars
              },
        ];
 
        // user insertion
        // const insertedUsers = await User.insertMany(usersData);
        // console.log('Inserted Users:', insertedUsers);
 
      
        const insertedPlans = await Plan.insertMany(plansData);
        console.log('Inserted Plans:', insertedPlans);
 
        //  obtained userId and planId from the previously saved users and plans
        const userId = insertedUsers[0]._id;
        const planId = insertedPlans[0]._id;
 
       
        // const transactionsData = [
        //     {
        //         user: userId,
        //         plan: planId,
        //         amount: 20,
        //     },
            
        // ];
 
        // // Insert transactions
        // const insertedTransactions = await Transaction.insertMany(transactionsData);
        // console.log('Inserted Transactions:', insertedTransactions);
    } catch (error) {
        console.error('Error inserting sample data:', error.message);
    } finally {
        // Disconnect from MongoDB
        mongoose.connection.close();
    }
};
 

insertSampleData();
 