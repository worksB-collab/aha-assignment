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
  await createTableIfNotExist();
  const result = await pool.query(
    'INSERT INTO users (name, email, password, token, verified) VALUES ($1, $2, $3, $4, false) RETURNING *',
    [name, email, password, token]
  );
  return result.rows[0];
};

const createTableIfNotExist = async () => {
  await pool.query(`
      CREATE TABLE IF NOT EXISTS users
      (
          id       SERIAL PRIMARY KEY,
          googleId VARCHAR(255),
          name     VARCHAR(255)        NOT NULL,
          email    VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255)        NOT NULL,
          token    VARCHAR(255)        NOT NULL,
          verified BOOLEAN             NOT NULL
      )
  `);
};

const save = async (user) => {
  const {email, name, password, token, verified} = user;
  await pool.query(
    'UPDATE users SET name = $2, password = $3, token = $4, verified = $5 WHERE email = $1',
    [email, name, password, token, verified]
  );
}

module.exports = {
  findUserByEmail, findUserByGoogleId, findUserByToken, createUser, save
};
