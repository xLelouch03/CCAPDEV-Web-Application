import Review from '../models/review.model.js';
import ReplyController from './reply.controller.js';

const ReviewController = {

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
            const reviews = await Review.find({ establishment: id })
                            .sort(sortQuery)
                            .populate([
                                { path: 'reply', populate: { path: 'establishment' } },
                                'user'
                            ]);
            if (!reviews.length) console.log(`No matching reviews found for establishment ${id}`);
            return reviews;
        } catch (err) {
            throw err;
        }
    },

    // Get all reviews of a user and populate their attributes
    getReviewsOfUser: async (id) => {
        try {
            const reviews = await Review.find({ user: id }).populate(['reply', 'user']);
            if (!reviews.length) console.log(`No matching reviews found for user ${id}`);
            return reviews;
        } catch (err) {
            throw err;
        }
    },

    // Find a review given an establishment and a user
    findReview: async (user, establishment) => {
        try {
            const query = { user, establishment };
            const match = await Review.findOne(query);
            return match || null;
        } catch (err) {
            throw err;
        }
    },

    // Create a new review
    createReview: async (user, establishment, rating, title, body) => {
        try {
            const review = new Review({ user, establishment, rating, title, body });
            await review.save();
            console.log("New review created:");
            console.log(review);
            return review;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    // Update a review by its associated user and establishment
    updateReview: async (user, establishment, title, body) => {
        const filter = { user, establishment };
        const update = { $set: { title, body, lastEdited: new Date() } };
        try {
            const status = await Review.updateOne(filter, update);
            if (status.matchedCount === 0) {
                console.log("No review matched for the given user and establishment");
            } else if (status.modifiedCount === 0) {
                console.log("Review remains unchanged");
            }
            return status;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    // Delete a review by its associated user and establishment
    deleteReview: async (user, establishment) => {
        const query = { user, establishment };
        try {
            const status = await Review.deleteMany(query);
            if (status.acknowledged) console.log("Reviews associated with user deleted");
            return status;
        } catch (err) {
            console.error(err);
            throw err;
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
    },

    incrementLike: async (reviewId) => {
        try {
            const review = await Review.findByIdAndUpdate(reviewId, { $inc: { likes: 1 } }, { new: true });
            return review.likes;  // Return the updated like count
        } catch (err) {
            throw err;
        }
    },

    // Increment dislike for a specific review
    incrementDislike: async (reviewId) => {
        try {
            const review = await Review.findByIdAndUpdate(reviewId, { $inc: { dislikes: 1 } }, { new: true });
            return review.dislikes;  // Return the updated dislike count
        } catch (err) {
            throw err;
        }
    }
};



export default ReviewController;