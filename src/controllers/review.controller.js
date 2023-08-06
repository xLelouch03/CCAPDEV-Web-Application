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
            const reviews = await Review.find({ establishment: id }).sort(sortQuery).populate(['reply', 'user']);
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

    incrementLike: async (reviewId, userId) => {
        try {
            const review = await Review.findById(reviewId);
            
            // If the user has already liked this review
            if (review.likesUsers.includes(userId)) {
                return review.likes;
            }
    
            // If the user has disliked this review before
            if (review.dislikesUsers.includes(userId)) {
                review.dislikes -= 1;
                review.likes += 1;
                review.dislikesUsers.pull(userId);
                review.likesUsers.push(userId);
            } else {
                review.likes += 1;
                review.likesUsers.push(userId);
            }
    
            await review.save();
    
            return review.likes;
        } catch (err) {
            throw err;
        }
    },
    
    incrementDislike: async (reviewId, userId) => {
        try {
            const review = await Review.findById(reviewId);
    
            // If the user has already disliked this review
            if (review.dislikesUsers.includes(userId)) {
                return review.dislikes;
            }
    
            // If the user has liked this review before
            if (review.likesUsers.includes(userId)) {
                review.likes -= 1;
                review.dislikes += 1;
                review.likesUsers.pull(userId);
                review.dislikesUsers.push(userId);
            } else {
                review.dislikes += 1;
                review.dislikesUsers.push(userId);
            }
    
            await review.save();
    
            return review.dislikes;
        } catch (err) {
            throw err;
        }
    }
};



export default ReviewController;