const util = require('util');
const mysql = require("mysql");

// CREATE CONNECTION POOL TO DB
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// CONNECT TO DB
pool.getConnection((err, connection) => {
    if (err) {
        throw err;
    }
    if(connection) {
        console.log(`Connected to database as ID: ${connection.threadId}`);
        connection.release();
    }
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;