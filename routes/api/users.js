const express = require('express');
const mariadb = require('../../database/db');

const router = express.Router();

//Get all members
router.get('/',async (req,res) => {
    var users = await getUsers();
    res.json(users);
});

//Get single member
router.get('/:id',async (req,res) =>{
    var user = await getUser(req.params.id);
    res.json(user);
});

//Create Member
router.post('/', async (req,res) => {
    const newUser = {
        username: req.body.username,
        name: req.body.name,
        email: req.body.email
    }

    if(!newUser.username || !newUser.email){
        res.status(400).json({msg:"Please include name and email"});
    }else{
        var req = await addUser(newUser);
        res.json(req);
    }
})

//Update Member
router.put('/:id',(req,res) =>{
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

async function getUsers(){
    try{
        let conn = await mariadb.getConn();

        const rows = await conn.query("SELECT * FROM users;");

        conn.end();

        return(rows);
    }catch(err){
        console.log("Error")
    }
}

async function getUser(id){
    try{
        let conn = await mariadb.getConn();

        const rows = await conn.query("SELECT * FROM users WHERE user_id="+ id +";" );

        conn.end();

        return(rows);
    }catch(err){
        console.log("Error")
    }
}

async function addUser(user){

    console.log(user);
    try{
        let conn = await mariadb.getConn();
        var query = "INSERT INTO users(user_username, user_name, user_email) VALUES ('" + user.username + "','" + user.name+ "','" +user.email + "')" + ";";
        const rows = await conn.query(query);

        conn.end();

        return(rows);
    }catch(err){
        console.log("Error")
    }
}

module.exports = router;