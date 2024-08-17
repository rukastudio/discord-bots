const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`);
});

client.on('messageCreate', (message) => {
    console.log(message)
});

client.login(process.env.TOKEN);

const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'db-buf-05.sparkedhost.us',
    port: 3306, // Default port for MySQL
    user: 'u143949_Wv5pkUs1q6',
    password: 'sxN86zmnsvC+gRVGnz+lvTKx',
    database: 's143949_puppy-bot'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Example query
connection.query('SELECT * FROM `User`', (err, results, fields) => {
    if (err) {
        console.error('Error executing query:', err.stack);
        return;
    }
    console.log('Query results:', results);
});

// Close the connection when done
// You should manage connection pooling and closing based on your application's needs
connection.end();
