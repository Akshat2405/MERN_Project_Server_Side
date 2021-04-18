const express=require('express');
const app=express(); 
const mongoose=require('mongoose');
const dotenv=require('dotenv');

//midddlewares
dotenv.config({path:'./config.env'})
const PORT=process.env.PORT;
//make royter and middlewarea
app.use(express.json());
app.use(require('./router/auth'));

//database
require('./db/conn');
// const User=require('./model/userSchema');

app.get('/',(req,res)=>{
     res.send(`Hello world i am definetly completed this series.`);
});

app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`); 
})