import express from 'express';
import ReviewController from '../controllers/review.controller.js';

const router = express.Router();

// Create new review
router.post('/', ReviewController.createReview);

// Get review details
router.get('/:id', ReviewController.getReview);

// Update review details
router.put('/:id', ReviewController.updateReview);

// Delete a review
router.delete('/:id', ReviewController.deleteReview);

export default router;