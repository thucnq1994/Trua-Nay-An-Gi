
module.exports = function (mongoose) {

	var OrderSchema = mongoose.Schema({
  	userId : { type: Object, ref: 'User' },
  	menuId : { type: Object, ref: 'Menu' },
		orderDate : Date,
		actTime : Date
	});

	return mongoose.model('Order', OrderSchema);

};