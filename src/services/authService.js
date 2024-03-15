const userService = require('../services/userService');
const {sendVerificationEmail} = require("./emailService");
const {validatePassword, verifyPassword} = require("../utils/passwordUtil");
const jwt = require("jsonwebtoken");

const signUp = async (name, email, password, repeatedPassword) => {
  if (!validatePassword(password, repeatedPassword)) {
    throw new Error("password invalid");
  }
  const verificationToken = await userService.createUser(name, email, password);
  await sendVerificationEmail(email, verificationToken);
};

const resendVerificationEmail = async (email) => {
  const user = await userService.findUserByEmail(email);
  await sendVerificationEmail(email, user.token);
}

const verifyToken = async (token) => {
  await userService.verifyToken(token);
}

const signIn = async (email, password) => {
  const user = await userService.findUserByEmail(email);
  if (user.googleId) {
    throw new Error("this account was signed up with google");
  }
  if (!user || !await verifyPassword(password, user.password)) {
    throw new Error("email or password incorrect");
  }
  await userService.signIn(user);
};

const createGoogleUser = async (accessToken, refreshToken, profile, cb) => {
  const email = profile.emails[0].value;
  try {
    let user = await userService.findUserByEmail(email);
    if (!user) {
      user = await userService.createGoogleUser(profile.id, profile.displayName, email);
    }
    const userData = {
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      token: jwt.sign({email: user.email}, process.env.JWT_SECRET, {expiresIn: '30d'})
    };
    cb(null, userData);
  } catch (error) {
    return cb(error, null);
  }
}

const getProfile = async (auth, email) => {
  this.authenticate(auth);
  const user = await userService.findUserByEmail(email);
  return {
    name: user.name,
    email: user.email
  };
}

const updateUsername = async (auth, email, newName) => {
  this.authenticate(auth);
  await userService.updateUsername(email, newName);
}

const authenticate = (auth) => {
  const token = auth ? auth.split('Bearer ')[1] : null;
  jwt.verify(token, process.env.JWT_SECRET);
}


module.exports = {
  signUp, resendVerificationEmail, verifyToken, signIn, createGoogleUser, getProfile, updateUsername, authenticate
}
