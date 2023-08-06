import Reply from '../models/reply.model.js';

const ReplyController = {
    // Create a new reply
    createReply: async (review, establishment, body) => {
        try {
            console.log("Reply created:", review, establishment, body);
            const reply = new Reply({ review, establishment, body });
            await reply.save();
            return reply;
        } catch (err) {
            throw err;
        }
    },

    // Get a reply by its associated review
    getReply: async (reviewId) => {
        try {
            const reply = await Reply.findOne({ review: reviewId }); // Look for the reply with the review id
            return reply;
        } catch (err) {
            throw err;
        }
    },

    // Get a reply by its ID
    getReplyById: async (id) => {
        try {
            const reply = await Reply.findById(id);
            return reply;
        } catch (err) {
            throw err;
        }
    },

    // Update a reply by its id
    updateReply: async (id, body) => {
        const filter = { _id: id };
        const update = { $set: { body, lastEdited: new Date() } };
        try {
            const reply = await Reply.findOneAndUpdate(filter, update, { new: true });
            console.log("Reply updated:", id, body);
            return reply;
        } catch (err) {
            throw err;
        }
    },

    // Delete a reply by its id
    deleteReply: async (id) => {
        const filter = { _id: id };
        try {
            const status = await Reply.findOneAndDelete(filter);
            if (status) console.log("Reply deleted");
            return status;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
};

export default ReplyController;