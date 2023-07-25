// System-related packages
import "dotenv/config";
import { dirname } from "path";
import { fileURLToPath } from 'url';

// Web-app related packages
import express from 'express';
import exphbs from 'express-handlebars';

// Routes modules
import router from "./src/routes/index.js";
import establishmentRouter from './src/routes/establishment.router.js';
import cors from 'cors';

// DB modules
import { connectToMongo } from "./src/models/conn.js";
// import bcrypt from "bcrypt";
import UserController from './src/controllers/user.controller.js';
import userRouter from './src/routes/user.router.js';
// Importing Mongoose schemas
import mongoose from 'mongoose';
import User from './src/models/user.model.js';
import Establishment from './src/models/establishment.model.js';
import Review from './src/models/review.model.js';
import Reply from './src/models/reply.model.js';
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
    app.use(cors());
    app.use(router);
    app.use(userRouter);
    app.use(establishmentRouter);

    app.listen(process.env.SERVER_PORT, () => {
      console.log("Express app now listening...");
      connectToMongo((err) => {
        if(err) {
            console.error("An error has occured.");
            console.error(err);
            process.exit();
            return;
        }
        console.log("Connected to MongoDB");

        // Resets the database
        dropDatabase();
      });
    });

    async function dropDatabase() {
      // Deletes the entire database
      mongoose.connection.db.dropDatabase(function(err) {
        if (err) {
            console.error('Error dropping database:', err);
        } else {
            console.log('Database dropped successfully.');
        }
      });    
    }

    async function insertSampleUsers() {
      try {
        const sampleUsers = [
          { username: 'David', password: 'password1', profileDescription: 'Hello there!' },
          { username: 'Yna', password: 'password2', profileDescription: 'Hello there!'  },
          { username: 'Martin', password: 'password3', profileDescription: 'Hello there!' },
          { username: 'Kieffer', password: 'password4', profileDescription: 'Hello there!' },
          { username: 'Timothy', password: 'password5', profileDescription: 'Hello there!' },
        ];
    
        // Insert the sample users into the 'users' collection
        const result = await User.insertMany(sampleUsers);
        console.log(`${result.length} sample users inserted successfully!`);
      } catch (err) {
          console.error('Error inserting sample users: ', err);
      }
    }

    
    async function fetchUserIds() {
      try {
        const users = await User.find({}, '_id');
        const userIds = users.map((user) => user._id.toString());
        console.log(userIds);
        console.log('Successfully fetched list of user IDs.');
        return userIds;
      } catch (err) {
        console.error('Error fetching list of user IDs: ', err);
        return [];
      }
    }

    async function fetchUsernames() {
      try {
        const users = await User.find({}, 'username');
        const usernames = users.map((user) => user.username);
        console.log(usernames);
        console.log('Successfully fetched list of usernames.');
        return usernames;
      } catch (err) {
        console.error('Error fetching list of usernames: ', err);
        return [];
      }
    }

    app.get('/users', (req, res) => {
      const users = fetchUsernames(); // Call your function to get the list of users
      res.json({ users: users }); // Assuming users is an array of user objects
    });

    async function insertSampleEstablishments() {
      try {
        const sampleEstablishments = [
          { 
            name: "Manila Ocean Park",
            username: "manilaoceanpark",
            password: "password1",
            images: ["/static/images/mocp1.png", "/static/images/mocp2.png", "/static/images/mocp3.png"],
            category: "Nature",
            description: "Manila Ocean Park is a popular oceanarium and marine-themed park located in Manila, the capital city of the Philippines. It is one of the country's premier attractions, offering visitors an immersive and educational experience with various marine life and ecosystems.",
            location: "Manila",
            rating: 3.0
          },
          { 
            name: "Balesin Island Club",
            username: "balesinislandclub",
            password: "password2",
            images: ["/static/images/bic1.png", "/static/images/bic2.png", "/static/images/bic3.png"],
            category: "Beach",
            description: "Balesin Island Club is a secluded paradise spanning 500 hectares, located in the Lamon Bay of Quezon Province. This private island sanctuary boasts breathtaking landscapes inspired by some of the world's most sought-after destinations, allowing guests to experience the allure of various international locales without ever leaving the Philippines. Each distinct village on the island offers a unique ambiance, architecture, and cuisine, creating a truly immersive and unforgettable experience.",
            location: "Quezon",
            rating: 4.6
          },
          { 
            name: "Masungi Georeserve",
            username: "masungigeoreserve",
            password: "password3",
            images: ["/static/images/mg1.png", "/static/images/mg2.png", "/static/images/mg3.png"],
            category: "Cultural Site",
            description: "Masungi Georeserve is a 1,500-hectare conservation area located in the lush province of Rizal, just a short distance from Manila. It showcases a mesmerizing blend of breathtaking rock formations, lush forests, and diverse wildlife. The georeserve is renowned for its sustainable tourism practices, aiming to preserve and protect its delicate ecosystem while providing visitors with an unforgettable adventure.",
            location: "Rizal",
            rating: 0.0
          },
          { 
            name: "Baguio Country Club",
            username: "baguiocountryclub",
            password: "password4",
            images: ["/static/images/bcc1.png", "/static/images/bcc2.png", "/static/images/bcc3.png"],
            category: "Nature",
            description: "Manila Ocean Park is a popular oceanarium and marine-themed park located in Manila, the capital city of the Philippines. It is one of the country's premier attractions, offering visitors an immersive and educational experience with various marine life and ecosystems.",
            location: "Baguio",
            rating: 0.0
          },
          { 
            name: "Manila Hotel",
            username: "manilahotel",
            password: "password5",
            images: ["/static/images/13.png", "/static/images/14.png", "/static/images/15.png"],
            category: "Hotel",
            description: "The Manila Hotel stands as a testament to the city's history and grandeur. Its majestic architecture and exquisite interiors reflect a bygone era, transporting guests to a time of opulence and refinement. Situated in the vibrant district of Ermita, the hotel boasts stunning views of Manila Bay and is conveniently located near key attractions, making it an ideal choice for both leisure and business travelers.",
            location: "Manila",
            rating: 0.0
          }
        ];

        // Insert the sample users into the 'users' collection
        const result = await Establishment.insertMany(sampleEstablishments);
        console.log(`${result.length} sample establishments inserted successfully!`);
      } catch (err) {
        console.error('Error inserting sample establishments: ', err);
      }
    }

    async function fetchEstablishmentIds() {
      try {
        const ids = await Establishment.find({}, '_id');
        console.log('Successfully fetched list of sample establishments.');
        return ids;
      } catch(err) {
        console.error('Error fetching list of sample establishments: ', err);
      }
    }

    async function insertSampleReviews(userIds, establishmentIds) {
      try {
        const sampleReviews = [
          {
            user: userIds[0],
            establishment: establishmentIds[0],
            rating: 5,
            title: "Excellent Service",
            body: "The service was outstanding and the staff was very friendly and helpful. The food was delicious, and the atmosphere was great. Definitely will come again!",
            images: ["/static/images/sample_review_1/1.png", "/static/images/sample_review_1/2.png", "/static/images/sample_review_1/3.png"]
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
            body: "From the moment we walked through the doors, the staff was exceptionally welcoming and friendly. They made us feel right at home. The food was absolutely exquisite - every dish was a masterful work of culinary art. Furthermore, the ambiance of the place was warm and charming, adding to an already wonderful experience. This place definitely exceeded my expectations and I am eager to return.",
            images: ["/static/images/sample_review_1/bccreview1.png", "/static/images/sample_review_1/bccreview2.png", "/static/images/sample_review_1/bccreview3.png"]
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
            body: "We had a lovely time at this establishment. The service was some of the best we've experienced in a long time. Our server was incredibly attentive without being intrusive, and had a great knowledge of the menu, which was greatly appreciated. The atmosphere was relaxing and the decor was tasteful and unique. Food was excellent and I would highly recommend this place to anyone.",
            images: ["/static/images/sample_review_1/balesinreview1.png", "/static/images/sample_review_1/balesinreview2.png", "/static/images/sample_review_1/balesinreview3.png"]
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
        const result = await Review.insertMany(sampleReviews);
        console.log(`${result.length} sample reviews inserted successfully!`);
      } catch(err) {
        console.error('Error inserting sample reviews: ', err);
      }
    }

    async function fetchReviewIds() {
      try {
        const ids = await Review.find({}, '_id');
        console.log('Successfully fetched list of sample reviews.')
        return ids;
      } catch(err) {
        console.error('Error fetching sample reviews: ', err);
      }
    }

    async function insertSampleReplies(reviewIds) {
      try {
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
            review: reviewIds[4],
            establishment: establishmentIds[0],
            body: "Thanks for the feedback. We will do our best to improve!"
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
        const result = await Reply.insertMany(sampleReplies);
        console.log(`${result.length} sample replies inserted successfully!`);
      } catch(err) {
        console.error('Error inserting sample replies: ', err);
      }
    }

    // Inserting sample data to database
    await insertSampleUsers();
    await insertSampleEstablishments();

    const userIds = await fetchUserIds();
    const usernames = await fetchUsernames();
    const establishmentIds = await fetchEstablishmentIds();

    await insertSampleReviews(userIds, establishmentIds);
    const reviewIds = await fetchReviewIds();
    await insertSampleReplies(reviewIds);

}

main();