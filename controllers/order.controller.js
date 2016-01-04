
var moment = require('moment');

function getMenuListByDay(req, res){
	var sess = req.session;
	if (sess.current_user) {

		var date = req.params.date;
		var orderDate, verifyDate;
		if(date === moment().format("DD-MM-YYYY")) {
			res.redirect('/order/today');
		} else if(date === 'today') {
			verifyDate = moment();
		} else {
			verifyDate = moment(date, "DD-MM-YYYY");
		}

		if(!verifyDate.isValid()) {
			sess.message = { content : 'Wrong date format', type : 'danger' };
			res.redirect('/order/today');
		}
		
		orderDate = new Date(verifyDate.format("YYYY-MM-DD") + "T00:00:00.000Z");

		var currentChoide = null;

		global.Server.Model.MenuModel.find({ menuDate : orderDate }, function(err, menus) {

			menus = menus.sort({'foodName' : -1});

			global.Server.Model.OrderModel.findOne({ orderDate : orderDate, userId : req.currentData.current_user.id }, function(err, order) {

				if(order) {
					currentChoide = order.menuId;
				}

				var str_date = verifyDate.format("DD/MM/YYYY");
				var dayOfWeek = verifyDate.format("dddd");

				var priv_date = verifyDate.subtract(1, 'days').format("DD-MM-YYYY");
				if(priv_date === moment().format("DD-MM-YYYY")){
					priv_date = 'today';
				}

				var next_date = verifyDate.add(2, 'days').format("DD-MM-YYYY");
				if(next_date === moment().format("DD-MM-YYYY")){
					next_date = 'today';
				}

				res.render('order', { 
										data : req.currentData,
										menus : menus,
										currentChoide : currentChoide,
										str_date : str_date,
										dayOfWeek : dayOfWeek,
										priv_date : priv_date,
										next_date : next_date
									});
			});

		});

	} else {
		sess.message = { content : 'You must login to order!', type : 'danger' };
		res.redirect('/');
	}
}

function orderFoodByDay(req, res){
	var data = {};
	var foodId = req.body.foodId;
	var orderDate = req.body.orderDate;

	if(foodId.length == 0 || orderDate.length == 0){
		res.redirect('/');
	}

	if(!moment(orderDate, "DD/MM/YYYY").isValid()) {
		data = { content : 'Date: Wrong format!', type : 'danger' };
		res.send(JSON.stringify(data));
		return;
	}

	if( orderDate != moment().format("DD/MM/YYYY") && moment(orderDate, "DD/MM/YYYY").isBefore(moment()) ) {
		data = { content : 'You can not order for pass day!', type : 'danger' };
		res.send(JSON.stringify(data));
		return;
	}

	global.Server.Model.MenuModel.findOne({_id : foodId}, function(err, data) {

	  	if(!data) {
	  		data = { content : 'Menu: Food does not exist!', type : 'danger' };
	  		res.send(JSON.stringify(data));
			return;
	  	} else {
	  		var searchDate = moment(orderDate, "DD/MM/YYYY").format("YYYY-MM-DD");
			searchDate = new Date(searchDate + "T00:00:00.000Z");
			global.Server.Model.OrderModel.findOne({orderDate : searchDate}, function(err, data) {

			  	if(data) {
			  		//if update order equal current order, delete it
			  		if(data.menuId === foodId) {
			  			global.Server.Model.OrderModel.find({ _id : data._id }).remove( function(err){
			  				data = { content : 'Deleted order successfully!', type : 'success' };
					  		res.send(JSON.stringify(data));
							return;
			  			});
			  		} else {
			  			// ReOrder, update current order
				  		global.Server.Model.OrderModel.update({ _id: data._id }, { $set: { menuId : foodId }}, function(err){
			  				data = { content : 'ReOrdered successfully!', type : 'success' };
					  		res.send(JSON.stringify(data));
							return;
				  		});
			  		}
			  	} else {
			  		// Order at first time, create new order
		  			var order = new global.Server.Model.OrderModel;
					order.userId = req.currentData.current_user.id;
					order.menuId = foodId;
					order.orderDate = moment(orderDate, "DD/MM/YYYY").toISOString();
					order.actTime = moment(orderDate, "DD/MM/YYYY").toISOString();

					order.save(function(err) {
						if(err) { throw err }
						data = { content : 'Ordered successfully!', type : 'success' };
						res.send(JSON.stringify(data));
						return;
					});
			  	}
			  
		  	});
	  	}
  	});
}

function foodIdExist(foodId, cb){
	
}

module.exports.getMenuListByDay = getMenuListByDay;
module.exports.orderFoodByDay = orderFoodByDay;
module.exports.foodIdExist = foodIdExist;
