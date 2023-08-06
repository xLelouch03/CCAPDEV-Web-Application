import PassportLocal from 'passport-local';
import bcrypt from 'bcryptjs';

import UserController from './src/controllers/user.controller.js';
import EstablishmentController from './src/controllers/establishment.controller.js';

const LocalStrategy = PassportLocal.Strategy;

export function initialize(passport) {
    const authenticateUser = async (req, username, password, done) => {

        // Extract role from request body
        const role = req.body.role;
        const rememberMe = req.body.rememberMe;
        console.log("Received login request:", role, username, password, rememberMe);
        
        // Verify existence of user from username
        let user;
        if (role == "user") {
            user = await UserController.getUserByUsername(username);
            if(user == null) {
                return done(null, false, { message: "No user with that username" });
            }
        } else if (role == "establishment") {
            user = await EstablishmentController.getEstablishmentByUsername(username);
            if(user == null) {
                return done(null, false, { message: "No establishment with that username" });
            }
        } else {
            return done(null, false, { message: "Specified role is not recognized" });
        }

        // Verify password
        try {
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Password incorrect" });
            }
        } catch(err) {
            return done(err);
        }
    }

    passport.use(new LocalStrategy({ passReqToCallback: true }, authenticateUser));
    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await UserController.getUserById(id);
            if(user) {
                return done(null, user);
            } else {
                let establishment = await EstablishmentController.getEstablishmentById(id);
                if(establishment) {
                    return done(null, establishment);
                } else {
                    throw new Error("No user or establishment found with that ID");
                }
            }
        } catch (err) {
            return done(err);
        }
    });    
}