const express =require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
var bodyParser = require('body-parser');


let app =express()
const PORT = 3000;
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URI)
.then(()=>{
  console.log("Connected to the database")
})
.catch((error)=>{
  console.error("Error connecting to the database", error)
})

app.use(bodyParser.json());

// app.use('/api', createRouter);
app.use('/api/auth', require('./routes/userRouter'));
app.use('/api/posts', require('./routes/postRouter'));




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
