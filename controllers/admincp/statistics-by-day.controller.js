var async = require('async');
var moment = require('moment');

function getStatisticsByDay(req, res){
	var sess = req.session;
	if (sess.current_user) {

		var date = req.body.date;
		var orderDate, verifyDate;
		if(date == null) {
			verifyDate = moment();
		} else {
			verifyDate = moment(date, "DD-MM-YYYY");
		}

		if(!verifyDate.isValid()) {
			sess.message = { content : 'Wrong date format', type : 'danger' };
			res.redirect('/admincp/statistics-by-day');
		}
		
		orderDate = new Date(verifyDate.format("YYYY-MM-DD") + "T00:00:00.000Z");

		getFoodStatisticsByDate({ orderDate : orderDate }, function(err, foodList){

			if(err) {
				sess.message = { content : 'Something wrong just happened!', type : 'danger' };
				res.redirect('/admincp/statistics-by-day');
			} else {
				var str_date = verifyDate.format("DD/MM/YYYY");
				var dayOfWeek = verifyDate.format("dddd");

				res.render('admincp/statistics-by-day', { 
										data : req.currentData,
										foodList: foodList,
										str_date : str_date,
										dayOfWeek : dayOfWeek
									});
			}

		});

	} else {
		sess.message = { content : 'You must login to access to this area!', type : 'danger' };
		res.redirect('/');
	}
}


function getFoodStatisticsByDate( param, cb){
	var ret = [];
	global.Server.Model.OrderModel
	.aggregate(
  [
		{ $match : param },
    { $group : { _id : "$menuId", count: {$sum: 1} } },
    { $sort : { _id : -1 } }
  ],
  function(err,results) {
  	async.series([
  		function(callback_series) {
		  	async.each(results,
					function(result, callback){
						global.Server.Model.MenuModel.findOne( { _id : result._id }, function( e, menu ) {
					    if (e) throw e;

					    var reformat = {};
							reformat._id = result._id;
							reformat.count = result.count;
							reformat.foodName = menu.foodName;
							ret.push(reformat);
							callback();
					  });
					},
					function(err){
						if (err) throw err;
						callback_series();
					}
				);
			}
		], function(err) {
      if (err) return next(err);
      return cb && cb(null, ret);
    });
	});
}

module.exports.getStatisticsByDay = getStatisticsByDay;