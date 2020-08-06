const express = require('express');
const path = require('path');

//init express and set port
const app = express();
const port = process.env.PORT || 8080;

//init body parser midleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Set Static folder
//app.use(express.static(path.join(__dirname,'public')))
app.get('/', (req,res)=>{
   res.send(process.env.DB_HOST+ " " + process.env.DB_USER + " " + process.env.DB_PWD + " " + process.env.DB_NAME);
});
//members api routes
app.use('/api/members', require('./routes/api/members'))

//app is listening
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

