import express from 'express';
import UserController from '../controllers/user.controller.js';

const userRouter = express.Router();

// Create new user
userRouter.post('/signup', UserController.createUser);

// Get user details
userRouter.get('/:username', UserController.getUser);

// Update user information
userRouter.put('/:username', UserController.updateUser);

// Delete a user
userRouter.delete('/:username', UserController.deleteUser);

userRouter.post('/login', async (req,res)=>{
    console.log("POST request received for /login");
    try{
        const user = await User.findOne({username: req.body.username});
        if(!user){
            res.status(404).json("User not found.");
            return;
        }

        const isMatch = comparePasswords(req.body.password, user.password)
        if(!isMatch){
            res.status(400).json({message: "Incorrect password."});
            return;
        }
        // req.session.user=user;
        console.log('password match')
        //Respond with the user
        res.sendStatus(200);
    }catch(err){
        res.status(500).json(err);
        return;
    }
});
  

export default userRouter;