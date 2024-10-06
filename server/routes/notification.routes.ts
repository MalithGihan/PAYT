import express from 'express';
import { authorizRoles, isAuthenticated } from "../middleware/auth";
import { getUserNotifications, createNotification, updateNotification, deleteNotification } from '../controllers/notification.controller';

const notfirouter = express.Router();

notfirouter.get('/notifications', isAuthenticated, getUserNotifications); 
notfirouter.post('/add-notifications',  createNotification);  
notfirouter.put('/notifications/:id', updateNotification); 
notfirouter.delete('/del-notifications/:id', isAuthenticated, deleteNotification); 

export default notfirouter;
