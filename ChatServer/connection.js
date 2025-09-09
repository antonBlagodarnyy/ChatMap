"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.con = void 0;
const mysql = require('mysql2');
exports.con = mysql.createConnection({
    host: "localhost",
    port: "3307",
    database: "ChatMapDB",
    user: "admin",
    password: "admin2025",
});
