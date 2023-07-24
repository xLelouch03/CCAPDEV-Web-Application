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

    // Get all establishments
    getEstablishments: async () => {
        try {
            const establishments = await Establishment.find({});
            if (!establishments.length) throw new Error("No establishments found");
            return establishments;
        } catch (err) {
            throw err;
        }
    },

    // Get an establishment by its id
    getEstablishment: async (id) => {
        try {
            const establishment = await Establishment.findById(id);
            if (!establishment) throw new Error("Establishment not found");
            return establishment;
        } catch (err) {
            throw err;
        }
    },

    // Update an establishment by its id
    updateEstablishment: async (req, res) => {
        const { establishment } = req.params;
        const { name } = req.body;
        const { password } = req.body;
        const { avatar } = req.body;
        const { images } = req.body;
        const { category } = req.body;
        const { description } = req.body;
        const { location } = req.body;

        const update = { $set: { name, password, avatar, images, category, description, location } };
        try {
            const match = await Establishment.findByIdAndUpdate(establishment, update, { new: true });
            if (!match) return res.status(404).send({ message: "Establishment not found" });
            res.send(match);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // Delete an establishment by its id
    deleteEstablishment: async (req, res) => {
        const { establishment } = req.params;
        try {
            const match = await Establishment.findByIdAndDelete(establishment);
            if (!match) return res.status(404).send({ message: "Establishment not found" });
            res.send(match);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    }
};

export default EstablishmentController;