const express = require('express');
const app = express();

app.get('/', (req,res)=>{
    res.send("hello this side Patel")
})

app.listen(3000,()=>{
    console.log("server is started on port 3000")
})