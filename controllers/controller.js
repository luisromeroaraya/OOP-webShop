// IMPORT USER CLASS
const User = require("../core/user");
const user = new User(); // CREATE USER OBJECT

// IMPORT NEWSLETTER CLASS
const Newsletter = require("../core/newsletter");
const newsletter = new Newsletter(); // CREATE NEWSLETTER OBJECT

// IMPORT CONTACT CLASS
const Contact = require("../core/contact");
const contact = new Contact(); // CREATE CONTACT OBJECT

// VIEWS
exports.renderHomePage = (req, res) => {
    let login = false;
    let user = req.session.user;
    console.log(user);
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
exports.renderOurLocation = (req,res) => {
    let login = false;
    let user = req.session.user;
    if (user) {
        login = true;
    }
    res.render(process.cwd() + "/views/our-location", {shop : true, login});
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

// CLIENT AREA
exports.login = (req,res) => {
    let login = false;
    let user = req.session.user;
    if (user) {
        login = true;
    }
    res.render(process.cwd() + "/views/login", {shop : true, login, username: user.username, email: user.email });
};

// POST UPDATE (USERNAME OR EMAIL)
exports.update = async (req, res) => {
    if (!req.body.email) {
        req.body.email = req.session.user.email;
    }
    if (!req.body.username) {
        req.body.username = req.session.user.username;
    }
    const validation = validateUpdate(req.body);
    if (validation.error) { // if body doesn"t exist or anything then 400 Bad request
        res.status(400).send(validation.error.details[0].message);
        return;
    }
    req.body.id = req.session.user.id;
    let userInfo = {
        id: req.body.id,
        username: req.body.username,
        email: req.body.email
    };
    user.update(userInfo, (updatedId) => { // call update function to update user. if there is no error this function will return it's id
        if(updatedId) { // Get the updated user data by it's id and store it in a session
            user.find(updatedId, (result) => {
                req.session.user = result;
                console.log("User info update succesful.");
                res.redirect('/login.html'); // redirect user to login & security
            });
        }
        else {
            console.log('Error updating user...');
        }
    });
};

// POST UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
    const validation = validatePassword(req.body);
    if (validation.error) { // if body doesn"t exist or anything then 400 Bad request
        res.status(400).send(validation.error.details[0].message);
        return;
    }
    req.body.id = req.session.user.id;
    let userInfo = {
        id: req.body.id,
        password: req.body.password
    };
    user.updatePassword(userInfo, (updatedId) => { // call update function to update user. if there is no error this function will return it's id
        if(updatedId) { // Get the updated user data by it's id and store it in a session
            user.find(updatedId, (result) => {
                req.session.user = result;
                console.log("Password update succesful.");
                res.redirect('/login.html'); // redirect user to login & security
            });
        }
        else {
            console.log('Error updating user...');
        }
    });
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
                console.log(result);
                console.log("Registration succesful.");
                res.redirect('/'); // redirect user to home
            });
        }
        else {
            console.log('Error creating a new user...');
        }
    });
};

// POST SIGN IN
exports.signin = (req, res, next) => {
    user.signin(req.body.username, req.body.password, (rows) => {
        if (rows) {
            req.session.user = rows;
            console.log(req.session.user);
            console.log(`Signed in as ${req.session.user.username}.`);
            res.redirect('/'); // redirect user to home
        }
        else {
            console.log("Wrong username or password.");
        }
    })
};

// POST LOGOUT
exports.logout = (req, res, next) => {
    req.session.destroy(err => { // destroy session
        console.log("Session ended.");
        res.clearCookie('connect.sid'); // destroy cookie
        res.redirect('/'); // redirect user to home
    });
};

// POST NEWSLETTER
exports.newsletter = async (req, res) => {
    const validation = validateEmail(req.body);
    if (validation.error) { // if body doesn"t exist or username too short then 400 Bad request
        res.status(400).send(validation.error.details[0].message);
        return;
    }
    let newsletterInfo = {
        email: req.body.email,
    };
    newsletter.create(newsletterInfo, (lastId) => { // call create function to create a new newsletter. if there is no error this function will return it's id
        if(lastId) { // Get the newsletter data by it's id
            newsletter.find(lastId, (result) => {
                console.log(result);
                console.log("Subscription to newsletter succesful.");
                res.redirect('/'); // redirect user to home
            });
        }
        else {
            console.log('Error subscribing to newsletter...');
        }
    });
};

// POST CONTACT FORM
exports.contact = async (req, res) => {
    const validation = validateContact(req.body);
    if (validation.error) { // if body doesn"t exist or anything then 400 Bad request
        res.status(400).send(validation.error.details[0].message);
        return;
    }
    let contactInfo = {
        username: req.body.username,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
    };
    contact.create(contactInfo, (lastId) => { // call create function to create a new contact. if there is no error this function will return it's id
        if(lastId) { // Get the contact data by it's id
            contact.find(lastId, (result) => {
                console.log(result);
                console.log("Contact form sent.");
                res.redirect('/'); // redirect contact to home
            });
        }
        else {
            console.log('Error sending contact form...');
        }
    });
};

// VALIDATION functions using Joi
function validateUser(body) {
    const Joi = require('joi');
    const schema = Joi.object({ // we create a joi object with the valid schema to be verified
        username: Joi.string(),
        email: Joi.string().email({ minDomainSegments: 2 }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        repeat_password: Joi.ref('password'),
    }).with('password', 'repeat_password');
    return schema.validate(body);
}
function validateEmail(body) {
    const Joi = require('joi');
    const schema = Joi.object({ // we create a joi object with the valid schema to be verified
        email: Joi.string().email({ minDomainSegments: 2 })
    });
    return schema.validate(body);
}
function validateContact(body) {
    const Joi = require('joi');
    const schema = Joi.object({ // we create a joi object with the valid schema to be verified
        username: Joi.string(),
        email: Joi.string().email({ minDomainSegments: 2 }),
        subject: Joi.string(),
        message: Joi.string(),
    });
    return schema.validate(body);
}
function validateUpdate(body) {
    const Joi = require('joi');
    const schema = Joi.object({ // we create a joi object with the valid schema to be verified
        username: Joi.string(),
        email: Joi.string().email({ minDomainSegments: 2 }),
    });
    return schema.validate(body);
}
function validatePassword(body) {
    const Joi = require('joi');
    const schema = Joi.object({ // we create a joi object with the valid schema to be verified
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        repeat_password: Joi.ref('password'),
    }).with('password', 'repeat_password');
    return schema.validate(body);
}