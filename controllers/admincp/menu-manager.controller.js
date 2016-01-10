
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
		sess.message = { content : 'You must login to access to this area!', type : 'danger' };
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

function getMenuById(param, cb){
	global.Server.Model.MenuModel.findOne(param, function(err, menu) {

		if (err) {
			return cb && cb(err);
		}

		return cb && cb(null, menu);
	});
}

function deleteMenuById(req, res){
	var sess = req.session;
	if (sess.current_user && sess.current_user.group == 1) {

		var menu_id = req.params.id;

		if( !isNaN(parseFloat(menu_id)) && isFinite(menu_id) ) {
			sess.message = { content : 'Wrong menu id format', type : 'danger' };
			res.redirect('/admincp/menu-manager');
		}

		getMenuById({ _id : menu_id }, function(err, menu){

			if(!menu){
				sess.message = { content : 'Menu does not exist', type : 'danger' };
				res.redirect('/admincp/menu-manager');
			}

			menu.remove(function(){
				sess.message = { content : 'The menu was deleted', type : 'success' };
				res.redirect('/admincp/menu-manager');
			});

		});

	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
		res.redirect('/');
	}
}

function editMenuById(req, res){

}

module.exports.getMenuListByDay = getMenuListByDay;
module.exports.deleteMenuById = deleteMenuById;
module.exports.editMenuById = editMenuById;
