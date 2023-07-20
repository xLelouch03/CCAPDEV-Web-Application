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
      
      // Call the function to insert the sample users
      //insertSampleUsers();
}

main();

