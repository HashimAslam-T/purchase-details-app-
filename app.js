const express = require('express');
const router1 = require('./router/productapi');
const router2 = require('./router/orderapi');
const router3 = require('./router/fetchingapi');
const router4 = require('./router/updateorderapi');


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/',router1);
app.use('/',router2);
app.use('/',router3);
app.use('/',router4);

  
app.listen(3000,(err) =>{
    if(err) console.log(err);
    else console.log("server runs");
})

