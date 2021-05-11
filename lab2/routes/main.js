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
		//searching in the database
		res.send('This is the keyword you entered: '+req.query.keyword+'\nThis is the result of the search: ');
	});
	app.get('/register', function(req,res){
		res.render('register.html');
	});
	app.post('/registered', function(req,res){
		res.send('Hello, '+req.body.first+' '+req.body.last+'\nYou are registered with email address: '+req.body.email);
		//res.send(req.body);
	});
	
}
