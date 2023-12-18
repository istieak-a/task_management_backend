const cron = require('node-cron');
const mongoose = require('mongoose');
const Notification = require('./models/Notification'); // Adjust the path as needed

// Import your Task model
const Task = require('./models/Task'); // Adjust the path as needed

const scheduleTaskNotifications = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const currentDate = new Date();
      console.log("Current Date",currentDate)

      // Find overdue tasks
      const overdueTasks = await Task.find({ dueDate: { $lt: currentDate } });
    
      console.log("OverDueTask",overdueTasks);
      // Generate notifications for overdue tasks
      for (const task of overdueTasks) {
        const notificationMessage = `Task "${task.title}" is overdue.`;
        const notification = new Notification({ userId: task.assignedBy.userId, message: notificationMessage, taskId: task._id });
        await notification.save();
      }

      console.log('Task scheduler executed successfully');
    } catch (error) {
      console.error('Error in task scheduler:', error);
    }
  });
};

module.exports = { scheduleTaskNotifications };
