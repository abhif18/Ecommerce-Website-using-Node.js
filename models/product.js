var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosastic = require('mongoosastic');

var productSchema = new Schema({
	category: {type: Schema.Types.ObjectId, ref:'Category'},
	name: String,
	price: Number,
	image: String
});

productSchema.plugin(mongoosastic, {
	hosts:[
      'localhost:9200'
	]
});

module.exports = mongoose.model('Product',productSchema);