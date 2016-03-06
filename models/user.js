var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs'); //For Hashing the Passwords
var Schema = mongoose.Schema;
//User Schema
var UserSchema = new Schema({
           //Self Generated _id Will made be automatically
           email : {type: String, unique: true, lowercase: true},
           password : String,

           profile: {
           	name: {type: String, default: ''},
           	picture: {type: String, default: ''}
           },

           address: String,
           history: [{
           	date: Date,
           	paid: {type: Number, default: ''},
           	item: {type:Schema.Types.ObjectId, ref:''}
           }],
 
});

//Hash the Password to Save it
UserSchema.pre('save',function(next) {
	var user = this;
	if(!user.isModified('password')) return next();
           bcrypt.genSalt(10,function(error,salt) {
           	if(error) next(error);
           	bcrypt.hash(user.password,salt,null,function(error,hash) {
           		if(error) return next(error);
           		user.password=hash;
           		next();
           	});
           });
});

//Compare Passwords
UserSchema.methods.comparePassword = function(password){
return bcrypt.compareSync(password,this.password);
};
//Exporting UserSchema
module.exports = mongoose.model('User',UserSchema);