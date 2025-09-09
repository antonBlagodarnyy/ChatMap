const mysql = require('mysql2');

export const con = mysql.createConnection({
    host: "localhost",
    port:"3307",
    database:"ChatMapDB",
    user:"admin",
    password:"admin2025",
})

