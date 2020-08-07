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

//Users

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

db.getUserId = (email) =>{
    let sql = "SELECT user_id FROM users WHERE user_email='"+ email +"';" ;
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

//Events

db.getEvents = () =>{
    let sql = "SELECT event_title, event_description FROM events;";
    return new Promise((resolve, reject) => {
        pool.query(sql, (err,result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });

};

db.getEvent = (id) =>{
    let sql = "SELECT event_title, event_description FROM events WHERE event_id='"+ id +"';";
    return new Promise((resolve, reject) => {
        pool.query(sql, (err,result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });

};

db.getEventsCreatedBy = (id) =>{
    let sql = "SELECT event_title, event_description FROM events WHERE event_user_id = '" + id +"';";
    return new Promise((resolve, reject) => {
        pool.query(sql, (err,result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });

};

//Create Event
//{
//     "title":"title",
//     "description": "Hello ",
//     "creator":"ecample@test.pt"
// }
db.addEvent = (event) =>{
    let sql = "INSERT INTO events(event_title, event_description, event_user_id) VALUES ('" + event.title + "','" + event.description+ "','" + event.creator +"')" + ";";
    return new Promise((resolve, reject) => {
        pool.query(sql, (err,result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });

};

db.getEventsAttendedBy = (id) =>{
    let sql = "select event_title from events join participation p on events.event_id = p.p_event_id and p.p_user_id = '" + id +"';";
    return new Promise((resolve, reject) => {
        pool.query(sql, (err,result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });

};

db.getAttendees = (id) =>{
    let sql = "select user_name, user_email from users join participation p on users.user_id = p.p_user_id and p.p_event_id  = '" + id +"';";
    return new Promise((resolve, reject) => {
        pool.query(sql, (err,result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

db.attend = (e_id, u_id) =>{
    let sql = "insert into participation(p_user_id, p_event_id) VALUES ('"+ u_id +"','"+ e_id +"');";
    return new Promise((resolve, reject) => {
        pool.query(sql, (err,result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
}

module.exports = db;