const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/User');
const {Admin} =require("../models/Admin")
const {ProjectManager}=require("../models/Projectmanager")
const authUtils = require('../utils/authUtils');
const passwordRegex = /^(?![0-9]+$)[A-Za-z0-9]+$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userregister = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists. Please choose a different one.' });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must contain a combination of letters and numbers.' });
    }
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      email,
      role: 'member',
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};


const managerregister = async (req, res) => {
          try {

            const { username, password, email} = req.body;
           
            if (!passwordRegex.test(password)) {
              return res.status(400).json({ message: 'Password must contain a combination of letters and numbers.' });
            }
            
            if (!emailRegex.test(email)) {
              return res.status(400).json({ message: 'Please provide a valid email.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new ProjectManager({
              username,
              password: hashedPassword,
              email,
              role:'projectManager',
            });

            await user.save();

            res.status(201).json({ message: 'Project Manager registered successfully' });
          } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
          }
};

const adminregister = async (req, res) => {
 
            try {
              console.log('Received data:', req.body);
              const { username, password, email } = req.body;
             
              if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
              }

              if (!passwordRegex.test(password)) {
                return res.status(400).json({ message: 'Password must contain a combination of letters and numbers.' });
              }
              
              if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Please provide a valid email.' });
              }

              const hashedPassword = await bcrypt.hash(password, 10);

              const user = new Admin({
                username,
                password: hashedPassword,
                email,
                role: 'admin',
              });

              await user.save();

              res.status(201).json({ message: 'Admin registered successfully' });
            } catch (error) {
              console.error('Error during admin registration:', error);
              res.status(500).json({ message: error.message || 'Internal server error' });
            }
};


const userlogin = async (req, res) => {
                  try {
                    const { username, password } = req.body;

                    const user = await User.findOne({ username });

                    if (!user || !(await bcrypt.compare(password, user.password))) {
                      return res.status(401).json({ message: 'Invalid credentials' });
                    }

                    const token = authUtils.generateToken(user);

                    res.status(200).json({ token });
                  } catch (error) {
                    res.status(500).json({ message: 'Internal server error' });
                  }
};

const managerlogin = async (req, res) => {
                    try {
                      const { username, password } = req.body;
                      console.log('Received data:', req.body);

                      const user = await ProjectManager.findOne({ username });
                      console.log('user', user);
                      console.log('userrole', user.role);

                      if (!user || !(await bcrypt.compare(password, user.password))) {
                        return res.status(401).json({ message: 'Invalid credentials' });
                      }

                      const token = authUtils.generateToken(user);

                      res.status(200).json({ token });
                    } catch (error) {
                      res.status(500).json({ message: 'Internal server error' });
                    }
};

const adminlogin = async (req, res) => {
                try {
                  const { username, password } = req.body;

                  const user = await Admin.findOne({ username });

                  if (!user || !(await bcrypt.compare(password, user.password))) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                  }

                  const token = authUtils.generateToken(user);

                  res.status(200).json({ token });
                } catch (error) {
                  res.status(500).json({ message: 'Internal server error' });
                }
};

const getAdminName = async (req, res) => {
  try {
    // Assuming the authenticated user (admin) is available in req.user
    const admin = req.user;

    if (!admin) {
      return res.status(404).send({ message: 'Admin not found' });
    }

    res.status(200).send({ username: admin.username });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getUserName = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send({ username: user.username });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getUserRole = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send({ role: user.role, _id: user._id });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


const getProjectManager = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { username: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await ProjectManager.find(keyword).select('username');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//reffered user
const getAllMember = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { username: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).select('username');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { userregister,managerregister,adminregister, userlogin,managerlogin,adminlogin, getAdminName,getProjectManager,getAllMember, getUserName, getUserRole};
