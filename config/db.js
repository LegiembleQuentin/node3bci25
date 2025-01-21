const mysql = require('mysql');
const config = require('db.config')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'paul',
    password: 'Need4school',
    database: 'quentin25'
});

connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

module.exports = connection;
