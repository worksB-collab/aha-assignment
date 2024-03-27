const {Pool} = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

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
