
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

function _getMenuById(param, cb){
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

		_getMenuById({ _id : menu_id }, function(err, menu){

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

function getMenuById(req, res){
	var sess = req.session;
	if (sess.current_user && sess.current_user.group == 1) {

		var menu_id = req.params.id;

		if( !isNaN(parseFloat(menu_id)) && isFinite(menu_id) ) {
			sess.message = { content : 'Wrong menu id format', type : 'danger' };
			res.redirect('/admincp/menu-manager');
		}

		_getMenuById({ _id : menu_id }, function(err, menu){

			if(!menu){
				sess.message = { content : 'Menu does not exist', type : 'danger' };
				res.redirect('/admincp/menu-manager');
			}

			res.render('admincp/menu-manager-edit', { 
									data : req.currentData,
									menu : {
												_id : menu._id,
												price : menu.price,
												foodName : menu.foodName,
												menuDate : moment(menu.menuDate).format("DD/MM/YYYY")
											}
								});

		});

	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
		res.redirect('/');
	}
}

function editMenuById(req, res){
	var sess = req.session;
	if (sess.current_user && sess.current_user.group == 1) {

		var menu_id = req.params.id;
		var menu_foodName = req.body.foodName;
		var menu_price = req.body.price;
		var menu_menuDate = moment(req.body.menuDate, "DD/MM/YYYY");

		if( !isNaN(parseFloat(menu_price)) && isFinite(menu_price) ) {
			sess.message = { content : 'Wrong price format', type : 'danger' };
			res.redirect('/admincp/menu-manager/edit/' + menu_id);
		}

		_getMenuById({ _id : menu_id }, function(err, menu){

			if(!menu){
				sess.message = { content : 'Menu does not exist', type : 'danger' };
				res.redirect('/admincp/menu-manager');
			}

			menu.foodName = menu_foodName;
			menu.price = menu_price;
			menu.menuDate = menu_menuDate;
			menu.save(function(){
				sess.message = { content : 'The menu was updated', type : 'success' };
				res.redirect('/admincp/menu-manager');
			});

		});

	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
		res.redirect('/');
	}
}

module.exports.getMenuListByDay = getMenuListByDay;
module.exports.deleteMenuById = deleteMenuById;
module.exports.getMenuById = getMenuById;
module.exports.editMenuById = editMenuById;
