const bcrypt = require('bcrypt');

const validatePassword = (password, repeatedPassword) => {
  if (password !== repeatedPassword) {
    throw new Error("repeated password invalid");
  }
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(.{8,})$/;
  const pass = regex.test(password);

  if (!pass) {
    throw new Error("new password invalid");
  }
}

const encryptPassword = async (password) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw error;
  }
};

const verifyPassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  validatePassword, encryptPassword, verifyPassword
};
