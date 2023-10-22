const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { PrismaClient } = require('@prisma/client');
const authControllers = require('./controllers/auth.controllers');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
    {usernameField: 'email'}, // Field yang digunakan sebagai 'username' (default: 'username')
    async (email, password, done) => {
        try {
            const user = await prisma.user.findUnique({where: {email}});
            if (!user) {
                return done(null, false, { message: 'Invalid email or password' });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return done(null, false, {message: 'Invalid email or password'});
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// Serialize user (save user to session)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user (retrieve user from session)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({where: {id}});
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;