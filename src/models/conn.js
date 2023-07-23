import mongoose from 'mongoose';

const mongoURI = process.env.MONGODB_URI;

export function connectToMongo(callback) {
    mongoose.connect(mongoURI).then(() => {
        callback();
    }).catch(err => {
        callback(err);
    });
};

function signalHandler() {
    console.log("Closing MongoDB connection...");
    process.exit();
}

process.on("SIGINT", signalHandler);
process.on("SIGTERM", signalHandler);
process.on("SIGQUIT", signalHandler);