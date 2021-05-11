module.exports = function(app)
{
	app.get('/', function(req,res){
		res.render('index.html');
	});

	app.get('/about', function(req,res){
		res.render('about.html');
	});

	app.get('/search', function(req,res){
		res.render('search.html');
	});

	app.get('/search-result', function(req,res){
		// query database to get all the books
                var MongoClient = require ('mongodb').MongoClient;
                var url = 'mongodb://localhost';
                var dbquery = ".*"+req.query.keyword+".*";
		MongoClient.connect(url, function (err, client) {
                        if (err) throw err;
                        var db = client.db('mybookshopdb');
                var searchQuery = db.collection('books').find({name: new RegExp(dbquery,"i")});        
		searchQuery.toArray((findErr, results) => {
                        if (findErr) throw findErr;
                        else
				res.render('search-result.ejs', {availablebooks: results, searchterm: req.query.keyword});
                        client.close();
                        });
                });

	});

	app.get('/register', function(req,res){
		res.render('register.html');
	});

	app.get('/bookshop', function(req,res){
                res.render('bookshop.html');
        });

	app.get('/addbook', function(req,res){
		res.render('addbook.html');
	});

	app.post('/registered', function(req,res){
		//saving data in database
        	var MongoClient = require('mongodb').MongoClient;
        	var url = 'mongodb://localhost';

        	MongoClient.connect(url, function(err, client) {
                	if (err) throw err;
                	var db = client.db ('mybookshopdb');

                	db.collection('users').insertOne({
                        	username: req.body.username,
                        	password: req.body.password
                	});
                	client.close();
                	res.send('Hello, '+req.body.username+', you are now registered to the service');
        	});	
	});

	app.get('/list', function(req, res) {
        	// query database to get all the books
		var MongoClient = require ('mongodb').MongoClient;
		var url = 'mongodb://localhost';
		MongoClient.connect(url, function (err, client) {
			if (err) throw err;
			var db = client.db('mybookshopdb');
			db.collection('books').find().toArray((findErr, results) => {
			if (findErr) throw findErr;
			else
				res.render('list.ejs', {availablebooks:results});
			client.close();
			});
		});
    	});

	app.post('/bookadded', function (req,res) {
        //saving data in database
	var MongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost';

	MongoClient.connect(url, function(err, client) {
		if (err) throw err;
		var db = client.db ('mybookshopdb');
		
		db.collection('books').insertOne({
			name: req.body.name,
			price: req.body.price
		});
		client.close();
		res.send('This book is added to the database, name: '+req.body.name+' , price: £'+req.body.price);
	});
	});
	
}
