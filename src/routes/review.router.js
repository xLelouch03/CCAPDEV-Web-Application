import express from 'express';
import ReviewController from '../controllers/review.controller.js';

const router = express.Router();

// Create new review
router.post('/establishments/:establishment/review', ReviewController.createReview);

// Update review details
router.put('/establishments/:establishment/review', ReviewController.updateReview);

// Delete a review
router.delete('/establishments/:establishment/review', ReviewController.deleteReview);

export default router;