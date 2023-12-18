

const Project = require('../models/Project');
const { ProjectManager } = require('../models/Projectmanager');

const mongoose = require('mongoose');
const isValidObjectId = mongoose.isValidObjectId;


const createProject = async (req, res) => {
  try {
    const { name, description, projectManagers } = req.body;
    const admin = req.user; // Assuming user object in request (admin) after authentication

    // Check if the project name is already in use
    const existingProject = await Project.findOne({ name });
    if (existingProject) {
      return res.status(400).json({ message: 'Project name is already in use' });
    }

    // If projectManagers is not provided in the request body, initialize it as an empty array
    const managers = projectManagers || [];

    // Add the new project manager to the projectManagers array
    const newManagers = [];
    for (const managerName of managers) {
      const projectManager = await ProjectManager.findOne({ username: managerName });

      if (projectManager) {
        newManagers.push({
          _id: projectManager._id,
          username: projectManager.username,
          added_by_admin: admin.username,
        });
      }
    }

    const newProject = new Project({
      name,
      description,
      admin: admin._id,
      projectManagers: newManagers, // Initially assigned project managers
      classes: [], // You may need to update this based on your schema
    });

    await newProject.save();

    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



  const updateProjectDetails = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const { name, description } = req.body;
  
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      // Update project details
      project.name = name || project.name; // Update if provided, otherwise keep the existing value
      project.description = description || project.description;
     
      // Save the updated project document
        await project.save();
  
      res.status(200).json({ message: 'Project details updated successfully', project });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const deleteProject = async (req, res) => {
    try {
      const projectId = req.params.projectId;


        // Delete the project by ID
    const deletedProject = await Project.findOneAndDelete({ _id: projectId });

  
      if (!deletedProject) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      res.status(200).json({ message: 'Project deleted successfully', deletedProject });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const getAllProjects = async (req, res) => {
    try {
      const projects = await Project.find()
        .populate({
          path: 'admin',
          select: 'username _id',
        })
        .populate({
          path: 'projectManagers._id',
          select: 'name',
        })
        .populate({
          path: 'classes.tasks.assignedUsers.userId',
          select: 'username _id',
        });
  
      res.status(200).json({ projects });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  

const getProjectById = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const project = await Project.findById(projectId).populate({
        path: 'classes.tasks',
        populate: {
          path: 'assignedMembers.userId',
          select: 'username _id',
        },
      });
      
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      res.status(200).json({ project });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  


  const addProjectManagerToProject = async (req, res) => {
    try {
      const admin = req.user;
      const projectId = req.params.projectId;
      const projectManagerNames = req.body.projectManagerNames; // Change to projectManagerNames (an array)
      const project = await Project.findById(projectId);
  
     
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
     
      // Validate project managers existence
      const existingManagers = await ProjectManager.find({ username: { $in: projectManagerNames } });
      if (existingManagers.length !== projectManagerNames.length) {
        return res.status(400).json({ message: 'One or more project managers are invalid or not project managers' });
      }
  
      // Check if the project managers are already in the projectManagers array
      const existingManagerIds = existingManagers.map(manager => manager._id);
      const isManagerInProject = project.projectManagers.some(manager => existingManagerIds.includes(manager._id));
  
      if (isManagerInProject) {
        return res.status(400).json({ message: 'One or more project managers are already in the project' });
      }
  
      // Add the new project managers to the projectManagers array
      const newManagers = existingManagers.map(manager => ({
        _id: manager._id,
        username: manager.username, // Update to match your actual schema
        added_by_admin: admin.username,
      }));
  
      project.projectManagers.push(...newManagers);
  
      // Save the updated project document
      await project.save();
  
      res.status(200).json({ message: 'Project managers added to project successfully', project });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const removeProjectManagersFromProject = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const { projectManagerNames } = req.body;
  
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      // Extract manager IDs to be deleted from the project
      const managersToDeleteIds = projectManagerNames.map(managerName => {
        const managerToDelete = project.projectManagers.find(manager => manager.username === managerName);
        return managerToDelete ? managerToDelete._id : null;
      });
  
      // Remove manager IDs from the projectManagers array
      project.projectManagers = project.projectManagers.filter(manager => !managersToDeleteIds.includes(manager._id));
  
      // Save the updated project document
      await project.save();
  
      res.status(200).json({
        message: 'Project manager(s) removed successfully',
        project: project,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const getAllProjectManagers = async (req, res) => {
    try {
      const projectManagers = await ProjectManager.find({}, 'username _id');
  
      res.status(200).json({ projectManagers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  const getProjectManagerById = async (req, res) => {
    try {
      const projectManagerId = req.params.projectManagerId;
  
      // Validate if the provided ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(projectManagerId)) {
        return res.status(400).json({ message: 'Invalid project manager ID' });
      }
  
      const projectManager = await ProjectManager.findById(projectManagerId, 'username _id');
  
      if (!projectManager) {
        return res.status(404).json({ message: 'Project manager not found' });
      }
  
      res.status(200).json({ projectManager });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  


module.exports = {
   createProject, 
  getProjectById, 
  getAllProjects ,
  addProjectManagerToProject,
  updateProjectDetails,
  removeProjectManagersFromProject,
  deleteProject,
  getAllProjectManagers,
  getProjectManagerById

};
