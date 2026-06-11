const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'last_bench_toppers',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Connection failed:', err.message);
        return;
    }
    console.log('✅ Connected to MySQL successfully!');
    
    connection.query('SELECT "Hello Database" as message', (err, results) => {
        if (err) {
            console.error('Query failed:', err);
            return;
        }
        console.log('Result:', results[0].message);
        connection.end();
    });
});