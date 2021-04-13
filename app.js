var express = require('express');
var app = express();
var db = require('../3380NazaninBinesh-data/db');
var cors = require('cors')

var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '50mb'
}));

var corsOptions = {
    //origin: "http://localhost:3000",
    origin: "*",
    credentials: true
}

app.use(cors(corsOptions))


// var userRouter = require('./routes/user');
// app.use('/', userRouter);

var authRouter = require('./routes/auth')
//var productRouter = require('./routes/product')
app.use('/', authRouter)
//app.use('/addProduct', productRouter)


module.exports = app;