const bcrypt = require('bcrypt');
const pool = require('./pool');

function User() {};

User.prototype = {
    find : function(user = null, callback) { // Find the user data by id or username.
        if(user) { // if the user variable is defined
            var field = Number.isInteger(user) ? 'id' : 'username'; // if user = number return field = id, if user = string return field = username.
        }
        let sql = `SELECT * FROM users WHERE ${field} = ?`; // prepare the sql query
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

    // CREATE NEW USER INTO DB
    create : function(body, callback) { // body is an object 
        var password = body.password;
        body.password = bcrypt.hashSync(password, 10); // Hash the password before insert it into the database.
        let sql = "INSERT INTO users(username, email, password) VALUES (?, ?, ?)"; // prepare the sql query
        pool.query(sql, [body.username, body.email, body.password], (err, result) => { // call the query give it the sql string and the values (bind array)
            if(err) throw err;
            callback(result.insertId); // return the last inserted id. if there is no error
        });
    },

    // SIGN IN COMPARING PASSWORD IN DB
    signin : function(username, password, callback) {
        this.find(username, function(user) { // find the user data by his username.
            if(user) { // if there is a user by this username.
                if(bcrypt.compareSync(password, user.password)) { // now we check his password.
                    callback(user); // return his data.
                    return;
                }  
            }
            callback(null); // if the username/password is wrong then return null.
        });
    },

    // UPDATE USER OR EMAIL IN DB
    update : function(body, callback) { // body is an object
        let sql = "UPDATE users set username = ?, email = ? WHERE id = ?"; // prepare the sql query
        pool.query(sql, [body.username, body.email, body.id], (err, result) => { // call the query give it the sql string and the values (bind array)
            if(err) throw err;
            callback(body.id); // return the updated id if there is no error
        });
    },

    // UPDATE PASSWORD IN DB
    updatePassword : function(body, callback) { // body is an object
        var password = body.password;
        body.password = bcrypt.hashSync(password, 10); // Hash the password before insert it into the database.
        let sql = "UPDATE users set password = ? WHERE id = ?"; // prepare the sql query
        pool.query(sql, [body.password, body.id], (err, result) => { // call the query give it the sql string and the values (bind array)
            if(err) throw err;
            callback(body.id); // return the updated id if there is no error
        });
    }
}

module.exports = User;