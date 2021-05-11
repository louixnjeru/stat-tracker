module.exports = function(app)
{
	app.get('/',function(req,res){
        	res.end('Hello')
     	});

	app.get('/stats',function(req,res){
		var scraper = require('table-scraper');
scraper
  .get('https://www.foxsports.com/nba/standings')
  .then(function(tableData) {
	res.render('ststs.ejs'{east: tableData[0},east:tableData[1]);
  });
     	});
}
