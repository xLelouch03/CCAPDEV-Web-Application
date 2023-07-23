import Establishment from '../models/establishment.model.js';

const EstablishmentController = {
    // Create a new establishment
    createEstablishment: async (req, res) => {
        const { name, images, category, description } = req.body;
        try {
            const establishment = new Establishment({ name, images, category, description });
            await establishment.save();
            res.status(201).send(establishment);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // Get an establishment by its id
    getEstablishment: async (req, res) => {
        const { id } = req.params;
        try {
            const establishment = await Establishment.findById(id).populate('reviews');
            if (!establishment) return res.status(404).send({ message: "Establishment not found" });
            res.send(establishment);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // Update an establishment by its id
    updateEstablishment: async (req, res) => {
        const { id } = req.params;
        try {
            const establishment = await Establishment.findByIdAndUpdate(id, req.body, { new: true });
            if (!establishment) return res.status(404).send({ message: "Establishment not found" });
            res.send(establishment);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // Delete an establishment by its id
    deleteEstablishment: async (req, res) => {
        const { id } = req.params;
        try {
            const establishment = await Establishment.findByIdAndDelete(id);
            if (!establishment) return res.status(404).send({ message: "Establishment not found" });
            res.send(establishment);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    }
};

export default EstablishmentController;