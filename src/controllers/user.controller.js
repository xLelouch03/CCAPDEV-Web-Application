import passport from 'passport';
import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';

const UserController = {
    createUser: async (req, res) => {
        try {
            const { username, password, role, avatar, profileDescription, establishmentPhotos } = req.body;
            console.log("Received signup request:", { username, password, profileDescription, avatar });
        
            if (!username || !password) {
                return res.status(400).json({ message: "Please provide both username and password." });
            }
        
            // Check if the user already exists
            const userExist = await User.findOne({ username: username });
            if (userExist) {
                return res.status(409).json({ message: "Username already exists. Please choose another one." });
            }
        
            // Hash the password before saving it
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new User object based on the received data
            const newUser = new User({
                username,
                password: hashedPassword,
                role,
                avatar,
                profileDescription,
                establishmentPhotos,
            });
        
            // Save the new user to the database
            const result = await newUser.save();
            console.log("User registered successfully: ", result);
            res.status(200).json({ message: "User registration successful." });
        } catch (err) {
            console.error("Error registering user: ", err);
            res.status(500).json({ message: "An error occurred while registering the user." });
        }
    },

    // Get a user by their username
    getUser: async (req, res) => {
        const { username } = req.params;
        try {
            const user = await User.findOne({ username });
            if (!user) return res.status(404).send({ message: "User not found" });
            res.send(user);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // Return a user with matching username
    getUserByUsername: async (username) => {
        const query = { username };
        try {
            const user = await User.findOne(query);
            return user;
        } catch (err) {
            throw err;
        }
    },

    // Return a user with matching Object ID
    getUserById: async (id) => {
        try {
            const user = await User.findById(id);
            return user;
        } catch (err) {
            throw err;
        }
    },

    // Get all usernames
    getAllUsernames: async (req, res) => {
        try {
          const users = await User.find({}, 'username'); // Fetch all users and return only the 'username' field
          const usernames = users.map(user => user.username);
          res.send({ usernames });
        } catch (err) {
          res.status(500).send({ message: err.message });
        }
    },

    // Update a user's username, avatar, and profile description
    updateUser: async (req, res) => {
        const { username, avatar, profileDescription } = req.body;
        console.log("Received user update request:", { username, avatar, profileDescription });

        try {
            const filter = { _id: req.user._id };
            const update = { username, avatar, profileDescription };
            // Find the establishment in the database and update its information
            const result = await User.findOneAndUpdate(filter, update, { new: true });
            if (!result) {
                return res.status(404).send({ message: "User to be updated not found" });
            }
            res.send({ message: "User updated successfully" });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // Delete a user by their username
    deleteUser: async (req, res) => {
        const { username } = req.params;
        try {
            const user = await User.findOneAndDelete({ username });
            if (!user) return res.status(404).send({ message: "User not found" });
            res.send(user);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // Login user
    loginUser: async (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.error('Error logging in user: ', err);
                return next(err);
            }
            if (!user) {
                return res.status(400).json({ message: info.message });
            }
            req.logIn(user, function(err) {
                if (err) {
                    console.error('Error logging in user: ', err);
                    return next(err);
                }
                return res.status(200).json({ message: "Login successful", user });
            });
        })(req, res, next);
    }
};

export default UserController;