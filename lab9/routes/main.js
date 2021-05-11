module.exports = function(app)
{
	const redirectLogin = (req, res, next) => {
   		if (!req.session.userId ) {
    	 		res.redirect('./login')
   		} else { next (); }
   	}

	const { check, validationResult } = require('express-validator');

	app.get('/', function(req,res){
		res.render('index.html');
	});

	app.get('/about', function(req,res){
		res.render('about.html');
	});

	app.get('/search', redirectLogin, function(req,res){
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

	app.get('/addbook', redirectLogin, function(req,res){
		res.render('addbook.html');
	});

	app.post('/registered', [check('email').isEmail()], function(req,res){
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			res.redirect('./register');
		} else {

		//saving data in database
        	var MongoClient = require('mongodb').MongoClient;
        	var url = 'mongodb://localhost';
		
		const bcrypt = require('bcrypt');
		const saltRounds = 10;	
		const plainPassword = req.sanitize(req.body.password);
		
		bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
		//store hashed password in your database
		MongoClient.connect(url, function(err, client) {
                        if (err) throw err;
                        var db = client.db ('mybookshopdb');

                        db.collection('users').insertOne({
                                username: req.body.username,
                                password: hashedPassword
                        });
                        client.close();
                        res.send('You are now registered, your username is '+req.body.username+', your password is '+req.body.password+' and your hashed password is '+hashedPassword);
                });
		});
			

        	/*MongoClient.connect(url, function(err, client) {
                	if (err) throw err;
                	var db = client.db ('mybookshopdb');

                	db.collection('users').insertOne({
                        	username: req.body.username,
                        	password: req.body.password
                	});
                	client.close();
                	res.send('You are now registered, your username is '+req.body.name+', your password is '+req.body.password+' and your hashed password is '+hashedPassword);
                });*/	
		}
	});

	app.get('/list', redirectLogin, function(req, res) {
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

	app.get('/login' , function (req,res) {
		res.render('login.html');
	});
	
	app.post('/loggedin', function(req,res) {
		// Load hashed password from your password database. (hint: use find() similar to search-result page)
		
		/*const bcrypt = require('bcrypt');
                const saltRounds = 10;
                const plainPassword = req.body.password;
		
		var MongoClient = require ('mongodb').MongoClient;
                var url = 'mongodb://localhost';
                var dbquery = req.body.username;
                MongoClient.connect(url, function (err, client) {
                        if (err) throw err;
                        var db = client.db('mybookshopdb');
                var searchQuery = db.collection('users').find({"username": dbquery});
                searchQuery.toArray((findErr, result) => {
                        if (findErr) throw findErr;
                        else
			console.log(result[0].password);
			var databasePassword = result[0].password;      
                        client.close();
                	var hashedPassword = bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
				console.log(databasePassword+' being compared to '+hashedPassword);
				bcrypt.compare(databasePassword, hashedPassword, function(err, result) {
                                	// if result == true ...
                                	if (result == true) {
                                        	res.send('You are now loggedin, You user name is: '+ req.body.name + ' your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
+ '<br />'+'<a href='+'./'+'>Home</a>');
                                	} else {
                                        	res.send('Incorrect details entered');
					};
                        	});
			});
                });			
	});*/
	  const saltRounds = 10;
          const plainPassword = req.body.password;
          const bcrypt  = require ('bcrypt');
          bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
          // check form data hashed password with the password saved in DB
          if (err) throw err;
          var MongoClient = require('mongodb').MongoClient;
          var url = 'mongodb://localhost';
          MongoClient.connect(url, function(err, client) {
          if (err) throw err;
          var db = client.db ('mybookshopdb');
          db.collection('users').findOne({name: req.body.name} ,function(err, result) {
          if (err) throw err;
          if(result == null){
          res.send('Login Unsuccessful, wrong username');
           }
          else {
           /// checking password is not included in this code
           // **** save user session here, when login is successful

	req.session.userId = req.body.username;

           res.send('You are now loggedin, You user name is: '+ req.body.name + ' your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
+ '<br />'+'<a href='+'./'+'>Home</a>');

           }
          client.close();
          })
        })
      });
	});

	app.get('/weather', function(req,res){
		const request = require('request');
		
		let apiKey = 'ae1a172338a38ae0bd600d18640063e8';
		let city = 'london'
		let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
		
		request(url, function (err, response, body) {
			if(err) {
				console.log('error:', error);
			} else {
				var weather = JSON.parse(body);
				var wmsg = 'Weather in '+ weather.name +'<br>Temperature: '+weather.main.temp+'°C<br>Humidity: '+ weather.main.humidity+'%';
				res.send (wmsg);
				//res.send(body);
			}
		});
	})

	app.get('/api', function (req,res) {
     		var MongoClient = require('mongodb').MongoClient;
     		var url = 'mongodb://localhost';
     		MongoClient.connect(url, function (err, client) {
     			if (err) throw err;
			var db = client.db('mybookshopdb');
			db.collection('books').find().toArray((findErr, results) => {
				if (findErr) throw findErr;
				else
         				res.json(results);
				client.close();
			});
		});
	});
	
	app.get('/logout', redirectLogin, (req,res) => {
     		req.session.destroy(err => {
     			if (err) {
       				return res.redirect('./')
    			 }
     		res.send('you are now logged out. <a href='+'./'+'>Home</a>');
     		});
     	})

}
