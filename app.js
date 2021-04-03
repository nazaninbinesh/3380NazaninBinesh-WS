var express = require('express');
var app = express();
var db = require('../3380NazaninBinesh-data/db');
var cors = require('cors')

var corsOptions = {
    //origin: "http://localhost:3000",
    origin: "*",
    credentials: true
}

app.use(cors(corsOptions))

var userRouter = require('./routes/user');
app.use('/', userRouter);

var authRouter = require('./routes/auth')
app.use('/', authRouter)

module.exports = app;