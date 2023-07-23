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

    // Get a reply by its id
    getReply: async (req, res) => {
        const { id } = req.params;
        try {
            const reply = await Reply.findById(id);
            if (!reply) return res.status(404).send({ message: "Reply not found" });
            res.send(reply);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // Update a reply by its id
    updateReply: async (req, res) => {
        const { id } = req.params;
        try {
            const reply = await Reply.findByIdAndUpdate(id, req.body, { new: true });
            if (!reply) return res.status(404).send({ message: "Reply not found" });
            res.send(reply);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // Delete a reply by its id
    deleteReply: async (req, res) => {
        const { id } = req.params;
        try {
            const reply = await Reply.findByIdAndDelete(id);
            if (!reply) return res.status(404).send({ message: "Reply not found" });
            res.send(reply);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    }
};

export default ReplyController;