const express=require('express')
const app =express()
require("dotenv").config();
const port=process.env.PORT || 5000
app.get('/',(req,res)=>{
res.send('the server is responsing')
})
app.listen(port,()=>{
    console.log('hello i am from server')
})
