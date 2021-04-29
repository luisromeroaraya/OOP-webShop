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
    let login = false;
    if (req.session.userId) {
        login = true;
    }
    res.render(process.cwd() + "/views/index", {home : true, login});
};
exports.renderAboutPage = (req,res) => {
    let login = false;
    if (req.session.userId) {
        login = true;
    }
    res.render(process.cwd() + "/views/about", {about : true, login});
};
exports.renderCartPage = (req,res) => {
    let login = false;
    if (req.session.userId) {
        login = true;
    }
    res.render(process.cwd() + "/views/cart", {shop : true, login});
};
exports.renderCheckoutPage = (req,res) => {
    let login = false;
    if (req.session.userId) {
        login = true;
    }
    res.render(process.cwd() + "/views/checkout", {shop : true, login});
};
exports.renderContactUsPage = (req,res) => {
    let login = false;
    if (req.session.userId) {
        login = true;
    }
    res.render(process.cwd() + "/views/contact-us", {contact : true, login});
};
exports.renderGalleryPage = (req,res) => {
    let login = false;
    if (req.session.userId) {
        login = true;
    }
    res.render(process.cwd() + "/views/gallery", {gallery : true, login});
};
exports.renderIndexPage = (req,res) => {
    res.redirect('/');
};
exports.renderMyAccountPage = (req,res) => {
    let login = false;
    if (req.session.userId) {
        login = true;
    }
    res.render(process.cwd() + "/views/my-account", {shop : true, login});
};
exports.renderShopDetailPage = (req,res) => {
    let login = false;
    if (req.session.userId) {
        login = true;
    }
    res.render(process.cwd() + "/views/shop-detail", {shop : true, login});
};
exports.renderShopPage = (req,res) => {
    let login = false;
    if (req.session.userId) {
        login = true;
    }
    res.render(process.cwd() + "/views/shop", {shop : true, login});
};
exports.renderWishListPage = (req,res) => {
    let login = false;
    if (req.session.userId) {
        login = true;
    }
    res.render(process.cwd() + "/views/wishlist", {shop : true, login});
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
        pool.getConnection((err, connection) => { // CONNECT TO DB AND ADD USER
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
        req.session.userId = 1;
        res.redirect('/');
    }
    else if (req.body.signin == "") {
        const user = {
            email: req.body.email,
            password: req.body.password
        }
        pool.getConnection((err, connection) => { // CONNECT TO DB AND SEARCH FOR USER
            if (err) {
                throw err;
            }
            const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
            connection.query(sql, [user.email, user.password], (err, res) => {
                if (err) {
                    throw err;
                }
                const result = JSON.parse(JSON.stringify(res))[0];
                if (result) {
                    console.log(`Sign in succesful for user: ${result.id}`);
                }
            });
        });
        req.session.userId = 1;
        res.redirect('/');
    }
};

// LOGOUT
exports.logout = (req, res) => {
    console.log(req.get('cookie'));
    req.session.destroy(err => {
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
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