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
	let sqlquery = "SELECT * FROM books WHERE name LIKE '%"+req.query.keyword+"%'";
        //let sqlquery = "SELECT * FROM books";
	// execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            res.render('search-result.ejs', {availablebooks: result, searchterm: req.query.keyword});
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
		// saving data in database
       		let sqlquery = "INSERT INTO Customer (first_name, last_name) VALUES (?,?)";
          	// execute sql query
          	let newrecord = [req.body.first, req.body.last];
          	db.query(sqlquery, newrecord, (err, result) => {
            	if (err) {
        		return console.error(err.message);
            	}
           	 else
            	res.send('Hello, '+req.body.first+' '+req.body.last);
 		});
	});
	app.get('/list', function(req, res) {
        // query database to get all the books
	let sqlquery = 'SELECT * FROM books';
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            res.render('list.ejs', {availablebooks: result});
        });
    	});
	app.post('/bookadded', function (req,res) {
          // saving data in database
          let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
          // execute sql query
          let newrecord = [req.body.name, req.body.price];
          db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
              return console.error(err.message);
            }
            else
            res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price);
            });
	});

	app.get('/menu', function(req,res){
        // query database to get all the books
        let sqlquery = 'SELECT * FROM Food';
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            res.render('list.ejs', {availablebooks: result});
        });
	});

	
}
