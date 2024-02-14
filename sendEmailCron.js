const cron = require('node-cron');
const nodemailer = require('nodemailer');
const UserController = require('./controllers');


const sendEmailNotification = async (recipient, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: 'r.singhwork2412@gmail.com',
              pass: 'hnbh fthx weot ktip',
            },
          });
 
      const mailOptions = {
        from: 'r.singhwork2412@gmail.com',
        to: recipient,
        subject: subject,
        text: message,
      };
 
      await transporter.sendMail(mailOptions);
      console.log('Email notification sent successfully');
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  };
 
 
cron.schedule('* * * * *', async () => {
    console.log('Running cron job to send email notifications for expiring plans...');
    await UserController.expiringPlansController();
  });
  module.exports = {sendEmailNotification};