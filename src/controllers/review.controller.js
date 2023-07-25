import Review from '../models/review.model.js';
import ReplyController from './reply.controller.js';

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

    // Get all reviews of an establishment and populate their reply attribute
    getReviews: async (id) => {
        try {
            const reviews = await Review.find({ establishment: id }).populate(['reply', 'user']);
            if (!reviews.length) console.log(`No matching reviews found for establishment ${id}`);
            return reviews;
        } catch (err) {
            throw err;
        }
    },

    // Update a review by its associated user and establishment
    updateReview: async (req, res) => {
        const { user } = req.params;
        const { establishment } = req.params;
        const { title } = req.body;
        const { rating } = req.body;
        const { body } = req.body;

        const filter = { user, establishment };
        const update = { $set: { title, rating, body } };

        try {
            const review = await Review.updateOne(filter, update);
            if (review.nModified == 0) return res.status(404).send({ message: "Review not found or not updated" });
            res.send(review);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // Delete a review by its associated user and establishment
    deleteReview: async (req, res) => {
        const { user } = req.params;
        const { establishment } = req.params;

        const query = { user, establishment };
    
        try {
            const result = await Review.findOneAndDelete(query);
            if (!result) return res.status(404).send({ message: "Review not found" });
            res.send({ message: "Review deleted successfully" });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // Assign replies to each review
    assignReplies: async () => {
        try {
            const reviews = await Review.find({}); // Get all reviews

            // Loop through the reviews
            for (let i = 0; i < reviews.length; i++) {
                // Use getReply() to find the reply associated with the review
                const reply = await ReplyController.getReply(reviews[i]._id);
                
                // If a reply is found, assign it to the review
                if (reply) {
                    reviews[i].reply = reply._id;
                    await reviews[i].save();
                }
            }
        } catch (err) {
            throw err;
        }
    }
};

export default ReviewController;