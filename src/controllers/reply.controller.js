import Reply from '../models/reply.model.js';

const ReplyController = {
    // Create a new reply
    createReply: async (req, res) => {
        const { review, establishment, body } = req.body;
        try {
            const reply = new Reply({ review, establishment, body });
            await reply.save();
            res.status(201).send(reply);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // Get a reply by its associated review
    getReply: async (reviewId) => {
        try {
            const reply = await Reply.findOne({ review: reviewId }); // Look for the reply with the review id
            if (!reply) throw new Error("Reply not found");
            return reply;
        } catch (err) {
            throw err;
        }
    },

    // Get a reply by its ID
    getReplyById: async (id) => {
        try {
            const reply = await Reply.findById(id);
            if (!reply) throw new Error("Reply not found");
            return reply;
        } catch (err) {
            throw err;
        }
    },

    // Update a reply by its id
    updateReply: async (req, res) => {
        const { establishment } = req.params;
        const { review } = req.body;
        const { body } = req.body;

        const filter = { establishment, review };
        const update = { $set: { body } };
        try {
            const reply = await Reply.findOneAndUpdate(filter, update, { new: true });
            if (!reply) return res.status(404).send({ message: "Reply not found" });
            res.send(reply);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // Delete a reply by its id
    deleteReply: async (req, res) => {
        const { establishment } = req.params;
        const { review } = req.body;

        const filter = { establishment, review };
        try {
            const reply = await Reply.findOneAndDelete(filter);
            if (!reply) return res.status(404).send({ message: "Reply not found" });
            res.send(reply);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    }
};

export default ReplyController;