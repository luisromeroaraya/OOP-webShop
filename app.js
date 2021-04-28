// https://www.youtube.com/watch?v=A01KtJTv1oc
// IMPORT EXPRESS
const express = require("express");
const app = express();

// IMPORT ROUTER
const router = require("./routers/router");

// SET UP PORT
const port = process.env.PORT || 3000; // port will use the environment PORT if is set or else 3000

// STATIC FILES
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/images", express.static(__dirname + "public/images"));
app.use("/php", express.static(__dirname + "public/php"));
app.use("/webfonts", express.static(__dirname + "public/webfonts"));

// CONNECT TO ROUTER
app.use("/", router);

// DB
const mysql = require("mysql");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "freshshop"
});

// CONNECT TO DB
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log("Database connected...");
});

// SET UP LISTENER (SERVER)
app.listen(port, function() {
    console.info(`Listening on port ${port}...`);
});
