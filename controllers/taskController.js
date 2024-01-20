const Project = require('../models/Project');
const { ProjectManager } = require('../models/Projectmanager');
const {User} =require('../models/User')
const Notification =require('../models/Notification')

const mongoose = require('mongoose');
const isValidObjectId = mongoose.isValidObjectId;


const addUsersToTaskByUser = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const classId = req.params.classId;
    const taskId = req.params.taskId;
    const currentUser = req.user;
    const { assignedUsers } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const foundClass = project.classes.find(cls => cls._id.equals(classId));

    if (!foundClass) {
      return res.status(404).json({ message: 'Class not found in the project' });
    }

    const foundTask = foundClass.tasks.find(task => task._id.equals(taskId));

    if (!foundTask) {
      return res.status(404).json({ message: 'Task not found in the class' });
    }


    // Check if the user is a member of the class
const isUserInClass = foundClass.assignedUsers.some(user => user.userId.equals(req.user._id));

if (!isUserInClass) {
  return res.status(403).json({ message: 'Unauthorized: You are not a member of this class' });
}

// Fetch all users from the User collection who are in the same class
const usersInSameClass = foundClass.assignedUsers;

console.log("Users In same class", usersInSameClass);

// Add assigned users to the task using only the username
if (assignedUsers && Array.isArray(assignedUsers)) {
  assignedUsers.forEach(username => {
    // Find the user based on the username
    const assignedUser = usersInSameClass.find(user => user.username === username);

    

    if (assignedUser) {
      // Check if the user is not already assigned to the task
      const isUserAlreadyInTask = foundTask.assignedUsers.some(user => user.userId.equals(assignedUser.userId));
      console.log("Is user already in the task?", isUserAlreadyInTask);

      if (!isUserAlreadyInTask) {
        foundTask.assignedUsers.push({
          userId: assignedUser.userId,
          username: assignedUser.username,
        });
      }
    } else {
      console.log("User not found with the specified username:", username);
    }
  });
}
// Save the updated project document
await project.save();

    res.status(200).json({ message: 'Users added to task successfully', task: foundTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const editTaskDetails = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const classId = req.params.classId;
    const taskId = req.params.taskId;
    const userId = req.user._id; // Assuming you have the user ID in req.user

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const foundClass = project.classes.find(cls => cls._id.equals(classId));

    if (!foundClass) {
      return res.status(404).json({ message: 'Class not found in the project' });
    }

    const foundTask = foundClass.tasks.find(task => task._id.equals(taskId));

    if (!foundTask) {
      return res.status(404).json({ message: 'Task not found in the class' });
    }

    // Check if the user is assigned to the task
    const isUserAssignedToTask = foundTask.assignedUsers.some(user => user.userId.equals(userId));

    if (!isUserAssignedToTask) {
      return res.status(403).json({ message: 'Unauthorized: You are not assigned to this task' });
    }

    // Now, you can proceed with editing the title and description
    const { title, description } = req.body;

    // Update task details
    foundTask.title = title;
    foundTask.description = description;

    // Save the updated project document
    await project.save();

    res.status(200).json({ message: 'Task details updated successfully', task: foundTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const updateDueDate = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const classId = req.params.classId;
    const taskId = req.params.taskId;
    const userId = req.user._id; // Assuming you have the user ID in req.user

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const foundClass = project.classes.find(cls => cls._id.equals(classId));

    if (!foundClass) {
      return res.status(404).json({ message: 'Class not found in the project' });
    }

    const foundTask = foundClass.tasks.find(task => task._id.equals(taskId));

    if (!foundTask) {
      return res.status(404).json({ message: 'Task not found in the class' });
    }

    // Check if the user is assigned to the task
    const isUserAssignedToTask = foundTask.assignedUsers.some(user => user.userId.equals(userId));

    if (!isUserAssignedToTask) {
      return res.status(403).json({ message: 'Unauthorized: You are not assigned to this task' });
    }

    // Now, you can proceed with updating the due date
    const { dueDate } = req.body;

    // Update due date
    foundTask.dueDate = dueDate;

    // Save the updated project document
    await project.save();

    res.status(200).json({ message: 'Due date updated successfully', task: foundTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const updateTaskStatus = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const classId = req.params.classId;
    const taskId = req.params.taskId;
    const userId = req.user._id; // Assuming you have the user ID in req.user

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const foundClass = project.classes.find(cls => cls._id.equals(classId));

    if (!foundClass) {
      return res.status(404).json({ message: 'Class not found in the project' });
    }

    const foundTask = foundClass.tasks.find(task => task._id.equals(taskId));

    if (!foundTask) {
      return res.status(404).json({ message: 'Task not found in the class' });
    }

    // Check if the user is assigned to the task
    const isUserAssignedToTask = foundTask.assignedUsers.some(user => user.userId.equals(userId));

    if (!isUserAssignedToTask) {
      return res.status(403).json({ message: 'Unauthorized: You are not assigned to this task' });
    }

    // Now, you can proceed with updating the task status
    const { status } = req.body;
   

    console.log("Status",status)
    // Update task status
    foundTask.status = status;

    // Save the updated project document
    await project.save();

    

    if (status == 'completed') {
      // Generate notification for task completion
      const notificationMessage = `Task "${foundTask.title}" has been completed.`;
      const notification = new Notification({ userId, message: notificationMessage });
      await notification.save();
    
      res.status(200).json({ message: 'Task status updated to completed', task: foundTask });
    } else {
      res.status(200).json({ message: 'Task status updated successfully', task: foundTask });
    }
        
  } 
  
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const deleteTask = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const classId = req.params.classId;
    const taskId = req.params.taskId;
    const userId = req.user._id; // Assuming you have the user ID in req.user

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const foundClass = project.classes.find(cls => cls._id.equals(classId));

    if (!foundClass) {
      return res.status(404).json({ message: 'Class not found in the project' });
    }

    const foundTaskIndex = foundClass.tasks.findIndex(task => task._id.equals(taskId));

    if (foundTaskIndex === -1) {
      return res.status(404).json({ message: 'Task not found in the class' });
    }

    const foundTask = foundClass.tasks[foundTaskIndex];

    // Check if the user is assigned to the task
    const isUserAssignedToTask = foundTask.assignedUsers.some(user => user.userId.equals(userId));

    if (!isUserAssignedToTask) {
      return res.status(403).json({ message: 'Unauthorized: You are not assigned to this task' });
    }

    // Remove the task from the class
    foundClass.tasks.splice(foundTaskIndex, 1);

    // Save the updated project document
    await project.save();

    res.status(200).json({ message: 'Task deleted successfully', task: foundTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




  module.exports=
  {
    addUsersToTaskByUser,
    editTaskDetails,
    updateDueDate,
    updateTaskStatus,
    deleteTask
  }