const bcrypt = require('bcrypt');

const validatePassword = (password, repeatedPassword) => {
  if (password !== repeatedPassword) {
    return false;
  }
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(.{8,})$/;
  return regex.test(password);
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
    // 對比原始密碼與散列值
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  validatePassword, encryptPassword, verifyPassword
};
