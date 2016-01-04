
module.exports = function (mongoose) {

	var MenuSchema = mongoose.Schema({
		menuDate : Date,
		foodName : String,
		price : Number
	});

	return mongoose.model('Menu', MenuSchema);

};