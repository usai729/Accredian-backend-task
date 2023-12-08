const mysql = require("mysql");
const _ = require("dotenv").config();

exports.con = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});
