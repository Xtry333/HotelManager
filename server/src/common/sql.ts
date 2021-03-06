import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}

const pool = mysql.createPool({
    host: 'localhost',
    user: config.username,
    password: config.password,
    database: config.database,
    port: 3306,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;

/*
CREATE DATABASE hotelmanagerdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'manager'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON hotelmanagerdb . * TO 'manager'@'localhost';
USE hotelmanagerdb;
*/
