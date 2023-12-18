

const jwt = require('jsonwebtoken');
const {User} = require('../models/User');
const {Admin} =require("../models/Admin")
const {ProjectManager}=require("../models/Projectmanager")

const verifyuserToken = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

const verifymanagerToken = async (req, res, next) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey');
      const manager = await ProjectManager.findById(decoded.id);
  
      if (!manager) {
        return res.status(401).json({ message: 'Unauthorized: Project Manager not found' });
      }
  
      req.user = manager;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };


const verifyadminToken = async (req, res, next) => {
    const token = req.header('Authorization');
    
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey');
      const admin = await Admin.findById(decoded.id);
  
      if (!admin) {
        return res.status(401).json({ message: 'Unauthorized: Admin not found' });
      }
  
      req.user = admin;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };

module.exports = { verifyuserToken,verifymanagerToken,verifyadminToken };
