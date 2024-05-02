const userService = require('../services/userService');
const {sendVerificationEmail} = require("./emailService");
const {validatePassword, isPasswordCorrect} = require("../utils/passwordUtil");
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
};

const verifyToken = async (token) => {
  await userService.verifyToken(token);
};

const signIn = async (email, password) => {
  const user = await userService.findUserByEmail(email);
  if (user) {
    if (!user.verified) {
      return false;
    }
    if (user.googleId || await isPasswordCorrect(password, user.password)) {
      await userService.signIn(user.id);
      return true;
    }
  }
  throw new Error("email or password incorrect");
};

const createOrSignInGoogleUser = async (accessToken, refreshToken, profile, cb) => {
  const email = profile.emails[0].value;
  try {
    let user = await userService.findUserByEmail(email);
    if (!user) {
      user = await userService.createGoogleUser(profile.id, profile.displayName, email);
    } else if (!user.googleId) {
      await userService.updateGoogleId(profile.id, email);
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
};

const getProfile = async (auth, email) => {
  _authenticateToken(auth);
  const user = await userService.findUserByEmail(email);
  return {
    name: user.name,
    email: user.email
  };
}

const updateUsername = async (auth, email, newName) => {
  _authenticateToken(auth);
  await userService.updateUsername(email, newName);
};

const _authenticateToken = (auth) => {
  const token = auth ? auth.split('Bearer ')[1] : null;
  jwt.verify(token, process.env.JWT_SECRET);
};

const resetPassword = async (auth, email, oldPassword, newPassword, repeatPassword) => {
  _authenticateToken(auth);
  validatePassword(newPassword, repeatPassword);
  await userService.resetPassword(email, oldPassword, newPassword);
};

const getAllUsers = async (auth) => {
  _authenticateToken(auth);
  const userList = await userService.getAllUsersWithLoginDetail();
  return userList.map(user => {
    return {
      name: user.name,
      createTime: format(user.createTime),
      loginCount: user.loginCount,
      lastLoginTime: format(user.lastLoginTime),
    }
  });
};

const getStatistics = async (auth) => {
  _authenticateToken(auth);
  return await userService.getStatistics();
};

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
};
