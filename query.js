const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
    host: 'db-buf-05.sparkedhost.us',
    port: 3306,
    user: 'u143949_Wv5pkUs1q6',
    password: 'sxN86zmnsvC+gRVGnz+lvTKx',
    database: 's143949_puppy-bot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to query the database using async/await
async function query(sql, params) {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (err) {
        console.error('Database query error:', err);
        throw err; // Rethrow the error for handling in the caller
    }
}

// Export the query function
module.exports = query;
