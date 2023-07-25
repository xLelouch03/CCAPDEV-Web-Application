import Review from '../models/review.model.js';
import ReplyController from './reply.controller.js';
import UserController from './user.controller.js';

const ReviewController = {
    // Create a new review
    createReview: async (establishment, rating, title, body) => {
        const user = await UserController.getRandomUserId();
        try {
            const review = new Review({ user, establishment, rating, title, body });
            await review.save();
            console.log("New review created:");
            console.log(review);
            return 1;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    // Get all reviews of an establishment and populate their reply attribute
    getReviews: async (id, sortBy = 'date') => {
        try {
            let sortQuery;
            switch (sortBy) {
                case 'likes':
                    sortQuery = { likes: -1 }; // Descending order
                    break;
                case 'date':
                    sortQuery = { datePosted: -1 }; // Descending order
                    break;
                default:
                    sortQuery = {};
            }
            
            const reviews = await Review.find({ establishment: id }).sort(sortQuery).populate(['reply', 'user']);
            if (!reviews.length) console.log(`No matching reviews found for establishment ${id}`);
            return reviews;
        } catch (err) {
            throw err;
        }
    },


    // Get all reviews of a user and populate their reply attribute
    getReviewsOfUser: async (id) => {
        try {
            const reviews = await Review.find({ user: id }).populate(['reply', 'user']);
            if (!reviews.length) console.log(`No matching reviews found for user ${id}`);
            return reviews;
        } catch (err) {
            throw err;
        }
    },

    // Update a review by its associated user and establishment
    updateReview: async (establishment, title, body, lastEdited) => {
        const user = await UserController.getRandomUserId();

        const filter = { user, establishment };
        const update = { $set: { title, body, lastEdited } };

        try {
            const status = await Review.updateOne(filter, update);
            if(status.nModified != 1) console.log("Review remains unchanged");
            return status.ok;
        } catch (err) {
            console.error(err);
            throw err;
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