const Project = require('../models/Project');
const { ProjectManager } = require('../models/Projectmanager');
const {User} =require('../models/User')

const mongoose = require('mongoose');
const isValidObjectId = mongoose.isValidObjectId;





const createClass = async (req, res) => {
  try {

    const { name } = req.body;
    const { projectId } = req.params;
    const manager = req.user; // Assuming you have authentication middleware

    // Find the project
    const project = await Project.findOne({ _id: projectId, 'projectManagers._id': manager._id });

    if (!project) {
      return res.status(403).json({ message: 'Unauthorized: You are not assigned to this project' });
    }
    // Check if a class with the same name already exists
    const existingClass = project.classes.find(cls => cls.name === name);

    if (existingClass) {
      return res.status(400).json({ message: 'Class with the same name already exists in the project' });
    }

    // Create a new class
    const newClass = {
      name,
      tasks: [],
      createdBy_ProjectManager: {
        userId: manager._id,
        username: manager.username,
      },
      assignedMembers: [], // Initially, no assigned members
    };

    // Add the new class to the project
    project.classes.push(newClass);

    // Save the updated project document
    await project.save();

    res.status(201).json({ message: 'Class created successfully', project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to edit a class
const editClass = async (req, res) => {
    try {
      const { name } = req.body;
      const { projectId, classId } = req.params;
      const manager = req.user; // Assuming you have authentication middleware
     console.log("class id",classId);
      // Find the project
      const project = await Project.findOne({ _id: projectId, 'projectManagers._id': manager._id });
  
      if (!project) {
        return res.status(403).json({ message: 'Unauthorized: You are not assigned to this project' });
      }
  
      // Find the class to edit
      const targetClass = project.classes.find((c) => c._id.toString() === classId);
  
      if (!targetClass) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      // Update class details
      targetClass.name = name || targetClass.name; // Update if provided, otherwise keep the existing value
     // targetClass.assignedMembers = assignedMembers || targetClass.assignedMembers;
  
      // Save the updated project document
      await project.save();
  
      res.status(200).json({ message: 'Class updated successfully', project });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Controller function to delete a class
const deleteClass = async (req, res) => {
    try {
      const { projectId, classId } = req.params;
      const manager = req.user; // Assuming you have authentication middleware
  
      // Find the project
      const project = await Project.findOne({ _id: projectId, 'projectManagers._id': manager._id });
  
      if (!project) {
        return res.status(403).json({ message: 'Unauthorized: You are not assigned to this project' });
      }
  
      // Find the index of the class to delete
      const classIndex = project.classes.findIndex((c) => c._id.toString() === classId);
  
      if (classIndex === -1) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      // Remove the class from the array
      project.classes.splice(classIndex, 1);
  
      // Save the updated project document
      await project.save();
  
      res.status(200).json({ message: 'Class deleted successfully', project });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
// Controller function to get all classes by manager
const getAllClassesByManager = async (req, res) => {
    try {
      const { projectId } = req.params;
      const manager = req.user; // Assuming you have authentication middleware
  
      // Find the project
      const project = await Project.findOne({ _id: projectId, 'projectManagers._id': manager._id })
        .select('classes');
  
      if (!project) {
        return res.status(403).json({ message: 'Unauthorized: You are not assigned to this project' });
      }
  
      res.status(200).json({ classes: project.classes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Controller function to get a particular class by ID
const getClassById = async (req, res) => {
    try {
      const { projectId, classId } = req.params;
      const manager = req.user; // Assuming you have authentication middleware
  
      // Find the project
      const project = await Project.findOne({ _id: projectId, 'projectManagers._id': manager._id });
  
      if (!project) {
        return res.status(403).json({ message: 'Unauthorized: You are not assigned to this project' });
      }
  
      // Find the class by ID
      const selectedClass = project.classes.id(classId);
  
      if (!selectedClass) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      res.status(200).json({ selectedClass });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const addUsersToClass = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const classId = req.params.classId;
      const projectManager = req.user;
      const { addedUsers } = req.body;
  
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      const foundClass = project.classes.find(cls => cls._id.equals(classId));
  
      if (!foundClass) {
        return res.status(404).json({ message: 'Class not found in the project' });
      }
  
      // Fetch all users from the User collection
      const allUsers = await User.find({});
  
      // Extract valid user IDs and usernames from addedUsers
      const validAddedUsers = [];
  
      for (const username of addedUsers) {
        const user = allUsers.find(u => u.username === username);
  
        if (user) {
          validAddedUsers.push({
            userId: user._id,
            username: user.username,
          });
        }
      }
  
      // Add valid users to the class
      foundClass.assignedUsers = [...new Set([...foundClass.assignedUsers, ...validAddedUsers])];
  
      await project.save();
  
      res.status(200).json({ message: 'Users added to class successfully', class: foundClass });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const deleteUsersFromClass = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const classId = req.params.classId;
      const projectManager = req.user;
      const { deletedUsers } = req.body;
  
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      const foundClass = project.classes.find(cls => cls._id.equals(classId));
  
      if (!foundClass) {
        return res.status(404).json({ message: 'Class not found in the project' });
      }
  
      // Remove users from the class by username
      foundClass.assignedUsers = foundClass.assignedUsers.filter(
        user => !deletedUsers.includes(user.username)
      );
  
      await project.save();
  
      res.status(200).json({ message: 'Users deleted from class successfully', class: foundClass });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const getAllUsersInClass = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const classId = req.params.classId;
      const projectManager = req.user;
  
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      const foundClass = project.classes.find(cls => cls._id.equals(classId));
  
      if (!foundClass) {
        return res.status(404).json({ message: 'Class not found in the project' });
      }
  
      res.status(200).json({ users: foundClass.assignedUsers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };



  const addTaskToClass = async (req, res) => {
    try {
       
      const projectId=req.params.projectId;  
      const classId = req.params.classId;
      const projectManager = req.user;

      const project = await Project.findById(projectId);

        if (!project) {
        return res.status(404).json({ message: 'Project not found' });
        }
      
      const { title, description, dueDate, assignedUsers } = req.body.taskDetails;
      
      // Check if the project manager is assigned to the class
      const foundClass = project.classes.find(cls => cls._id.equals(classId));
  
      if (!foundClass) {
        return res.status(403).json({ message: 'Unauthorized: You are not assigned to this class' });
      }
    
      // Check if a task with the same title already exists in the class
    const existingTask = foundClass.tasks.find(task => task.title === title);

    if (existingTask) {
      return res.status(400).json({ message: 'Task with the same title already exists in the class' });
    }
      // Create a new task
      const newTask = {
        title,
        description,
        dueDate,
        assignedUsers: [],
        status: 'todo', // You can set a default status or modify based on your requirements
        assignedBy: {
          userId: projectManager._id,
          username: projectManager.username,
        },
      };
  
      // Add assigned users to the task
if (assignedUsers && Array.isArray(assignedUsers)) {
  // Fetch all users from the User collection
  const allUsers = await User.find({});

  assignedUsers.forEach(username => {
    // Find the user based on the username
    const assignedUser = allUsers.find(user => user.username === username);
  //  const isUserAlreadyInTask = foundTask.assignedUsers.some(user => user.userId.equals(assignedUser._id));

    if (assignedUser) {
      newTask.assignedUsers.push({
        userId: assignedUser._id,
        username: assignedUser.username,
      });

      // Add to class only if not already present
      const isUserAlreadyInClass = foundClass.assignedUsers.some(user => user.userId.equals(assignedUser._id));
      if (!isUserAlreadyInClass) {
        foundClass.assignedUsers.push({
          userId: assignedUser._id,
          username: assignedUser.username,
        });
      }
    }
  });
}

// Add the new task to the class
foundClass.tasks.push(newTask);

// Save the updated project document
await project.save();

  
      res.status(200).json({ message: 'Task added to class successfully', task: newTask });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };




  const editTaskInClass = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const classId = req.params.classId;
      const taskId = req.params.taskId;
      const projectManager = req.user;
  
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      // Check if the project manager is assigned to the class
      const foundClass = project.classes.find(cls => cls._id.equals(classId));
  
      if (!foundClass) {
        return res.status(403).json({ message: 'Unauthorized: You are not assigned to this class' });
      }
  
      // Check if the task exists in the class
      const foundTask = foundClass.tasks.find(task => task._id.equals(taskId));
  
      if (!foundTask) {
        return res.status(404).json({ message: 'Task not found in the class' });
      }
  
      const { title, description, dueDate } = req.body.updatedDetails;
  
      // Update task details
      foundTask.title = title;
      foundTask.description = description;
      foundTask.dueDate = dueDate;
  
      // Save the updated project document
      await project.save();
  
      res.status(200).json({ message: 'Task details updated successfully', task: foundTask });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  
  const deleteTaskFromClass = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const classId = req.params.classId;
      const taskId = req.params.taskId;
      const projectManager = req.user;
  
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      // Check if the project manager is assigned to the class
      const foundClass = project.classes.find(cls => cls._id.equals(classId));
  
      if (!foundClass) {
        return res.status(403).json({ message: 'Unauthorized: You are not assigned to this class' });
      }
  
      // Check if the task exists in the class
      const taskIndex = foundClass.tasks.findIndex(task => task._id.equals(taskId));
  
      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found in the class' });
      }
  
      // Remove the task from the array
      foundClass.tasks.splice(taskIndex, 1);
  
      // Save the updated project document
      await project.save();
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const getAllTasksInClass = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const classId = req.params.classId;
        const projectManager = req.user;

        

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if the project manager is assigned to the class
        const foundClass = project.classes.find(cls => cls._id.equals(classId));

        
        if (!foundClass) {
            return res.status(404).json({ message: 'Unauthorized: You are not assigned to this class' });
        }

        if (!foundClass.tasks || foundClass.tasks.length === 0) {
            console.log("Tasks not found in the class");
            return res.status(404).json({ message: 'Task not found in the class' });
        }

        res.status(200).json({ tasks: foundClass.tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

  const getTaskByIdFromClass = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const classId = req.params.classId;
      const taskId = req.params.taskId;
      const projectManager = req.user;
  
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      // Check if the project manager is assigned to the class
      const foundClass = project.classes.find(cls => cls._id.equals(classId));
  
      if (!foundClass) {
        return res.status(404).json({ message: 'Unauthorized: You are not assigned to this class' });
      }
  
      // Find the task by id in the class
      const foundTask = foundClass.tasks.find(task => task._id.equals(taskId));
  
      if (!foundTask) {
        return res.status(404).json({ message: 'Task not found in the class' });
      }
  
      res.status(200).json({ task: foundTask });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


 

const addUsersToTask = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const classId = req.params.classId;
      const taskId = req.params.taskId;
      const projectManager = req.user;
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
     console.log("Task name",foundTask.title);

     
    

              
                  // Add assigned users to the task
            if (assignedUsers && Array.isArray(assignedUsers)) {
              // Fetch all users from the User collection
              const allUsers = await User.find({});

              assignedUsers.forEach(username => {
                // Find the user based on the username
                const assignedUser = allUsers.find(user => user.username === username);
                const isUserAlreadyInTask = foundTask.assignedUsers.some(user => user.userId.equals(assignedUser._id));

                if (!isUserAlreadyInTask) {
                  foundTask.assignedUsers.push({
                    userId: assignedUser._id,
                    username: assignedUser.username,
                  });

                  // Add to class only if not already present
                  const isUserAlreadyInClass = foundClass.assignedUsers.some(user => user.userId.equals(assignedUser._id));
                  if (!isUserAlreadyInClass) {
                    foundClass.assignedUsers.push({
                      userId: assignedUser._id,
                      username: assignedUser.username,
                    });
                  }
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


  
  const deleteUsersFromTask = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const classId = req.params.classId;
      const taskId = req.params.taskId;
      const projectManager = req.user;
      const { usersToDelete } = req.body;
  
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
  
      // Extract user IDs to be deleted from the task
      const usersToDeleteIds = usersToDelete.map(username => {
        const userToDelete = foundTask.assignedUsers.find(user => user.username === username);
        return userToDelete ? userToDelete.userId : null;
      });
  
      // Filter out null values from usersToDeleteIds
      const validUsersToDeleteIds = usersToDeleteIds.filter(id => id !== null);
  
      // Remove user IDs from the assignedUsers array
      foundTask.assignedUsers = foundTask.assignedUsers.filter(user => !validUsersToDeleteIds.includes(user.userId));
  
      await project.save();
  
      res.status(200).json({ message: 'Users deleted from task successfully', task: foundTask });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  const getAllUsersInTask = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const classId = req.params.classId;
        const taskId = req.params.taskId;
        const projectManager = req.user;

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

        // Extract user details from the assignedUsers array
        const usersInTask = foundTask.assignedUsers.map(user => ({
            userId: user.userId,
            username: user.username,
        }));

        res.status(200).json({ usersInTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

  
  
  
  
  
  

module.exports = {
  createClass,
   editClass,
   deleteClass,
   getAllClassesByManager,
   getClassById,
   addTaskToClass,
   editTaskInClass,
   deleteTaskFromClass,
   getTaskByIdFromClass,
   getAllTasksInClass,
   addUsersToTask,
   deleteUsersFromTask,
   addUsersToClass,
   deleteUsersFromClass,
   getAllUsersInClass,
   getAllUsersInTask


};

