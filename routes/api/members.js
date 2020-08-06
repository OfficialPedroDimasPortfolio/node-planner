const express = require('express');


const router = express.Router();

//Get all members
router.get('/',(req,res) => {
    res.json(members);
});

//Get single member
router.get('/:id',(req,res) =>{
    const found = members.some(member => member.id == req.params.id);
    if (found) {
        res.json(members.filter(member => member.id == req.params.id))
    }
    else {
        res.status(400).json({msg:`No member ith id ${req.params.id}`});
    }
});

//Create Member
router.post('/', (req,res) => {
    const newMember = {
        id:10,
        name: req.body.name,
        email: req.body.email,
        status: 'active'
    }

    if(!newMember.name || !newMember.email){
        res.status(400).json({msg:"Please include name and email"});
    }else{
        members.push(newMember);
        res.json(members);
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

module.exports = router;