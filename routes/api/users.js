const express = require('express');
const db = require('../../database/db');
const bcrypt = require('bcryptjs');

const router = express.Router();

//Get all members
router.get('/',async (req,res) => {

    try{
        let users = await db.getUsers();
        res.json(users);
    }catch (err){
        console.log(err);
        res.status(500);
    }


});

//Get single member
router.get('/:email',async (req,res) =>{
    try{
        let user = await db.getUser(req.params.email)[0];
        console.log(user);
        if (user == null){
            return res.status(400).json({error:'Not a Valid Email'})
        }
        res.json(user);
    }catch (err){
        console.log(err);
        res.status(500);
    }


});

//Create User
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

    try{
        let changes = await db.addUser(newUser);
        console.log(changes);
        /*if (user == null){
            return res.status(400).json({error:'Not a Valid Email'})
        }*/
        res.json(changes);
    }catch (err){
        console.log(err);
        res.status(500).json({error:'Not a Valid Email or Username'});
    }

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

    try{
        let result = await db.getPassword(user);
        console.log(result);
        if (await bcrypt.compare(user.password, result[0].user_password)){
            return res.json({msg:'valid'});
        }else {
            return res.status(406).json({msg:'invalid User or password'});
        }
    }catch(err){
        console.log();
        res.status(500).json({error:'Not a Valid Email or or password'});
    }
});



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


module.exports = router;