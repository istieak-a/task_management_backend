const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    role: user.role,
  };

  const options = {
    expiresIn: '24h', // Token expires in 1 hour. Adjust as needed.
  };

  const secretKey = process.env.JWT_SECRET || 'o8aSNBnCEwiSEi7S0DUqJ1vYXvH3CqRl'; // Replace with your secret key.

  return jwt.sign(payload, secretKey, options);
};

module.exports = { generateToken };
