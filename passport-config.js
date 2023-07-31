import PassportLocal from 'passport-local';
import bcrypt from 'bcrypt';

import UserController from './src/controllers/user.controller.js';

const LocalStrategy = PassportLocal.Strategy;

export function initialize(passport) {
    const authenticateUser = async (username, password, done) => {
        const user = UserController.getUserByUsername(username);
        if(user == null) {
            return done(null, false, { message: "No user with that username " });
        }

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

    passport.use(new LocalStrategy(), authenticateUser);
    passport.serializeUser((user, done) => { });
    passport.deserializeUser((id, done) => { });
}