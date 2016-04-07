var router = require('express').Router();
var async = require('async');
var faker = require('faker');
var Category = require('../models/category');
var Product = require('../models/product');

router.post('/search',function(req,res,next){
  var s = req.body.search_string; 
/*  if(s=== ''){
    Product.find({},function(err,data){
      if(err) return next(err);
      res.json(data);
    });
  }
else{*/
  console.log(s);
  Product.search({
    query_string: { query: req.body.search_string }
  }, function(err,search_results) {
    if(err) return err;
    res.json(search_results);
  });
// }
});

router.get('/:name', function(req,res,next) {
	async.waterfall([
      function(callback){
      	console.log('Received GET Request for Category '+req.params.name);
       Category.findOne({name: req.params.name}, function(err,category) {
       	if(err) return next(err);
       	callback(null,category);
       });
      },
      function(category,callback){
        for(var i=0;i<30;i++){
        	var product = new Product();
        	product.category = category._id;
        	product.name = faker.commerce.productName();
        	product.image = faker.image.image();
          product.price = faker.commerce.price();
        	product.save();
        }
      }
		]);
	res.json({message: 'Success'});
});

module.exports = router;