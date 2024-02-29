const userService = require('../services/userService');
const {sendVerificationEmail} = require("./emailService");
const {validatePassword, verifyPassword} = require("../utils/passwordUtil");

const signUp = async (name, email, password, repeatedPassword) => {
  if (!validatePassword(password, repeatedPassword)) {
    throw new Error("password invalid");
  }
  const token = await userService.createUser(name, email, password);
  await sendVerificationEmail(email, token);
};

const resendVerificationEmail = async (email) => {
  const user = await userService.findUserByEmail(email);
  await sendVerificationEmail(email, user.token);
}

const verifyToken = async (token) => {
  const user = await userService.findUserByToken(token);
  user.verified = true;
  await userService.save(user);
  return user;
}

const signIn = async (email, password) => {
  const user = await userService.findUserByEmail(email);
  if (!await verifyPassword(password, user.password)) {
    throw new Error("email or password incorrect");
  }
};

const getProfile = async (token) => {
  return await userService.findUserByToken(token)
}


module.exports = {
  signUp, resendVerificationEmail, verifyToken, signIn, getProfile
}


//---
// const LocalStrategy = require('passport-local').Strategy;
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const bcrypt = require('bcrypt');
//
// // Your User model
// const {getUser} = require('../services/userService');
// const {validatePassword} = require("../utils/passwordUtil");
// const {sendVerificationEmail} = require("./emailService");
//
// module.exports = function(passport) {
//   passport.use(new LocalStrategy({ usernameField: 'email' },
//     async (email, password, done) => {
//       // Match user
//       const user = await getUser({ email: email });
//       if (!user) {
//         return done(null, false, { message: 'That email is not registered' });
//       }
//
//       // Match password
//       try {
//         if (await bcrypt.compare(password, user.password)) {
//           return done(null, user);
//         } else {
//           return done(null, false, { message: 'Password incorrect' });
//         }
//       } catch (e) {
//         return done(e);
//       }
//     }
//   ));
//
//   // Google OAuth Strategy
//   passport.use(new GoogleStrategy({
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback"
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       // Check if user already exists in your db
//       try {
//         let user = await getUser({ googleId: profile.id });
//         if (user) {
//           return done(null, user);
//         } else {
//           // if not, create user in your db
//           user = await createUser({
//             googleId: profile.id,
//             email: profile.emails[0].value,
//             name: profile.displayName
//           });
//           return done(null, user);
//         }
//       } catch (err) {
//         return done(err);
//       }
//     }
//   ));
//
//   passport.serializeUser((user, done) => done(null, user.id));
//   passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => done(err, user));
//   });
// };
