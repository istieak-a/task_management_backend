

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



const verifyAdminManagerToken = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey');

    const userType = decoded.role;
    console.log('usertype', userType);

    let user;
    switch (userType) {
      case 'admin':
        user = await Admin.findById(decoded.id);
        break;
      case 'projectManager':
        user = await ProjectManager.findById(decoded.id);
        break;
      default:
        return res.status(401).json({ message: 'Unauthorized: Invalid user type' });
    }
    console.log('user', user);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User(AdminManager) not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};



const verifyManagerUserToken = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey');

    const userType = decoded.role;
    console.log('usertype', userType);

    let user;
    switch (userType) {
      case 'projectManager':
        user = await ProjectManager.findById(decoded.id);
        break;
      case 'user':
        user = await User.findById(decoded.id);
        break;
      default:
        return res.status(401).json({ message: 'Unauthorized: Invalid user type' });
    }
    console.log('user', user);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User(ManagerMember) not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};



const verifyAdminUserToken = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey');

    const userType = decoded.role;
    console.log('usertype', userType);

    let user;
    switch (userType) {
      case 'admin':
        user = await Admin.findById(decoded.id);
        break;
      case 'user':
        user = await User.findById(decoded.id);
        break;
      default:
        return res.status(401).json({ message: 'Unauthorized: Invalid user type' });
    }
    console.log('user', user);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User(AdminMember)  not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

const verifyAdminManagerUserToken = async (req, res, next) => {
  // Verify if the user is an admin, a manager, or a user
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey');

    const userType = decoded.role; // Assuming roles in the token represent the user type
    console.log('usertypeAMU', userType);

    let user;
    switch (userType) {
      case 'admin':
        user = await Admin.findById(decoded.id);
        break;
      case 'projectManager':
        user = await ProjectManager.findById(decoded.id);
        break;
      case 'user':
        user = await User.findById(decoded.id);
        break;
      default:
        return res.status(401).json({ message: 'Unauthorized: Invalid user type' });
    }
    console.log('user detail', user);
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


module.exports = { verifyuserToken,
  verifymanagerToken,
  verifyadminToken,  
  verifyAdminManagerToken,
  verifyAdminUserToken,
  verifyManagerUserToken,
  verifyAdminManagerUserToken };
