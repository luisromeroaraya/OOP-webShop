const bcrypt = require('bcrypt');
const pool = require('./pool');

function Contact() {};

Contact.prototype = {
    find : function(user = null, callback) { // Find the user data by id or username.
        if(user) { // if the user variable is defined
            var field = Number.isInteger(user) ? 'id' : 'username'; // if user = number return field = id, if user = string return field = username.
        }
        let sql = `SELECT * FROM contacts WHERE ${field} = ?`; // prepare the sql query
        pool.query(sql, user, (err, result) => {
            if(err) {
                throw err;
            }
            if(result.length) {
                callback(result[0]);
            }
            else {
                callback(null);
            }
        });
    },

    // CREATE NEW CONTACT INTO DB
    create : function(body, callback) { // body is an object 
        let sql = `INSERT INTO contacts(username, email, subject, message) VALUES (?, ?, ?, ?)`; // prepare the sql query
        pool.query(sql, [body.username, body.email, body.subject, body.message], (err, result) => { // call the query give it the sql string and the values (bind array)
            if(err) throw err;
            callback(result.insertId); // return the last inserted id. if there is no error
        });
    },
}

module.exports = Contact;