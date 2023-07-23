import Review from '../models/review.model.js';

const ReviewController = {
    // Create a new review
    createReview: async (req, res) => {
        const { user, establishment, rating, title, body } = req.body;
        try {
            const review = new Review({ user, establishment, rating, title, body });
            await review.save();
            res.status(201).send(review);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // Get a review by its id
    getReview: async (req, res) => {
        const { id } = req.params;
        try {
            const review = await Review.findById(id);
            if (!review) return res.status(404).send({ message: "Review not found" });
            res.send(review);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // Update a review by its id
    updateReview: async (req, res) => {
        const { id } = req.params;
        try {
            const review = await Review.findByIdAndUpdate(id, req.body, { new: true });
            if (!review) return res.status(404).send({ message: "Review not found" });
            res.send(review);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // Delete a review by its id
    deleteReview: async (req, res) => {
        const { id } = req.params;
        try {
            const review = await Review.findByIdAndDelete(id);
            if (!review) return res.status(404).send({ message: "Review not found" });
            res.send(review);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    }
};

export default ReviewController;