import express from 'express';
import UserController from '../controllers/user.controller.js';

const router = express.Router();

// Create new user
router.post('/', UserController.createUser);

// Get user details
router.get('/:username', UserController.getUser);

// Update user information
router.put('/:username', UserController.updateUser);

// Delete a user
router.delete('/:username', UserController.deleteUser);

export default router;