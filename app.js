const express =require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const createRouter = require('./router')
var bodyParser = require('body-parser');

const app =express()
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

app.use('/api', createRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
