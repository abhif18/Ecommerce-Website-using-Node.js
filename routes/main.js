var router = require('express').Router();
var Product = require('../models/product');

Product.createMapping(function(err,mapping) {
	if(err){
		console.log('Error in creating Mapping');
		console.log(err);
	}
	else{
		console.log('Successfully Created a Mapping');
		console.log(mapping);
	}
});

var stream = Product.synchronize();
var count = 0;

stream.on('data',function(){
	count++;
});
stream.on('close',function(){
console.log('Indexed '+count+' documents');
});
stream.on('error',function(err){
	console.log(err);
});

function paginate(req,res,next){
var perPage = 9;
      var page = req.params.page;

      Product.find().skip(perPage*page). //skip(9*3) means we are going to
      //populate 4th page and we have to skip first 9*3=27 products
      limit(perPage).populate('category').
      exec(function(err,products) {
          if(err) return next(err);
          Product.count().exec(function(err,count){
          	//Product.count() gives the total no of products
          	//count()/perPage will tell us the last page no
          	//after counting exec() runs
          	if(err) return next(err);
          	res.render('main/product-main',{
          		products: products,
          		pages: count/perPage  //Gives the current page no
          	});
          });
      });
}

router.post('/search',function(req,res,next) {
   return res.redirect('/search/?q='+ req.body.q); //Some changes might be possible
});

router.get('/search',function(req,res,next) {

if(req.query.q){
	Product.search({
		query_string: { query: req.query.q } 
	}, 	function(err,results){
          if(err) return nect(err);
          var data = results.hits.hits.map(function(hit){
          	//map() is a javascript function to simplify nested object
          	//see 40
               return hit;
          }); 
          res.render('main/search-results', {
          	query: req.query.q,
          	data: data
          });   
	});
  }
});

router.get('/', function(req,res,next) {
	if(req.user){
		//if the passport authentication is successfull then user object
		//will be stored in req.user
      paginate(req,res,next);
	}
	else{
	res.render('main/home');
        }
});

router.get('/page/:page',function(req,res,next){
	paginate(req,res,next);
});

router.get('/about',function(req,res) {
	res.render('main/about');
});

router.get('/products/:id',function(req,res,next) {
Product.find({category: req.params.id})
.populate('category')
.exec(function(err,products){
	if(err) return next(err);
	res.render('main/category', { products: products });
}); 
});
router.get('/product/:id' , function(req,res,next) {
	Product.findById({_id: req.params.id}, function(err,product) {
		if(err) return next(err);
		console.log(product.toString());
		res.render('main/product',{product:product});//Second parameter is a way of 
		//passing product data to main/product.ejs 
		//check out main/product.ejs we can access product schema details by using variable product
	});
});

module.exports = router;