const pool = require('../config/db');

const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

const findUserByGoogleId = async (googleId) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE googleId = $1',
    [googleId]
  );
  return result.rows[0];
}

const findUserByToken = async (token) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE token =($1)',
    [token]
  );
  return result.rows[0];
}

const createUser = async (name, email, password, token) => {
  const now = new Date();
  const result = await pool.query(
    'INSERT INTO users (name, email, password, token, verified, createTime, lastLoginTime, loginCount) VALUES ($1, $2, $3, $4, false, $5, $6, $7) RETURNING *',
    [name, email, password, token, now, now, 1]
  );
  return result.rows[0];
};

const createGoogleUser = async (googleId, name, email, token) => {
  const now = new Date();
  const result = await pool.query(
    'INSERT INTO users (googleId, name, email, token, verified, createTime, lastLoginTime, loginCount) VALUES ($1, $2, $3, $4, true, $5, $6, $7) RETURNING *',
    [googleId, name, email, token, now, now, 1]
  );
  return result.rows[0];
}

const login = async (id, count) => {
  const now = new Date();
  await pool.query(
    'UPDATE users SET lastLoginTime = $2, loginCount = $3 WHERE id = $1',
    [id, now, count]
  );
}

const save = async (user) => {
  const {id, name, password, token, verified} = user;
  await pool.query(
    'UPDATE users SET name = $2, password = $3, token = $4, verified = $5 WHERE id = $1',
    [id, name, password, token, verified]
  );
}

const updateUsername = async (email, name) => {
  await pool.query(
    'UPDATE users SET name = $2 WHERE email = $1',
    [email, name]
  );
}

const verifyToken = async (token) => {
  await pool.query(
    'UPDATE users SET verified = $2 WHERE token = $1',
    [token, true]
  );
}

module.exports = {
  findUserByEmail,
  findUserByGoogleId,
  findUserByToken,
  createUser,
  createGoogleUser,
  login,
  save,
  updateUsername,
  verifyToken
};
