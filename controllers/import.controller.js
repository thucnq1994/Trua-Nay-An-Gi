
var DataImport		= require('../config/dataimport.js');
var moment				= require('moment');

function getImport(req, res){
	var sess = req.session;
	if(sess.current_user){
		res.render('import', {data : req.currentData});
	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
	 	res.redirect('/');
	}
}

function postImport(req, res){
	var sess = req.session;
	if(sess.current_user){
		DataImport(req.file.buffer, function(err, arr){
			if(err) { throw err; }
			arr.forEach(function(menuByDay) {
				menuByDay.foodList.forEach(function(foodList) {
					var menu = new global.Server.Model.MenuModel;
					menu.menuDate = moment(menuByDay.date, "DD/MM/YY").toISOString();
					menu.foodName = foodList.name;
					menu.price = foodList.price;
					menu.creator = sess.current_user.id;

		  		menu.save(function(err) {
		      	if (err) throw err;
		      });

				});
			});

			sess.message = { content : 'Imported successfully!', type : 'success' };
			res.redirect('/import');
		});
	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
	 	res.redirect('/');
	}
}

module.exports.getImport = getImport;
module.exports.postImport = postImport;
