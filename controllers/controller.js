// IMPORT USER CLASS
const User = require("../core/user");

// CREATE USER OBJECT
const user = new User();

// VIEWS
exports.renderHomePage = (req, res) => {
    let login = false;
    let user = req.session.user;
    if (user) {
        login = true;
    }
    res.render(process.cwd() + "/views/index", {home : true, login});
};
exports.renderAboutPage = (req,res) => {
    let login = false;
    let user = req.session.user;
    if (user) {
        login = true;
    }
    res.render(process.cwd() + "/views/about", {about : true, login});
};
exports.renderCartPage = (req,res) => {
    let login = false;
    let user = req.session.user;
    if (user) {
        login = true;
    }
    res.render(process.cwd() + "/views/cart", {shop : true, login});
};
exports.renderCheckoutPage = (req,res) => {
    let login = false;
    let user = req.session.user;
    if (user) {
        login = true;
    }
    res.render(process.cwd() + "/views/checkout", {shop : true, login});
};
exports.renderContactUsPage = (req,res) => {
    let login = false;
    let user = req.session.user;
    if (user) {
        login = true;
    }
    res.render(process.cwd() + "/views/contact-us", {contact : true, login});
};
exports.renderGalleryPage = (req,res) => {
    let login = false;
    let user = req.session.user;
    if (user) {
        login = true;
    }
    res.render(process.cwd() + "/views/gallery", {gallery : true, login});
};
exports.renderIndexPage = (req,res) => {
    res.redirect('/');
};
exports.renderMyAccountPage = (req,res) => {
    let login = false;
    let user = req.session.user;
    if (user) {
        login = true;
    }
    res.render(process.cwd() + "/views/my-account", {shop : true, login});
};
exports.renderShopDetailPage = (req,res) => {
    let login = false;
    let user = req.session.user;
    if (user) {
        login = true;
    }
    res.render(process.cwd() + "/views/shop-detail", {shop : true, login});
};
exports.renderShopPage = (req,res) => {
    let login = false;
    let user = req.session.user;
    if (user) {
        login = true;
    }
    res.render(process.cwd() + "/views/shop", {shop : true, login});
};
exports.renderWishListPage = (req,res) => {
    let login = false;
    let user = req.session.user;
    if (user) {
        login = true;
    }
    res.render(process.cwd() + "/views/wishlist", {shop : true, login});
};

// POST REGISTER
exports.register = async (req, res) => {
    const validation = validateUser(req.body);
    if (validation.error) { // if body doesn"t exist or username too short then 400 Bad request
        res.status(400).send(validation.error.details[0].message);
        return;
    }
    let userInfo = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };
    user.create(userInfo, (lastId) => { // call create function to create a new user. if there is no error this function will return it's id
        if(lastId) { // Get the user data by it's id and store it in a session
            user.find(lastId, (result) => {
                req.session.user = result;
            });
        }
        else {
            console.log('Error creating a new user...');
        }
    });
    res.redirect('/'); // redirect user to home
};

// POST SIGN IN
exports.signin = (req, res, next) => {
    user.signin(req.body.username, req.body.password, (result) => {
        if (result) {
            req.session.user = result;
        }
        else {
            console.log("Wrong username or password.");
        }
    })
    res.redirect('/'); // redirect user to home
};

// POST LOGOUT
exports.logout = (req, res, next) => {
    req.session.destroy(err => { // destroy session
        console.log("Session ended.");
        res.clearCookie('connect.sid'); // destroy cookie
        res.redirect('/'); // redirect user to home
    });
};

// VALIDATION function using Joi
function validateUser(user) {
    const Joi = require('joi');
    const schema = Joi.object({ // we create a joi object with the valid schema to be verified
        username: Joi.string().required(),
        email: Joi.string().email({ minDomainSegments: 2 }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        repeat_password: Joi.ref('password'),
        register: ""
    }).with('password', 'repeat_password');
    return schema.validate(user);
}