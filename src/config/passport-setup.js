const passport = require('passport');
const {Strategy: GoogleStrategy} = require("passport-google-oauth20");
const authService = require('../services/authService');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, cb) => {
    return authService.createOrSignInGoogleUser(accessToken, refreshToken, profile, cb);
  }
));

// Serialize and deserialize user instances to and from the session.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});