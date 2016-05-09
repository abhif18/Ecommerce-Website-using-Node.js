var Cart = require('../models/cart');

module.exports = function(req,res,next){
  if(req.user){  //If passport authentication has succeded then req.user has the user
        var total = 0;
        Cart.findOne({ owner: req.user._id },function(err,existingCart){
         if(existingCart){
         	for(var i=0;i<existingCart.items.length;i++){
         		total+=existingCart.items[i].quantity;
         	}
         	res.locals.cart = total;//res.locals.xyz 
         	//res.locals is a way to store a local variable that can be accessed 
         	//in templates
         }
         else{
         	res.locals.cart = 0;
         }
         next();
        });
      }
      else{
      	next();
      }
};