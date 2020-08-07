const express = require('express');
const db = require('../../database/db');

const router = express.Router();

//Get Events
router.get('/',async (req,res) => {

    try{
        let events = await db.getEvents();
        res.json(events);
    }catch (err){
        console.log(err);
        res.status(500);
    }

});

//Get Event
router.get('/:id',async (req,res) =>{
    try{
        let event = await db.getEvent(req.params.id);
        if (event[0] == null){
            return res.status(400).json({error:'Not a Valid Email'})
        }
        res.json(event);
    }catch (err){
        console.log(err);
        res.status(500);
    }


});

//Create Event
//{
//     "title":"title",
//     "description": "Hello ",
//     "creator":"ecample@test.pt"
// }
router.post('/', async (req,res) => {

    if(!req.body.title || !req.body.description || !req.body.creator){
        return res.status(400).json({msg:"Please include title, description and creator email"});
    }

    try{
        let id = await db.getUserId(req.body.creator);

        let creator = id[0].user_id;

        console.log(creator);

        const event = {
            title: req.body.title,
            description: req.body.description,
            creator: creator
        }

        let changes = await db.addEvent(event);
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

//Get Events Attended by a user
router.get('/by/:email', async (req,res) =>{
    try{
        let idRow = await db.getUserId(req.params.email);

        if (idRow[0] == undefined) {
            return res.status(400).json({error:'Not a Valid Email'})
        }
        const id = idRow[0].user_id;

        let event = await db.getEventsAttendedBy(id);
        if (event[0] == null){
            return res.status(400).json({error:'Not a Valid Email'})
        }
        res.json(event);
    }catch (err){
        console.log(err);
        res.status(500);
    }
});

router.get('/attendees/:id', async (req,res) =>{
    try{
        let event = await db.getAttendees(req.params.id);
        if (event[0] == null){
            return res.status(400).json({error:'Not a Valid Email'})
        }
        res.json(event);
    }catch (err){
        console.log(err);
        res.status(500);
    }
});

router.post('/attend', async (req,res) =>{
    const uid = req.query.uid;
    const eid = req.query.eid;

    if (eid == undefined || uid == undefined){
        return res.status(400).json({msg:"Send user id and event id as query params"});
    }

    try{
        let response = await db.attend(eid,uid);
        console.log(response);
        res.json(response);
    }catch (err){
        console.log(err);
        res.status(500);
    }

});

module.exports = router;