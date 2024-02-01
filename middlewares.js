// const authenticate = (req, res, next) => {
//     //encryption
//     if (req.query.header === 'ria@gmail.com') {
//         next();
//     } else {
//         res.status(401).json({ error: 'Unauthorized' });
//     }
// };
 
// module.exports = authenticate;

// middleware.js

// const authenticate = (req, res, next) => {
//     const authToken = req.headers.authorization;
  
//     if (!authToken) {
//       return res.status(401).json({ error: "Unauthorized - Missing Authorization Header" });
//     }
  
//     // In a real-world scenario, you would validate the authToken against your authentication logic.
//     // For simplicity, let's assume a basic check for demonstration purposes.
//     if (authToken === "Bearer your_token_here") {
//       next(); // Authentication successful, proceed to the next middleware or route handler
//     } else {
//       res.status(401).json({ error: "Unauthorized - Invalid Authorization Token" });
//     }
//   };
  
const jwt = require('jsonwebtoken');
const User = require('./models/users');
const config= require('./config.js');

const authenticate = async (req, res, next) => {
const token = req.headers.authorization;


  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Missing token' });
  }


  try {
    const decoded = jwt.verify(token, config.secretKey);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } 
  catch (err) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};


module.exports = authenticate;
  