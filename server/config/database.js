
/**
 * File: server/config/database.js
 *
 * Configures and exports the MySQL database connection pool.
 * Uses environment variables for database credentials.
 */

const mysql = require('mysql2');

/**
 * MySQL connection pool.
 * @type {mysql.Pool}
 */
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


module.exports = connection.promise();
