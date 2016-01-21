
module.exports = function (mongoose) {

	var UserSchema = mongoose.Schema({
		gg_id : {type : String, index: { unique: true, required : true } },
		username : {type : String, required : true, unique : true },
		email : {type : String, required : true, unique : true },
		group : { type: Number, default: 2 },
		money : { type: Number, default: 0 },
		status : {type : Number, default: 1 }
	});

	return mongoose.model('User', UserSchema);

};