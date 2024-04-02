const userDao = require('../daos/userDao');
const {encryptPassword, verifyPassword, validatePassword} = require("../utils/passwordUtil");
const {v4: uuidv4} = require('uuid');

const findUserByEmail = async (email) => {
  return userDao.findUserByEmail(email);
}

const createUser = async (name, email, password) => {
  const encryptedPassword = await encryptPassword(password);
  const token = uuidv4()
  await userDao.createUser(name, email, encryptedPassword, token);
  return token;
};

const createGoogleUser = async (googleId, name, email) => {
  const token = uuidv4()
  return await userDao.createGoogleUser(googleId, name, email, token);
};

const findUserByToken = (token) => {
  return userDao.findUserByToken(token);
}

const save = async (user) => {
  await userDao.save(user);
}

const signIn = async (userId) => {
  await userDao.login(userId);
}

const updateUsername = async (email, name) => {
  await userDao.updateUsername(email, name);
}

const verifyToken = async (token) => {
  await userDao.verifyToken(token);
}

const resetPassword = async (email, oldPassword, newPassword) => {
  const user = await findUserByEmail(email);
  if (!user || !await verifyPassword(oldPassword, user.password)) {
    throw new Error("email or old password incorrect");
  }
  await userDao.resetPassword(email, await encryptPassword(newPassword));
}

const getAllUsersWithLoginDetail = async () => {
  return await userDao.getAllUsersWithLoginDetail();
}

const getStatistics = async () => {
  const totalNumSignUp = await userDao.getAllUserCount();
  const activeSessionNumberToday = await userDao.getActiveSessionNumberToday();
  const avgNumActiveSevenDaysRolling = await userDao.getAvgNumActiveSevenDaysRolling();
   return {
     totalNumSignUp,
     activeSessionNumberToday,
     avgNumActiveSevenDaysRolling,
   }
}

module.exports = {
  findUserByEmail,
  createUser,
  createGoogleUser,
  findUserByToken,
  save,
  signIn,
  updateUsername,
  verifyToken,
  resetPassword,
  getAllUsersWithLoginDetail,
  getStatistics,
};
