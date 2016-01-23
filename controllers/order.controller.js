
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

		getMenuByDate({ menuDate : orderDate }, function(err, menus){

			getCurrentOrderFood({orderDate : orderDate, userId : req.currentData.current_user.id}, function(err, order){
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

function getMenuByDate( param, cb){
	global.Server.Model.MenuModel.find(param, function(err, menus) {

		if (err) {
			return cb && cb(err);
		}

		menus = menus.sort({'foodName' : -1});

		return cb && cb(null, menus);
	});
}

function getCurrentOrderFood( param, cb){
	global.Server.Model.OrderModel.findOne( param, function(err, order) {

		if (err) {
			return cb && cb(err);
		}

		if(order) {
			global.Server.Model.MenuModel.findOne( {_id : order.menuId}, function(err, menu) {
				if (err) {
					return cb && cb(err);
				}
				var ret_order = {
									_id : order._id,
									actTime : order.actTime,
									orderDate : order.orderDate,
									menuId : order.menuId,
									userId : order.userId,
									menuPrice : menu.price
								};
				return cb && cb(null, ret_order);
			});
		} else {
			if (err) {
				return cb && cb(err);
			}
			return cb && cb(null, order);
		}

	});
}

function getFoodById(param, cb){
	global.Server.Model.MenuModel.findOne( param , function(err, food) {

		if (err) {
			return cb && cb(err);
		}

		return cb && cb(null, food);

	});
}

function removeOrder(param, cb){
	global.Server.Model.OrderModel.find( param ).remove( function(err){
		if (err) {
			return cb && cb(err);
		}

		return cb && cb(null);
	});
}

function updateOrder(param, set, cb){
	global.Server.Model.OrderModel.update(param, { $set: set }, function(err){
		if (err) {
			return cb && cb(err);
		}

		return cb && cb(null);
	});
}

function modifyMoney(user_id, amount, cb){
	global.Server.Model.UserModel.findByIdAndUpdate({_id : user_id}, {$inc: {money:amount}}, function(err){
		if (err) {
			return cb && cb(err);
		}

		return cb && cb(null);
	});
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

	getFoodById({_id : foodId}, function getFoodByIdCallback(err, food){
		if(!food) {
  			res.send(JSON.stringify({ content : 'Menu: Food does not exist!', type : 'danger' }));
			return;
	  	} else {
	  		var searchDate = moment(orderDate, "DD/MM/YYYY").format("YYYY-MM-DD");
			searchDate = new Date(searchDate + "T00:00:00.000Z");
			getCurrentOrderFood({ orderDate : orderDate, userId : req.currentData.current_user.id }, function getCurrentOrderFoodCallback(err, order){
				
				if(order) {
			  		if(order.menuId === food._id) {
			  			console.log('Deleted');
			  			/*
		  				modifyMoney(req.currentData.current_user.id, food.price, function addMoneyForRefund(err){
		  					if(err) { throw err }
				  			removeOrder({ _id : data._id }, function removeOrderCallback(err){
				  				res.send(JSON.stringify({ content : 'Deleted order successfully!', type : 'success' }));
				  				return;
				  			});
			  			});
						*/	
			  		} else {
			  			console.log('ReOrder');
			  			// ReOrder, update current order
			  			/*
			  			modifyMoney(req.currentData.current_user.id, order.menuPrice, function(err){
			  				if(err) { throw err }
		  					modifyMoney(req.currentData.current_user.id, (-1)*food.price, function(err){
			  					if(err) { throw err }
			  					updateOrder({ _id: data._id }, { menuId : foodId }, function(err){
							  		res.send(JSON.stringify({ content : 'ReOrdered successfully!', type : 'success' }));
							  		return;
						  		});
			  				});
		  				});
						*/
			  		}
			  	} else {
			  		console.log('First time order');
			  		// Order at first time, create new order
			  		/*
					modifyMoney(req.currentData.current_user.id, (-1)*food.price, function(err){
						if(err) { throw err }

						var order = new global.Server.Model.OrderModel;
						order.userId = req.currentData.current_user.id;
						order.menuId = foodId;
						order.orderDate = moment(orderDate, "DD/MM/YYYY").toISOString();
						order.actTime = moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY").toISOString();
						order.save(function(err) {
							if(err) { throw err }
							res.send(JSON.stringify({ content : 'Ordered successfully!', type : 'success' }));
							return;
						});
					});
					*/
			  	}
			});
	  	}
	});
}

module.exports.getMenuListByDay = getMenuListByDay;
module.exports.orderFoodByDay = orderFoodByDay;
