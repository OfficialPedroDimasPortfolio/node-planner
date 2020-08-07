const express = require('express');
const db = require('../../database/db');

const router = express.Router();

router.get('/:id',async (req,res) => {

    try{
        let post = await db.getPost(req.params.id);
        res.json(post);
    }catch (err){
        console.log(err);
        res.status(500);
    }

});

router.get('/event/:id', async (req,res)=>{
    try{
        let posts = await db.getPost(req.params.id);
        res.json(posts);
    }catch (err){
        console.log(err);
        res.status(500);
    }
});

router.get('/user/:email', async(req,res) =>{
    try{
        let posts = await db.getPostsFromUser(req.params.id);
        res.json(posts);
    }catch (err){
        console.log(err);
        res.status(500);
    }
});

router.get('/eventuser', async(req, res)=>{
    const uid = req.query.uid;
    const eid = req.query.eid;

    if (eid == undefined || uid == undefined){
        return res.status(400).json({msg:"Send user id and event id as query params"});
    }

    try{
        let posts = await db.getPostFromUserInEvent(uid,eid);
        res.json(posts);
    }catch (err){
        console.log(err);
        res.status(500);
    }
});
//Create Post
//{
//     "title":"title",
//     "body": "Hello ",
//     "eventId":"id",
//     "email":"email@ex.com"
// }
router.post('/', async (req,res)=>{
    if(!req.body.title || !req.body.body || !req.body.eventId || !req.body.email){
        return res.status(400).json({msg:"Please include title, body, eventId and creator email"});
    }

    try{
        let id = await db.getUserId(req.body.email);

        let uid = id[0].user_id;

        const post = {
            title: req.body.title,
            body: req.body.body,
            uid: uid,
            eventId: req.body.eventId
        }

        let changes = await db.addPost(post);
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

router.delete('/:id', async (req,res) =>{
    try{
        let post = await db.deletePost(req.params.id);
        res.json(post);
    }catch (err){
        console.log(err);
        res.status(500);
    }
});

module.exports = router;