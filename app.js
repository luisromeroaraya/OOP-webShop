// https://www.youtube.com/watch?v=A01KtJTv1oc
// https://www.youtube.com/watch?v=1aXZQcG2Y6I

// IMPORT ENV CONFIG FILE
require('dotenv').config();

// IMPORT EXPRESS
const express = require("express");
const app = express();

// IMPORT EXPRESS HANDBLEBARS
const exphbs = require("express-handlebars");

// IMPORT ROUTER
const router = require("./routers/router");

// SET UP PORT
const port = process.env.PORT || 3000; // port will use the environment PORT if is set or else 3000

// BODY PARSER
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// STATIC FILES
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/images", express.static(__dirname + "public/images"));
app.use("/php", express.static(__dirname + "public/php"));
app.use("/webfonts", express.static(__dirname + "public/webfonts"));

// CONNECT TO ROUTER
app.use("/", router);

// CREATE CONNECTION POOL TO DB
const mysql = require("mysql");
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
    console.log(`Connected to database as ID: ${connection.threadId}`);
});

// SET UP LISTENER (SERVER)
app.listen(port, () => {
    console.info(`Listening on port ${port}...`);
});