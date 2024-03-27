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
    `INSERT INTO users ("name", "email", "password", "token", "verified", "createTime") 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, email, password, token, false, now]
  );
  return result.rows[0];
};

const createGoogleUser = async (googleId, name, email, token) => {
  const now = new Date();
  const result = await pool.query(
    `INSERT INTO users ("googleId", "name", "email", "token", "verified", "createTime") 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [googleId, name, email, token, true, now]
  );
  return result.rows[0];
}

const login = async (userId) => {
  const now = new Date();
  await pool.query(
    'INSERT INTO user_log ("userId", "loginTime") VALUES ($1, $2) RETURNING *',
    [userId, now]
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

const resetPassword = async (email, password) => {
  await pool.query(
    'UPDATE users SET password = $2 WHERE email = $1',
    [email, password]
  );
}

const getAllUsersWithLoginDetail = async () => {
  const result = await pool.query(
    `SELECT u."name", u."createTime", COUNT(l."userId") AS "loginCount", MAX(l."loginTime") AS "lastLoginTime" 
     FROM users u left join user_log l ON u."id" = l."userId" GROUP BY u."id";`
  );
  return result.rows;
}

const getAllUserCount = async () => {
  const result = await pool.query(
    'SELECT COUNT(*) AS "totalNumSignUp" FROM users;'
  );
  return result.rows[0];
}

const getActiveSessionNumberToday = async () => {
  const result = await pool.query(
    `SELECT COUNT(*) AS "activeSessionNumberToday" 
     FROM user_log WHERE "loginTime" >= CURRENT_DATE 
                     AND "loginTime" < CURRENT_DATE + INTERVAL '1 day' ;`
  );
  return result.rows[0];
}

const getAvgNumActiveSevenDaysRolling = async () => {
  const result = await pool.query(
    `SELECT AVG(daily_active_users) AS "avgNumActiveSevenDaysRolling"
     FROM (SELECT date_trunc('day', "loginTime") AS day,
                  COUNT(DISTINCT "userId")       AS daily_active_users
           FROM user_log
           WHERE "loginTime" > CURRENT_DATE - INTERVAL '7 days'
           GROUP BY day) AS daily_counts;`
  );
  return result.rows[0];
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
  verifyToken,
  resetPassword,
  getAllUsersWithLoginDetail,
  getAllUserCount,
  getActiveSessionNumberToday,
  getAvgNumActiveSevenDaysRolling,
};
