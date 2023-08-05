import passport from 'passport';
import bcrypt from 'bcryptjs';

import Establishment from '../models/establishment.model.js';

const EstablishmentController = {

    // Create a new establishment
    createEstablishment: async (req, res) => {
        const { username, password, role, avatar, description, establishmentPhotos, name, location, category } = req.body;
        console.log("Received signup request:", { username, password, description, establishmentPhotos, name, location, category });
        
        try {
            if (!username || !password || !role || !name || !location || !category) {
                return res.status(400).json({ message: "Please provide all required fields." });
            }
        
            // Check if the establishment already exists
            const establishmentExist = await Establishment.findOne({ username: username });
            if (establishmentExist) {
                return res.status(409).json({ message: "Username already exists. Please choose another one." });
            }
        
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Create a new Establishment object based on the received data
            const newEstablishment = new Establishment({
                username,
                password: hashedPassword,
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
            console.log("Establishment registered successfully: ", result);
            res.status(200).json({ message: "Establishment registration successful." });
        } catch (err) {
            console.error("Error registering establishment: ", err);
            res.status(500).json({ message: "An error occurred while registering the establishment." });
        }
    },

    // Login establishment with plain text password
    loginEstablishment: async (req, res, next) => {
        passport.authenticate('local', (err, establishment, info) => {
            if (err) {
                console.error('Error logging in establishment: ', err);
                return next(err);
            }
            if (!establishment) {
                return res.status(400).json({ message: info.message });
            }
            req.logIn(establishment, function(err) {
                if (err) {
                    console.error('Error logging in establishment: ', err);
                    return next(err);
                }
                return res.status(200).json({ message: "Login successful", establishment });
            });
        })(req, res, next);
    },
    
    // Get all establishments
    getEstablishments: async () => {
        try {
            const establishments = await Establishment.find({});
            if (!establishments.length) {
                console.log("No establishments found");
                return null;
            }
            return establishments;
        } catch (err) {
            throw err;
        }
    },

    // Return an establishment with matching ID
    getEstablishment: async (id) => {
        try {
            const establishment = await Establishment.findById(id);
            if (!establishment) {
                console.log("Establishment with specified ID cannot be found");
            }
            return establishment;
        } catch (err) {
            throw err;
        }
    },

    // Return establishment with matching username
    // Used for authentication
    getEstablishmentByUsername: async (username) => {
        const query = { username };
        try {
            const establishment = await Establishment.findOne(query);
            return establishment;
        } catch (err) {
            throw err;
        }
    },

    // Return establishment with matching ID
    // Used for authentication
    getEstablishmentById: async (id) => {
        try {
            const establishment = await Establishment.findById(id);
            return establishment;
        } catch (err) {
            throw err;
        }
    },

    // Update an establishment's name, username, avatar, short description, and description
    updateEstablishment: async (req, res) => {
        const { username, avatar, profileDescription, name, location, category, description } = req.body;
        console.log("Received update request:", { username, avatar, profileDescription, name, location, category, description });
    
        const filter = { _id: req.user._id };
        const update = { username, avatar, profileDescription, name, location, category, description };
        try {
            // Find the establishment in the database and update its information
            const result = await Establishment.findOneAndUpdate(filter, update, { new: true });
            if (!result) {
                return res.status(404).send({ message: "Establishment to be updated not found" });
            }
            res.send({ message: "Establishment updated successfully" });
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