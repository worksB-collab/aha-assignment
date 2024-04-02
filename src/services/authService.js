const userService = require('../services/userService');
const {sendVerificationEmail} = require("./emailService");
const {validatePassword, verifyPassword} = require("../utils/passwordUtil");
const jwt = require("jsonwebtoken");
const {format} = require("../utils/dateTimeUtil");

const signUp = async (name, email, password, repeatedPassword) => {
  validatePassword(password, repeatedPassword);
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
  if (!user || !await verifyPassword(password, user.password)) {
    throw new Error("email or password incorrect");
  }
  if (user.googleId) {
    throw new Error("this account was signed up with google");
  }
  await userService.signIn(user.id);
};

const createOrSignInGoogleUser = async (accessToken, refreshToken, profile, cb) => {
  const email = profile.emails[0].value;
  try {
    let user = await userService.findUserByEmail(email);
    if (!user) {
      user = await userService.createGoogleUser(profile.id, profile.displayName, email);
    }
    await userService.signIn(user.id);
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
  _authenticate(auth);
  const user = await userService.findUserByEmail(email);
  return {
    name: user.name,
    email: user.email
  };
}

const updateUsername = async (auth, email, newName) => {
  _authenticate(auth);
  await userService.updateUsername(email, newName);
}

const _authenticate = (auth) => {
  const token = auth ? auth.split('Bearer ')[1] : null;
  jwt.verify(token, process.env.JWT_SECRET);
}

const resetPassword = async (auth, email, oldPassword, newPassword, repeatPassword) => {
  _authenticate(auth);
  validatePassword(newPassword, repeatPassword)
  await userService.resetPassword(email, oldPassword, newPassword);
}

const getAllUsers = async (auth) => {
  _authenticate(auth);
  const userList = await userService.getAllUsersWithLoginDetail();
  return userList.map(user => {
    return {
      name: user.name,
      createTime: format(user.createTime),
      loginCount: user.loginCount,
      lastLoginTime: format(user.lastLoginTime),
    }
  });
}

const getStatistics = async (auth) => {
  _authenticate(auth);
  return await userService.getStatistics();
}

module.exports = {
  signUp,
  resendVerificationEmail,
  verifyToken,
  signIn,
  createOrSignInGoogleUser,
  getProfile,
  updateUsername,
  resetPassword,
  getAllUsers,
  getStatistics,
}
