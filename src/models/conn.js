import mongoose from 'mongoose';
import { MongoClient } from "mongodb";
const mongoURI = process.env.MONGODB_URI;
const client = new MongoClient(mongoURI);


export function connectToMongo(callback) {
    mongoose.connect(mongoURI).then(() => {
        callback();
    }).catch(err => {
        callback(err);
    });
};

export function getDb(dbName = "juanderlust") {
    return client.db(dbName);
};

function signalHandler() {
    console.log("Closing MongoDB connection...");
    process.exit();
}

process.on("SIGINT", signalHandler);
process.on("SIGTERM", signalHandler);
process.on("SIGQUIT", signalHandler);