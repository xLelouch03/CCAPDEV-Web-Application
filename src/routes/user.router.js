import express from 'express';
import UserController from '../controllers/user.controller.js';
import multer from 'multer';
import User from '../models/user.model.js';

const userRouter = express.Router();
const upload = multer({ dest: 'static/images' });

// Account-related
userRouter.post('/register-user', UserController.createUser);
userRouter.post('/login-user', UserController.loginUser);

// Get user details
// userRouter.get('/:username', UserController.getUser);
userRouter.get('/users', UserController.getAllUsernames);

// Delete a user
// userRouter.delete('/:username', UserController.deleteUser);

//userRouter.put('/api/update-user/:username', UserController.updateUser);

userRouter.get('/profile/:userId', async (req, res) => {
    const userId = req.params.userId;
    
    try {
        // Fetch user data from MongoDB collection using Mongoose
        const profileData = await User.findById(userId);
    
        // Render the Handlebars template and pass the fetched data as context
        res.render('template', { profileData });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Error fetching user data');
    }
      
});

export default userRouter;