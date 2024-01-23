const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const classRoutes=require("./routes/classRoutes")
const commentRoutes=require("./routes/commentRoutes");
const connection =require("./db");
const {scheduleTaskNotifications}=require('./notification');

dotenv.config();

const app = express();

//middlewares

app.use(cors());
app.use(cors({
  origin: 'https://task-management-frontend-dusky.vercel.app'
}));
app.use(bodyParser.json()); // Use body-parser middleware
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
  


app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/class',classRoutes);
app.use('/tasks', taskRoutes);
app.use('/comments', commentRoutes);




// Add this after defining routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  

// Database Connection
connection().then(() => {

   // Schedule task notifications
    scheduleTaskNotifications();
    // Start the server only after successful database connection
    const port = process.env.PORT || 5001;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
  }).catch(err => {
    console.error("Error connecting to the database:", err);
  });
  
