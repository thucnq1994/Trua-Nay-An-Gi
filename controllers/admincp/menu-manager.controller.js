
var moment				= require('moment');

function getMenuListByDay(req, res){
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
			res.redirect('/order/today');
		}
		
		orderDate = new Date(verifyDate.format("YYYY-MM-DD") + "T00:00:00.000Z");

		getMenuByDate({ menuDate : orderDate }, function(err, menus){

			var str_date = verifyDate.format("DD/MM/YYYY");
			var dayOfWeek = verifyDate.format("dddd");

			res.render('admincp/menu-manager', { 
									data : req.currentData,
									menus : menus,
									str_date : str_date,
									dayOfWeek : dayOfWeek
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

module.exports.getMenuListByDay = getMenuListByDay;
