var async = require('async');
var moment = require('moment');

function loadMoreHistory(req, res){
	var data = {};
	var currentDate = req.body.curDate;
	var curUserId = req.body.curUserId;
	if(!curUserId){
		curUserId = '';
	}

	if(!moment(currentDate, "DD/MM/YYYY").isValid()) {
		data = { content : 'Date: Wrong format!', type : 'danger', data : null };
		res.send(JSON.stringify(data));
		return;
	}

	/*
	if( currentDate != moment().format("DD/MM/YYYY") && moment(currentDate, "DD/MM/YYYY").isAfter(moment()) ) {
		data = { content : 'You can view order history of future!', type : 'danger', data : null };
		res.send(JSON.stringify(data));
		return;
	}
	*/

	var searchDate = moment(currentDate, "DD/MM/YYYY").format("YYYY-MM-DD");
	searchDate = new Date(searchDate + "T00:00:00.000Z");

	global.Server.Model.OrderModel
		.aggregate(
    [
  		{ $match : { actTime: { $lt: searchDate }, userId : new RegExp('^' + curUserId, "i") } },
      { $group : { _id : "$actTime" } },
      { $sort : { _id : -1 } },
      { $limit : 10 }
    ])
    .exec(
	    function(err,data) {
		  	if(!data || data.length == 0) {
		  		data = { content : 'Can not find any history!', type : 'danger', data : null };
		  		res.send(JSON.stringify(data));
					return;
		  	} else {
					var ret = [];
					var nextDate = currentDate;

					// Loop for each date
					async.each(data,
						function(item, callback){
							async.series([
								function(callback_series) {
									var curDate = {};
									curDate.date = moment(item._id).format("DD/MM/YYYY");

									if(moment(nextDate, "DD/MM/YYYY").isAfter(moment(curDate.date, "DD/MM/YYYY"))) {
										nextDate = curDate.date;
									}

									var searchDateLT = new Date(moment(item._id).format("YYYY-MM-DD") + "T17:00:00.000Z");
									var searchDateGT = new Date(moment(item._id).subtract(1, 'days').format("YYYY-MM-DD") + "T17:00:00.000Z");

									console.log('Ngay thang ben ngoai model: ', curDate.date);

									global.Server.Model.OrderModel
									.find({ 'actTime' : { $lt : searchDateLT, $gte : searchDateGT } })
							    .populate('userId menuId')
							    .exec(
							    	function(err, orders) {
							    		
											console.log('Ben trong model: ', curDate.date);

											orders = orders.sort({'actTime' : -1});
											curDate.orders = [];

											// Loop for each order of date
											async.each(orders,
												function(order, callback_each_order){
													var reformat = {};
													reformat.actTime = moment(order.actTime).format("HH:mm:ss DD/MM/YYYY");
													reformat.orderDate = moment(order.orderDate).format("DD/MM/YYYY");
													reformat.userId = order.userId;
													reformat.username = order.userId.username;
													reformat.menuId = order.menuId;
													reformat.foodName = order.menuId.foodName;
													curDate.orders.push(reformat);
													callback_each_order();
												},
												function(err){
													if (err) return next(err);
													ret.push(curDate);
													callback_series();
												}
											);
										}
									);
								}
							], function(err) {
				        if (err) return next(err);
				        callback();
					    });
						},
						function(err){
							/*
							async.series([
								function(callback) {
									ret.forEach(function(history){
										ret.forEach(function(h){
											if(moment(history.date, "DD/MM/YYYY").isBefore(moment(h.date, "DD/MM/YYYY"))) {
												var temp = history;
												history = h;
												h = temp;
											}
										});
									});
									callback();
								}
							], function(err) { //This function gets called after the two tasks have called their "task callbacks"
					        if (err) return next(err);
					        res.send(JSON.stringify({ content : 'Success!', type : 'success', data : ret, nextDate : moment(nextDate, "DD/MM/YYYY").subtract(1, 'days').format("DD-MM-YYYY") }));
					    });
							*/
				  		res.send(JSON.stringify({ content : 'Success!', type : 'success', data : ret, nextDate : moment(nextDate, "DD/MM/YYYY").subtract(1, 'days').format("DD-MM-YYYY") }));
				  		return;
						}
					);
		  	}
	  	}
  	);
}

module.exports.loadMoreHistory = loadMoreHistory;
