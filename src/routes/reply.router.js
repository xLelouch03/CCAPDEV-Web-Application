import express from 'express';
import ReplyController from '../controllers/reply.controller.js';

const router = express.Router();

// Create new reply
router.post('/establishments/:establishment/reply', ReplyController.createReply);

// Update reply details
router.put('/establishments/:establishment/reply', ReplyController.updateReply);

// Delete a reply
router.delete('/establishments/:establishment/reply', ReplyController.deleteReply);

export default router;