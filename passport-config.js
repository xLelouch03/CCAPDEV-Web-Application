import PassportLocal from 'passport-local';
import bcrypt from 'bcrypt';

import UserController from './src/controllers/user.controller.js';
import EstablishmentController from './src/controllers/establishment.controller.js';

const LocalStrategy = PassportLocal.Strategy;

export function initialize(passport) {
    const authenticateUser = async (type, username, password, done) => {

        // Verify existence of user from username
        if (type == "user") {
            const user = await UserController.getUserByUsername(username);
            if(user == null) {
                return done(null, false, { message: "No user with that username" });
            }
        } else if (type == "owner") {
            const user = await EstablishmentController.getEstablishmentByUsername(username);
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

    passport.use(new LocalStrategy(authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
        if(UserController.getUserById(id)) {
            UserController.getUserById(id)
            .then(user => done(null, user))
            .catch(err => done(err));
        } else if(EstablishmentController.getEstablishmentById(id)) {
            EstablishmentController.getEstablishmentById(id)
            .then(establishment => done(null, establishment))
            .catch(err => done(err));
        }
    });
}