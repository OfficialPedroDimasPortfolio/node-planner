const mariadb = require('mariadb');

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const pwd = process.env.DB_PWD;
const dbname = process.env.DB_NAME;

console.log("HELLLLOOOOO" + host + user + pwd + dbname)

var pool = mariadb.createPool({
    host:host,
    user:user,
    password:pwd,
    database:dbname,
    connectionLimit: 50
});

async function getConn(){
    let conn = await pool.getConnection()
    return conn;
}

module.exports.getConn = getConn;