const express = require('express');
const mariadb = require('../../database/db');
const bcrypt = require('bcryptjs');

const router = express.Router();

//Get all members
router.get('/',async (req,res) => {
    var users = await getUsers();
    res.json(users);
});

//Get single member
router.get('/:email',async (req,res) =>{
    var user = await getUser(req.params.email);

    if (user.msg){
        return res.status(user.msg).json({error:'Not a Valid Email'})
    }
    res.json(user);
});

//Validate a User
router.post('/verify', async (req,res) =>{
    if(!req.body.email || !req.body.password){
        return res.status(400).json({msg:"Please include name, emailand password"});
    }

    const user = {
        email: req.body.email,
        password: req.body.password
    }

    var valid = await verifyUser(user);
    console.log(valid);
    if (valid.status === 400){
        return res.status(406).json({msg:'invalid User or password'});
    }
    else {
        return res.json({msg:'valid'});
    }


});

//Create Member
//{
//     "username":"user",
//     "name": "name name ",
//     "email":"ecample@test.pt",
//     "password":"password"
// }
router.post('/', async (req,res) => {

    if(!req.body.username || !req.body.email || !req.body.password){
         return res.status(400).json({msg:"Please include name, emailand password"});
    }

    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(req.body.password,8);
    }catch (err){
        console.log("HASHING ERROR ON CREATE")
        return res.status(500).json({msg:'Error Hasing Password'});
    }

    const newUser = {
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    }

    var query = await addUser(newUser);
    res.json(query);

})

//Update Member TODO this method
/*router.put('/:id',(req,res) =>{
    const found = members.some(member => member.id == req.params.id);
    if (found) {
        const updatdMember = req.body;
        members.forEach(
            member => {
                if (member.id == req.params.id){
                    if (updatdMember.name) {
                        member.name = updatdMember.name;
                    }
                    if (updatdMember.email) {
                        member.email = updatdMember.email;
                    }
                }
            }
        );
        res.json(members.filter(member => member.id == req.params.id))
    }
    else {
        res.status(400).json({msg:`No member ith id ${req.params.id}`});
    }
});
*/


async function getUsers(){
    try{
        let conn = await mariadb.getConn();

        const rows = await conn.query("SELECT user_username, user_name, user_email FROM users;");

        conn.end();

        return(rows);
    }catch(err){
        console.log("Error")
    }
}

async function getUser(email){
    try{
        let conn = await mariadb.getConn();

        const rows = await conn.query("SELECT user_username, user_name, user_email FROM users WHERE user_email='"+ email +"';" );

        await conn.end();

        return(rows);
    }catch(err){
        console.log("Error in getUser")
        return ({
            msg:400
        })
    }
}

async function addUser(user){
    try{
        let conn = await mariadb.getConn();

        var query = "INSERT INTO users(user_username, user_name, user_email, user_password) VALUES ('" + user.username + "','" + user.name+ "','" +user.email + "','"+ user.password +"')" + ";";
        const rows = await conn.query(query);

        conn.end();

        return(rows);
    }catch(err){
        console.log("Error adding user");
    }
}

//recieves a simpleuser only {
// email:email@example.com,
// password:plainTextpasswordTocheck
// }
async function verifyUser(user){
    try{
        let conn = await mariadb.getConn();
        var query = "SELECT user_password FROM users WHERE user_email='"+ user.email +"';" ;
        const rows = await conn.query(query);
        conn.end();
        if (await bcrypt.compare(user.password, rows[0].user_password)){
            return ({
                status:200
            })
        }

        return ({
            status:400
        })
    }catch(err){
        console.log("Error in userVerification");
        return ({
            msg:400
        })
    }
}



module.exports = router;