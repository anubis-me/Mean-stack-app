var express = require('express');
var app = express();
var port =process.env.PORT ||8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var bodyParser = require('body-parser');
var path = require('path');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.use('/api',appRoutes);

mongoose.connect('mongodb://abhi:1234@ds131742.mlab.com:31742/mean', function (err) {
    if(err){
        console.log('Not connected to the database '+ err);
    }
    else{
        console.log('Successfully connected to MongoDb');
    }
});


app.get('*',function (req,res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function(){
    console.log('Running the server lol ' + port );
});
