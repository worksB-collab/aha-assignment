const userDao = require('../daos/userDao');
const {encryptPassword} = require("../utils/passwordUtil");
const {v4: uuidv4} = require('uuid');

const findUserByEmail = async (email) => {
  return userDao.findUserByEmail(email);
}

const findUserByGoogleId = async (googleId) => {
  return userDao.findUserByGoogleId(googleId);
}
const createUser = async (name, email, password) => {
  const encryptedPassword = await encryptPassword(password);
  const token = uuidv4()
  await userDao.createUser(name, email, encryptedPassword, token);
  return token;
};

const findUserByToken = (token) => {
  return userDao.findUserByToken(token);
}

const save = async (user) => {
  await userDao.save(user);
}

const signIn = async (user) => {
  await userDao.save(user);
}

module.exports = {
  findUserByEmail, createUser, findUserByToken, save
};
