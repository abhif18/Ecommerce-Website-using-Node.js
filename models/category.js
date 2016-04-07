var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
         name: { type:String, unique: true, lowercase: true }
	});

module.exports = mongoose.model('Category',categorySchema);