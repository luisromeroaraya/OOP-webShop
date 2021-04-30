const pool = require('./pool');

function Newsletter() {};

Newsletter.prototype = {
    find : function(email = null, callback) { // Find the email by id or email.
        if(email) { // if the email variable is defined
            var field = Number.isInteger(email) ? 'id' : 'email'; // if email = number return field = id, if email = string return field = email.
        }
        let sql = `SELECT * FROM newsletter WHERE ${field} = ?`; // prepare the sql query
        pool.query(sql, email, (err, result) => {
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

    // CREATE NEW USER INTO DB
    create : function(body, callback) { // body is an object 
        let sql = `INSERT INTO newsletter(email) VALUES (?)`; // prepare the sql query
        pool.query(sql, [body.email], (err, result) => { // call the query give it the sql string and the values (bind array)
            if(err) throw err;
            callback(result.insertId); // return the last inserted id. if there is no error
        });
    },
}

module.exports = Newsletter;