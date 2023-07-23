// System-related packages
import "dotenv/config";
import { dirname } from "path";
import { fileURLToPath } from 'url';
// Web-app related packages
import express from 'express';
import exphbs from 'express-handlebars';
// Routes modules
import router from "./src/routes/index.js";
//DB modules
import { connectToMongo, getDb } from "./src/db/conn.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const collectionName = "users"; // Your collection name

// ... (other code)

// Mongoose Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

const db = getDb(process.env.DB_NAME);
async function main () {
    const __dirname = dirname(fileURLToPath(import.meta.url)); // directory URL
    const app = express();

    app.use("/static", express.static(__dirname + "/public"));
    // Set handlebars as the express app's default view engine
    app.engine("hbs", exphbs.engine({
        extname: 'hbs'
    }));
    app.set("view engine", "hbs");
    // directory for views folder
    app.set("views", "./src/views");
    // View cache to false
    app.set("view cache", false);

    // from this point onwards, we are going to receive json format data
    app.use(express.json());

    app.use(router);


    app.listen(process.env.SERVER_PORT, () => {
        console.log("Express app now listening...");
        connectToMongo((err)=> {
            if(err) {
                console.error("An error has occured.");
                console.error(err);
                process.exit();
                return;
            }
            console.log("Connected to MongoDB")
        })        
    });

    async function insertSampleUsers() {
        try {
          const db = getDb(process.env.DB_NAME); // Get the default database
          const usersCollection = db.collection('users'); // Replace 'users' with your desired collection name
      
          const sampleUsers = [
            { username: 'user1', password: 'password1' },
            { username: 'user2', password: 'password2' },
            { username: 'user3', password: 'password3' },
            { username: 'user4', password: 'password4' },
            { username: 'user5', password: 'password5' },
          ];
      
          // Insert the sample users into the 'users' collection
          const result = await usersCollection.insertMany(sampleUsers);
          console.log(`${result.insertedCount} sample users inserted successfully!`);
        } catch (err) {
          console.error('Error inserting sample users:', err);
        }
      }

      async function deleteAllUsers() {
        try {
          const db = getDb(process.env.DB_NAME); // Get the default database
          const usersCollection = db.collection('users'); // Replace 'users' with your desired collection name
      
          // Delete all documents from the 'users' collection
          const result = await usersCollection.deleteMany({});
      
          console.log(`${result.deletedCount} documents deleted from the 'users' collection.`);
        } catch (err) {
          console.error('Error deleting documents:', err);
        }
      }

     
     deleteAllUsers();
      
      // Call the function to insert the sample users
      //insertSampleUsers();

      app.post('/login', express.json(), async (req, res) => {
        const { username, password } = req.body;
      
        console.log('Received login request:', { username, password });
      
        try {
          // Find the user in the database with the provided username
          const user = await db.collection(collectionName).findOne({ username: username });
      
          if (user) {
            // Compare the provided password with the stored password (plain text)
            if (user.password === password) {
              // Login successful, you can create a session or generate a JWT here
              res.status(200).json({ message: 'Login successful', user: user });
            } else {
              // Incorrect password
              res.status(401).json({ message: 'Invalid password' });
            }
          } else {
            // User does not exist
            res.status(401).json({ message: 'Invalid username or password' });
          }
        } catch (error) {
          console.error('Error while logging in:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      });
      
        
      // Signup endpoint
      app.post('/signup', express.json(), async (req, res) => {
        const { username, password } = req.body;
      
        try {
          // Check if the user already exists in the database
          const existingUser = await User.findOne({ username: username });
      
          if (existingUser) {
            // If user already exists, return an error response
            return res.status(400).json({ message: 'User already exists' });
          }
      
          // If user does not exist, hash the password
          const hashedPassword = await bcrypt.hash(password, 10);
      
          // Create a new user document using the Mongoose model
          const newUser = new User({ username: username, password: hashedPassword });
      
          // Save the new user to the MongoDB collection
          await newUser.save();
      
          console.log('User inserted successfully:', newUser);
          res.status(200).json({ message: 'User registered successfully' });
        } catch (error) {
          console.error('Error while registering user:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      });
}

main();

