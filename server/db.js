const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "bobbyclinton",
  host: "localhost",
  port: 5432,
  database: "jwtapp"
});

module.exports = pool;
