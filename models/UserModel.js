
module.exports = function (mongoose) {

	var UserSchema = mongoose.Schema({
		gg_id : {type : String, index: { unique: true, required : true } },
		username : String,
		group : Number
	});

	return mongoose.model('User', UserSchema);

};