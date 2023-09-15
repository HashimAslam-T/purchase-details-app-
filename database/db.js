const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'12345',
    database:'purchaseapi'
})


  
module.exports = connection;
