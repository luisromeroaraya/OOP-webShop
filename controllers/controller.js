// CREATE CONNECTION POOL TO DB
const mysql = require("mysql");
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// VIEWS
exports.renderHomePage = (req, res) => {
    res.render(process.cwd() + "/views/index", {home : true});
};
exports.renderAboutPage = (req,res) => {
    res.render(process.cwd() + "/views/about", {about : true});
};
exports.renderCartPage = (req,res) => {
    res.render(process.cwd() + "/views/cart", {shop : true});
};
exports.renderCheckoutPage = (req,res) => {
    res.render(process.cwd() + "/views/checkout", {shop : true});
};
exports.renderContactUsPage = (req,res) => {
    res.render(process.cwd() + "/views/contact-us", {contact : true});
};
exports.renderGalleryPage = (req,res) => {
    res.render(process.cwd() + "/views/gallery", {gallery : true});
};
exports.renderIndexPage = (req,res) => {
    res.render(process.cwd() + "/views/index", {home : true});
};
exports.renderMyAccountPage = (req,res) => {
    res.render(process.cwd() + "/views/my-account", {shop : true});
};
exports.renderShopDetailPage = (req,res) => {
    res.render(process.cwd() + "/views/shop-detail", {shop : true});
};
exports.renderShopPage = (req,res) => {
    res.render(process.cwd() + "/views/shop", {shop : true});
};
exports.renderWishListPage = (req,res) => {
    res.render(process.cwd() + "/views/wishlist", {shop : true});
};

// POST handler
exports.post = (req, res) => {
    if (req.body.register == "") {
        const validation = validateUser(req.body);
        if (validation.error) { // if body doesn"t exist or name too short then 400 Bad request
            res.status(400).send(validation.error.details[0].message);
            return;
        }
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        pool.getConnection((err, connection) => { // CONNECT TO DB AND ADD USER TO DB
            if (err) {
                throw err;
            }
            const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
            connection.query(sql, [user.name, user.email, user.password], (err, res) => {
                if (err) {
                    throw err;
                }
                console.log("Registration succesful.");
            });
        });
        res.render(process.cwd() + "/views/index");
    }
    else if (req.body.signin == "") {
        res.send("Sign in succesful.");
        const user = {
            email: req.body.email,
            password: req.body.password
        }
    }
    console.log(req.body);
};

// VALIDATION function using Joi
function validateUser(user) {
    const Joi = require('joi');
    const schema = Joi.object({ // we create a joi object with the valid schema to be verified
        name: Joi.string().required(),
        email: Joi.string().email({ minDomainSegments: 2 }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        repeat_password: Joi.ref('password'),
        register: ""
    }).with('password', 'repeat_password');
    return schema.validate(user);
}