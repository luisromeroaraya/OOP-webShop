const pool = require('./pool');

function Product() {};

Product.prototype = {
    list : function(callback) {
        let sql = "SELECT * FROM products"; // prepare the sql query
        pool.query(sql, (err, rows) => {
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
    }, 

    find : function(product = null, callback) { // Get the product data by id or name.
        if(product) { // if the product variable is defined
            var field = Number.isInteger(product) ? 'id' : 'name'; // if product = number return field = id, if product = string return field = name.
        }
        let sql = `SELECT * FROM products WHERE ${field} = ?`; // prepare the sql query
        pool.query(sql, product, (err, result) => {
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

    search : function(keyword = null, callback) { // Search by keyword.
        let sql = `SELECT * FROM products WHERE name LIKE '%${keyword}%' OR description LIKE '%${keyword}%' OR category LIKE '%${keyword}%'`; // prepare the sql query
        pool.query(sql, (err, rows) => {
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

module.exports = Product;