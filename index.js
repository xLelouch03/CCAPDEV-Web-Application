// System-related packages
import "dotenv/config";
import { dirname } from "path";
import { fileURLToPath } from 'url';
// Web-app related packages
import express from 'express';
import exphbs from 'express-handlebars';
// Routes modules
import router from "./src/routes/index.js";
// DB modules
import { connectToMongo, getDb } from "./src/models/conn.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserController from './src/controllers/user.controller.js';

const collectionName = "users"; // Your collection name

// ... (other code)

// Import Mongoose Schemas
const User = require('./models/user.model.js');
const Establishment = require('./models/establishment.model.js');
const Review = require('./models/review.model.js');
const Reply = require('./models/review.model.js');

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
        const usersCollection = db.collection('users');
    
        const sampleUsers = [
          { username: 'David', password: 'password1' },
          { username: 'Yna', password: 'password2' },
          { username: 'Martin', password: 'password3' },
          { username: 'Kieffer', password: 'password4' },
          { username: 'Timothy', password: 'password5' },
        ];
    
        // Insert the sample users into the 'users' collection
        const result = await usersCollection.insertMany(sampleUsers);
        console.log(`${result.insertedCount} sample users inserted successfully!`);
      } catch (err) {
          console.error('Error inserting sample users: ', err);
        }
      }

    async function deleteAllUsers() {
      try {
        const db = getDb(process.env.DB_NAME); // Get the default database
        const usersCollection = db.collection('User');
    
        // Delete all documents from the 'users' collection
        const result = await usersCollection.deleteMany({});
    
        console.log(`${result.deletedCount} documents deleted from the 'users' collection.`);
      } catch (err) {
        console.error('Error deleting documents: ', err);
      }
    }

    async function fetchUserIds() {
      try {
        const User = mongoose.model('User');
        const ids = await User.find({}, '_id');
        console.log('Successfully fetched list of sample users.')
        return ids;
      } catch(err) {
        console.error('Error fetching list of sample users: ', err);
      }
    }

    async function insertSampleEstablishments() {
      try {
        const db = getDb(process.env.DB_NAME);
        const establishmentsCollection = db.collection('establishments');

        const sampleEstablishments = [
          { 
            name: "Manila Ocean Park",
            images: ["/images/mocp1.png", "/images/mocp2.png", "/images/mocp3.png"],
            category: "Oceanarium",
            description: "Manila Ocean Park is a popular oceanarium and marine-themed park located in Manila, the capital city of the Philippines. It is one of the country's premier attractions, offering visitors an immersive and educational experience with various marine life and ecosystems.",
            location: "Manila"
          },
          { 
            name: "Balesin Island Club",
            images: ["/images/bic1.png", "/images/bic2.png", "/images/bic3.png"],
            category: "Private beach resort",
            description: "Balesin Island Club is a secluded paradise spanning 500 hectares, located in the Lamon Bay of Quezon Province. This private island sanctuary boasts breathtaking landscapes inspired by some of the world's most sought-after destinations, allowing guests to experience the allure of various international locales without ever leaving the Philippines. Each distinct village on the island offers a unique ambiance, architecture, and cuisine, creating a truly immersive and unforgettable experience.",
            location: "Quezon"
          },
          { 
            name: "Masungi Georeserve",
            images: ["/images/mg1.png", "/images/mg2.png", "/images/mg3.png"],
            category: "Geological park",
            description: "Masungi Georeserve is a 1,500-hectare conservation area located in the lush province of Rizal, just a short distance from Manila. It showcases a mesmerizing blend of breathtaking rock formations, lush forests, and diverse wildlife. The georeserve is renowned for its sustainable tourism practices, aiming to preserve and protect its delicate ecosystem while providing visitors with an unforgettable adventure.",
            location: "Rizal"
          },
          { 
            name: "Baguio Country Club",
            images: ["/images/bcc1.png", "/images/bcc2.png", "/images/bcc3.png"],
            category: "Retreat & historical landmark",
            description: "Manila Ocean Park is a popular oceanarium and marine-themed park located in Manila, the capital city of the Philippines. It is one of the country's premier attractions, offering visitors an immersive and educational experience with various marine life and ecosystems.",
            location: "Baguio"
          },
          { 
            name: "Manila Hotel",
            images: ["/images/13.png", "/images/14.png", "/images/15.png"],
            category: "Private hotel",
            description: "The Manila Hotel stands as a testament to the city's history and grandeur. Its majestic architecture and exquisite interiors reflect a bygone era, transporting guests to a time of opulence and refinement. Situated in the vibrant district of Ermita, the hotel boasts stunning views of Manila Bay and is conveniently located near key attractions, making it an ideal choice for both leisure and business travelers.",
            location: "Manila"
          }
        ];

        // Insert the sample users into the 'users' collection
        const result = await establishmentsCollection.insertMany(sampleEstablishments);
        console.log(`${result.insertedCount} sample establishments inserted successfully!`);
      } catch (err) {
        console.error('Error inserting sample establishments: ', err);
      }
    }

    async function fetchEstablishmentIds() {
      try {
        const Establishment = mongoose.model('Establishment');
        const ids = await Establishment.find({}, '_id');
        console.log('Successfully fetched list of sample establishments.')
        return ids;
      } catch(err) {
        console.error('Error fetching list of sample establishments: ', err);
      }
    }

    async function insertSampleReviews(userIds, establishmentIds) {
      try {
        const db = getDb(process.env.DB_NAME);
        const reviewsCollection = db.collection('reviews');

        const sampleReviews = [
          {
            user: userIds[0],
            establishment: establishmentIds[0],
            rating: 5,
            title: "Excellent Service",
            body: "The service was outstanding and the staff was very friendly and helpful. The food was delicious, and the atmosphere was great. Definitely will come again!"
          },
          {
            user: userIds[1],
            establishment: establishmentIds[0],
            rating: 4,
            title: "Great Atmosphere",
            body: "The atmosphere is very cozy and inviting. The staff was friendly and the food was great. A little bit pricey, but worth it for the experience."
          },
          {
            user: userIds[2],
            establishment: establishmentIds[0],
            rating: 3,
            title: "Average Experience",
            body: "The place was decent. The food was average and the staff was okay. Nothing particularly stood out but it was a fair experience overall."
          },
          {
            user: userIds[3],
            establishment: establishmentIds[0],
            rating: 2,
            title: "Not the best",
            body: "The service was a bit slow and the food was mediocre. Might give it another try but it was a letdown on the first visit."
          },
          {
            user: userIds[4],
            establishment: establishmentIds[0],
            rating: 1,
            title: "Very Disappointing",
            body: "The service was poor and the food was not up to the mark. I was disappointed with the overall experience and I don't think I will be visiting again."
          },
          {
            user: userIds[0],
            establishment: establishmentIds[1],
            rating: 5,
            title: "An Unforgettable Experience",
            body: "From the moment we walked through the doors, the staff was exceptionally welcoming and friendly. They made us feel right at home. The food was absolutely exquisite - every dish was a masterful work of culinary art. Furthermore, the ambiance of the place was warm and charming, adding to an already wonderful experience. This place definitely exceeded my expectations and I am eager to return."
          },
          {
            user: userIds[1],
            establishment: establishmentIds[1],
            rating: 4,
            title: "Superb Dining Experience",
            body: "A delight from start to finish. The atmosphere was inviting and sophisticated without feeling pretentious. We were attended to by a friendly and knowledgeable staff, who helped us make our choices from the menu. Every dish we tasted was a delight to the senses, beautifully presented and filled with nuanced flavors. Although it was a bit on the expensive side, the experience was well worth the price."
          },
          {
            user: userIds[2],
            establishment: establishmentIds[1],
            rating: 5,
            title: "Exceptional Service and Atmosphere",
            body: "We had a lovely time at this establishment. The service was some of the best we've experienced in a long time. Our server was incredibly attentive without being intrusive, and had a great knowledge of the menu, which was greatly appreciated. The atmosphere was relaxing and the decor was tasteful and unique. Food was excellent and I would highly recommend this place to anyone."
          },
          {
            user: userIds[3],
            establishment: establishmentIds[1],
            rating: 5,
            title: "Great place with minor improvements",
            body: "A great dining experience overall. The food was delicious and the atmosphere was very nice, with a quiet and elegant setting. The staff was friendly and accommodating, however, we had to wait a bit long for our food. But when it arrived, it was worth the wait. The flavors were on point and the presentation was beautiful. A little room for improvement, but still a great place to dine."
          },
          {
            user: userIds[4],
            establishment: establishmentIds[1],
            rating: 4,
            title: "High Quality Dining",
            body: "This place certainly offers a high quality dining experience. The staff was professional, the environment was clean and stylish, and the food was out of this world. We tried a variety of dishes and all of them were excellent, with high-quality ingredients and delightful flavors. Prices were a bit high, but for a special occasion, it is definitely worth it. We will be back!"
          }
        ];
        // Insert the sample reviews into the 'reviews' collection
        const result = await establishmentsCollection.insertMany(sampleReviews);
        console.log(`${result.insertedCount} sample reviews inserted successfully!`);
      } catch(err) {
        console.error('Error inserting sample reviews: ', err);
      }
    }

    async function fetchReviewIds() {
      try {
        const Review = mongoose.model('Review');
        const ids = await Review.find({}, '_id');
        console.log('Successfully fetched list of sample reviews.')
        return ids;
      } catch(err) {
        console.error('Error fetching sample reviews: ', err);
      }
    }

    async function insertSampleReplies(reviewIds) {
      try {
        const db = getDb(process.env.DB_NAME);
        const repliesCollection = db.collection('replies');

        const sampleReplies = [
          {
            review: reviewIds[0],
            establishment: establishmentIds[0],
            body: "Thank you for your wonderful review!"
          },
          {
            review: reviewIds[1],
            establishment: establishmentIds[0],
            body: "We're glad you enjoyed your visit!"
          },
          {
            review: reviewIds[6],
            establishment: establishmentIds[0],
            body: "Come again next time!"
          },
          {
            review: reviewIds[7],
            establishment: establishmentIds[0],
            body: "It was a pleasure serving you!"
          }
        ];
        // Insert the sample replies into the 'replies' collection
        const result = await repliesCollection.insertMany(sampleReplies);
        console.log(`${result.insertedCount} sample replies inserted successfully!`);
      } catch(err) {
        console.error('Error inserting sample replies: ', err);
      }
    }

    // Inserting sample data to database
    await deleteAllUsers();
    await insertSampleUsers();
    await insertSampleEstablishments();

    const userIds = await fetchUserIds();
    const establishmentIds = await fetchEstablishmentIds();

    await insertSampleReviews(userIds, establishmentIds);
    const reviewIds = await fetchReviewIds();
    await insertSampleReplies(reviewIds);

    app.get('/:username', async (req, res) => {
      const { username } = req.params;
  
      try {
          // Fetch the user data from the database using the UserController or the User model directly
          const profileData = await User.findOne({ username }); // Assuming you use the User model
          // Alternatively, you can use UserController.getUser(username) if the function accepts the username as a parameter
  
          // Render the profile.hbs template with the profileData as the context
          res.render('profile', { title: 'User Profile', profileData });
      } catch (error) {
          console.error('Error fetching user data:', error);
          res.status(500).json({ message: 'Internal server error' });
      }
  });

  app.post('/login', express.json(), async (req, res) => {
    const { username, password } = req.body;

    console.log('Received login request:', { username, password });

    try {
        // Find the user in the database with the provided username
        const user = await UserController.getUserByUsername(username);

        if (user) {
          // Login successful
          res.status(200).json({ message: 'Login successful', user: user });
      } else {
          // User does not exist or incorrect password
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