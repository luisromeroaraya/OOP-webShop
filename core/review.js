const bcrypt = require('bcrypt');
const pool = require('./pool');

function Review() {};

Review.prototype = {
    find : function(review = null, callback) { // Find the review data by id or name.
        if(review) { // if the review variable is defined
            var field = Number.isInteger(review) ? 'id' : 'name'; // if review = number return field = id, if review = string return field = name.
        }
        let sql = `SELECT * FROM reviews WHERE ${field} = ?`; // prepare the sql query
        pool.query(sql, review, (err, result) => {
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

    // CREATE NEW REVIEW INTO DB
    create : function(body, callback) { // body is an object 
        let sql = "INSERT INTO reviews(product_id, user_id, review) VALUES (?, ?, ?)"; // prepare the sql query
        pool.query(sql, [body.product_id, body.user_id, body.review], (err, result) => { // call the query give it the sql string and the values (bind array)
            if(err) throw err;
            callback(result.insertId); // return the last inserted id. if there is no error
        });
    },

    // UPDATE REVIEW OR EMAIL IN DB
    update : function(body, callback) { // body is an object
        let sql = "UPDATE reviews set product_id = ?, user_id = ?, review_id = ? WHERE id = ?"; // prepare the sql query
        pool.query(sql, [body.product_id, body.user_id, body.review_id, body.id], (err, result) => { // call the query give it the sql string and the values (bind array)
            if(err) throw err;
            callback(body.id); // return the updated id if there is no error
        });
    },

    // SEARCH REVIEWS BY PRODUCT ID
    search : function(product_id = null, callback) { // Search by product_id.
        let sql = "SELECT * FROM reviews WHERE product_id = ?"; // prepare the sql query
        pool.query(sql, product_id, (err, rows) => {
            if(err) {
                throw err;
            }
            if(rows.length) {
                callback(rows);
            }
            else {
                callback(null);
            }
        });
    }
}

module.exports = Review;