const mysql = require('mysql');

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const pwd = process.env.DB_PWD;
const dbname = process.env.DB_NAME;

const pool = mysql.createPool({
    connectionLimit: 10,
    host:host,
    user:user,
    password:pwd,
    database:dbname,
    port:3306
})

let db = {};

db.getUsers = () =>{
    let sql = "SELECT user_username, user_name, user_email FROM users;";
    return new Promise((resolve, reject) => {
        pool.query(sql, (err,result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });

};

db.getUser = (email) =>{
    let sql = "SELECT user_username, user_name, user_email FROM users WHERE user_email='"+ email +"';" ;
    return new Promise((resolve, reject) => {
        pool.query(sql, (err,result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });

};

db.addUser = (user) =>{
    let sql = "INSERT INTO users(user_username, user_name, user_email, user_password) VALUES ('" + user.username + "','" + user.name+ "','" +user.email + "','"+ user.password +"')" + ";";
    return new Promise((resolve, reject) => {
        pool.query(sql, (err,result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });

};
//recieves a simpleuser only
// {
// email:email@example.com,
// password:plainTextpasswordTocheck
// }
db.getPassword = (user) =>{
    let sql = "SELECT user_password FROM users WHERE user_email='"+ user.email +"';" ;
    return new Promise((resolve, reject) => {
        pool.query(sql, (err,result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });

};


module.exports = db;