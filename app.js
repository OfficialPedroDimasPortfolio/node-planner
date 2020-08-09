const express = require('express');
const cors = require('cors');

//init express and set port
const app = express();
const port = process.env.PORT || 8080;

//init body parser midleware
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//app is listening
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

//members api routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/events', require('./routes/api/events'));


app.get('/', async function (req,res){
    res.send("Hello Wordl This is an api try /api/users");
});


