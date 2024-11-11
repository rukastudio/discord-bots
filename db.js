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

const db = {}

db.query = async function (sql, params) {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (err) {
        console.error('Database query error:', err);
        throw err; // Rethrow the error for handling in the caller
    }
}

db.getpp = async function (userId) {
    let pp = 0;

    const results = await db.query('SELECT `Puppy Points` FROM `User` WHERE `User ID` = ?', [userId]);

    if (results.length === 0) {
        await db.query('INSERT INTO `User` (`User ID`, `Puppy Points`) VALUES (?, ?)', [userId, 0]);
    } else {
        pp = results[0]['Puppy Points'];
    }

    return pp
}

db.giftpp = async function (userId, otherUserId, amount) {
    await db.getpp(otherUserId);

    try {
        await db.query(`
            UPDATE \`User\`
            SET \`Puppy Points\` = CASE 
                WHEN \`User ID\` = ? THEN \`Puppy Points\` - ?
                WHEN \`User ID\` = ? THEN \`Puppy Points\` + ?
                ELSE \`Puppy Points\`
            END
            WHERE \`User ID\` IN (?, ?);
        `, [userId, amount, otherUserId, amount, userId, otherUserId]);

        console.log('Puppy Points updated successfully.');
    } catch (error) {
        console.error('Error updating Puppy Points:', error);
    }
}

db.subtractpp = async function(userId, amount) {

}

db.addpp = async function(userId, amount) {

}


module.exports = db;
