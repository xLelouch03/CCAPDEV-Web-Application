import Establishment from '../models/establishment.model.js';

const EstablishmentController = {
    // Create a new establishment
    /*createEstablishment: async (req, res) => {
        const { name, images, category, description } = req.body;
        try {
            const establishment = new Establishment({ name, images, category, description });
            await establishment.save();
            res.status(201).send(establishment);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },*/
    createEstablishment: async (req, res) => {
        const { username, password, role, avatar, description, establishmentPhotos, name, location, category } = req.body;
        console.log("Received signup request:", { username, password, description, establishmentPhotos, name, location, category });
      
        try {
          if (!username || !password || !role || !name || !location || !category) {
            return res.status(400).json({ message: "Please provide all required fields." });
          }
      
          // Check if the user already exists
          const userExist = await Establishment.findOne({ username: username });
          if (userExist) {
            return res.status(409).json({ message: "Username already exists." });
          }
      
          // Create a new Establishment object based on the received data
          const newEstablishment = new Establishment({
            username,
            password,
            role,
            avatar,
            description,
            establishmentPhotos,
            name,
            location,
            category,
          });
      
          // Save the new establishment to the database
          const result = await newEstablishment.save();
          console.log("Establishment registered successfully:", result);
          res.status(200).json({ message: "Establishment registration successful." });
        } catch (err) {
          console.error('Error registering establishment:', err);
          res.status(500).json({ message: 'Internal server error. Please try again later.' });
        }
      },
      

      // Login establishment with plain text password
        loginEstablishment: async (req, res) => {
            try {
            const { username, password } = req.body;

            // Check if the request data is being received correctly
            console.log("Received login request:", { username, password });

            const establishment = await Establishment.findOne({ username });

            if (!establishment) {
                return res.status(404).send({ message: "Establishment not found" });
            }

            // Ensure the password is compared correctly (consider using a secure hashing method)
            // For the sake of demonstration, we'll compare plaintext passwords (not recommended for production)
            if (establishment.password !== password) {
                return res.status(401).send({ message: "Invalid password" });
            }

            res.send({ message: "Login successful", establishment });
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