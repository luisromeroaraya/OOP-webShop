// https://www.youtube.com/watch?v=A01KtJTv1oc
// https://www.youtube.com/watch?v=1aXZQcG2Y6I

// IMPORT ENV CONFIG FILE
require('dotenv').config();

// SET UP PORT
const port = process.env.PORT || 3000; // port will use the environment PORT if is set or else 3000

// IMPORTS
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const router = require("./routers/router");
const app = express();

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

// TEMPLATE ENGINE EXPRESS HANDBLEBARS
app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// SESSION
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2,
        sameSite: true,
        secure: false
    }
}));

// CONNECT TO ROUTER
app.use("/", router);

// ERRORS => PAGE NOT FOUND 404
app.use((req, res, next) =>  {
    var err = new Error('Page not found.');
    err.status = 404;
    next(err);
});

// HANDLING ERRORS
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});

// SET UP SERVER
app.listen(port, () => {
    console.info(`Listening on port ${port}...`);
});

module.exports = app;