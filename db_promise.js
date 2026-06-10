import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "localhost", 
    port: 3308,
    user: "root", 
    password: "", 
    database: "Market", 
    waitForConnections: true, 
    connectionLimit: 10, 
    queueLimit: 0
});

export default pool;