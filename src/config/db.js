const {Pool} = require('pg');

console.log('??process.env.PLATFORM_RELATIONSHIPS', process.env.PLATFORM_RELATIONSHIPS)
// if (process.env.PLATFORM_RELATIONSHIPS) {
// Decode the PLATFORM_RELATIONSHIPS variable
const relationships = JSON.parse(Buffer.from(process.env.PLATFORM_RELATIONSHIPS, 'base64').toString());

// Assuming the relationship is named 'database'
const credentials = relationships.database[0];

const pool = new Pool({
  user: credentials.username,
  host: credentials.host,
  database: credentials.path,
  password: credentials.password,
  port: credentials.port,
});

// Your database operations...
// }

// create table if not exist
(async () => {
  await pool.query(`
      CREATE TABLE IF NOT EXISTS users
      (
          "id"            SERIAL PRIMARY KEY,
          "googleId"      VARCHAR(255),
          "name"          VARCHAR(255)        NOT NULL,
          "email"         VARCHAR(255) UNIQUE NOT NULL,
          "password"      VARCHAR(255),
          "createTime"    timestamp           NOT NULL,
          "token"         VARCHAR(255)        NOT NULL,
          "verified"      BOOLEAN             NOT NULL
      )
  `);
})();
(async () => {
  await pool.query(`
      CREATE TABLE IF NOT EXISTS user_log
      (
          "id"            SERIAL PRIMARY KEY,
          "userId"        INTEGER NOT NULL,
          "loginTime"     TIMESTAMP NOT NULL,
          CONSTRAINT fk_user
              FOREIGN KEY ("userId")
                  REFERENCES users("id")
                  ON DELETE CASCADE
      )
  `);
})();

module.exports = pool;
