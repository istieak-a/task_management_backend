const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/User');
const {Admin} =require("../models/Admin")
const {ProjectManager}=require("../models/Projectmanager")
const authUtils = require('../utils/authUtils');

const userregister = async (req, res) => {
            try {

                const { username, password} = req.body;
                

                const hashedPassword = await bcrypt.hash(password, 10);

                const user = new User({
                  username,
                  password: hashedPassword,
                
                });

                await user.save();

                res.status(201).json({ message: 'User registered successfully' });
              } catch (error) {
                res.status(500).json({ message: 'Internal server error' });
              }
};

const managerregister = async (req, res) => {
          try {

            const { username, password} = req.body;
           

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new ProjectManager({
              username,
              password: hashedPassword,
            
            });

            await user.save();

            res.status(201).json({ message: 'Project Manager registered successfully' });
          } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
          }
};

const adminregister = async (req, res) => {
 
            try {

              const { username, password } = req.body;
             

              const hashedPassword = await bcrypt.hash(password, 10);

              const user = new Admin({
                username,
                password: hashedPassword,
              
              });

              await user.save();

              res.status(201).json({ message: 'Admin registered successfully' });
            } catch (error) {
              res.status(500).json({ message: 'Internal server error' });
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

                      const user = await ProjectManager.findOne({ username });

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


module.exports = { userregister,managerregister,adminregister, userlogin,managerlogin,adminlogin};
