import express from 'express';
import ReplyController from '../controllers/reply.controller.js';

const router = express.Router();

// Create new reply
router.post('/', ReplyController.createReply);

// Get reply details
router.get('/:id', ReplyController.getReply);

// Update reply details
router.put('/:id', ReplyController.updateReply);

// Delete a reply
router.delete('/:id', ReplyController.deleteReply);

export default router;