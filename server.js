var express = require("express");
var app = express();
var path= require("path");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded());

var server = app.listen(8000, function() {
	console.log('listening on port 8000');
});

var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket){
	socket.on("info", function (data){
		console.log(data);
	});
});


mongoose.connect('mongodb://localhost/hedgehog');
var HedgehogSchema = new mongoose.Schema({
	name: String,
	age: Number,
	color: String
});
var Hedgehog = mongoose.model('Hedgehog', HedgehogSchema);

app.get('/', function(req, res) {
	Hedgehog.find({}, function(err, hedgehogs){
		if(err) {
			console.log('something went wrong');
		} else {
			console.log(hedgehogs);
			res.render('index', {view_all: hedgehogs});
		}
	});
});

app.get("/edit/:id", function(req, res){
	console.log('Need to render the information for', req.params.id);
	Hedgehog.findOne({_id: req.params.id}, function (err, hedgehog){
		res.render('info', {view_one: hedgehog});
	});
});
app.post('/add_hedgehog', function(req, res){
	console.log("POST DATA", req.body);
	var hedgehog = new Hedgehog({name: req.body.name, age: req.body.age, color: req.body.color});
	hedgehog.save(function (err){
		if(err) {
			console.log("something went wrong");
		} else {
			console.log("successfuly added a new hedgehog!");
			res.redirect('/');
		}
	});
});
app.post('/update_hedgehog/:id', function(req, res){
	Hedgehog.update({_id: req.params.id}, {name: req.body.name, age: req.body.age, color: req.body.color}, function (err, user){
		res.redirect('/');
	});

});
app.get('/remove/:id', function(req, res){
	Hedgehog.remove({_id: req.params.id}, function (err, user){
		res.redirect('/');
	});

});

