const express = require('express');
const router1 = require('./router/productapi');
const router2 = require('./router/orderapi');
const router3 = require('./router/fetchingapi');
const router4 = require('./router/updateorderapi');
const router5 = require('./router/mailingapi');
const router6 = require('./router/excelToJsonApi');



const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/',router1);
app.use('/',router2);
app.use('/',router3);
app.use('/',router4);
app.use('/',router5);
app.use('/',router6);

  
app.listen(3000,(err) =>{
    if(err) console.log(err);
    else console.log("server runs");
})

