import User from '../models/user.model.js';

const UserController = {
    // Create a new user
    createUser: async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = new User({ username, password });
            await user.save();
            res.status(201).send(user);
        } catch (err) {
            res.status(500).send({ message: err.message });
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

    // Update a user's username
    updateUser: async (req, res) => {
        const { username } = req.params;
        const { newUsername } = req.body;
        const { avatar } = req.body;
        const { profileDescription } = req.body;
        try {
            const user = await User.findOneAndUpdate(
                                    { username: username },
                                    {
                                        username: newUsername,
                                        avatar: avatar,
                                        profileDescription: profileDescription
                                    },
                                    { new: true }
                               );
            if (!user) return res.status(404).send({ message: "User not found" });
            res.send(user);
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
            const { username, password } = req.body;
            
            if (!username || !password) {
            return res.status(400).send({ message: "Please provide both username and password." });
            }

            try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }

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