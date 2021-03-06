var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) { //access control
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type');
  next();
});

// API
app.use('/api/sk', require('./api/sk'));
app.use('/api/smu', require('./api/smu'));
app.use('/api/toeic', require('./api/toeic'));
app.use('/api/qnet', require('./api/qnet'));


// Server
var port = 4000;
app.listen(port, function(){
  console.log('listening on port:' + port);
});
