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
                return res.status(409).json({ message: "Username already exists." });
            }
        
            // Create a new User object based on the received data
            const newUser = new User({
                username,
                password,
                role,
                avatar,
                profileDescription,
                establishmentPhotos,
            });
        
            // Save the new user to the database
            const result = await newUser.save();
            console.log("User registered successfully:", result);
            res.status(200).json({ message: "User registration successful." });
        } catch (err) {
            console.error('Error registering user:', err);
            res.status(500).json({ message: 'Internal server error. Please try again later.' });
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

    // Temporary function to get random user
    getRandomUserId: async () => {
        try {
            const user = await User.findOne({});
            if (!user) console.log('No users available');
            return user._id;
        } catch (err) {
            throw err
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
        const { username } = req.params;
        const { newUsername, avatar, profileDescription } = req.body;
        console.log("Received update request:", { username, newUsername, avatar, profileDescription });
        try {
        // Find the user in the database and update their information
        const user = await User.findOneAndUpdate(
            { _id: username },
            { username: newUsername, avatar, profileDescription },
            { new: true }
        );
    
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
    
        // Optionally, you can send a success message in the response
        res.send({ message: "User information updated successfully", user });
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

        
    // Login user with plain text password
    loginUser: async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log("Received login request:", { username, password });

        if (!username || !password) {
            return res.status(400).send({ message: "Please provide both username and password." });
        }

        // Check if the request data is being received correctly
        console.log("Received login request:", { username, password });

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Ensure the password is compared correctly (consider using a secure hashing method)
        // For the sake of demonstration, we'll compare plaintext passwords (not recommended for production)
        if (user.password !== password) {
            return res.status(401).send({ message: "Invalid password" });
        }

        res.send({ message: "Login successful", user });
        } catch (err) {
        res.status(500).send({ message: err.message });
        }
    },
};

export default UserController;