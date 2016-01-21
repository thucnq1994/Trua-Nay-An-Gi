
var moment				= require('moment');

function getUser(req, res){
	var sess = req.session;
	if (sess.current_user) {

		var keyword = req.body.keyword;
		if(!keyword) {
			keyword = '';
		}
		
		getUserByKeyword(
			{
				$or:[ { username : new RegExp(keyword, 'i') }, { gg_id : new RegExp(keyword, 'i') }, { email : new RegExp(keyword, 'i') } ]
		 	}, function(err, userList){

				res.render('admincp/user-manager', { 
										data : req.currentData,
										userList : userList,
										keyword : keyword
									});

		});

	} else {
		sess.message = { content : 'You must login to access to this area!', type : 'danger' };
		res.redirect('/');
	}
}

function getUserById(req, res){
	var sess = req.session;
	if (sess.current_user && sess.current_user.group == 1) {

		var user_id = req.params.id;

		_getUserById({ _id : user_id }, function(err, user){

			if(!user){
				sess.message = { content : 'User does not exist', type : 'danger' };
				res.redirect('/admincp/user-manager');
			}

			res.render('admincp/user-manager-edit', { 
									data : req.currentData,
									user : {
														_id : user._id,
														group : user.group,
														username : user.username,
														email : user.email,
														gg_id : user.gg_id,
														money : user.money,
														status : user.status
													}
								});

		});

	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
		res.redirect('/');
	}
}

function editUserById(req, res){
	var sess = req.session;
	if (sess.current_user && sess.current_user.group == 1) {

		var user_id = req.params.id;
		var group = req.body.group;
		var money = req.body.money;
		var status = req.body.status;

		if( !isNaN(parseFloat(group)) && isFinite(group) || !isNaN(parseFloat(money)) && isFinite(money) || !isNaN(parseFloat(status)) && isFinite(status)) {
				
			global.Server.Model.UserModel.update(
				{ _id : user_id },
				{
					$set : {
								group : group, 
								money : money,
								status : status
							}
				},
				function(err){

					if(err){
						throw err;
					}

					sess.message = { content : 'The user was updated', type : 'success' };
					res.redirect('/admincp/user-manager/edit/' + user_id);

				}
			);
		} else {
			sess.message = { content : 'Wrong balance, group or status format', type : 'danger' };
			res.redirect('/admincp/user-manager/edit/' + user_id);
		}

	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
		res.redirect('/');
	}
}

function getUserByKeyword( param, cb){
	global.Server.Model.UserModel.find(param, function(err, userList) {

		if (err) {
			return cb && cb(err);
		}

		userList = userList.sort({'_id' : -1});

		return cb && cb(null, userList);
	});
}

function _getUserById(param, cb){
	global.Server.Model.UserModel.findOne(param, function(err, user) {

		if (err) {
			return cb && cb(err);
		}

		return cb && cb(null, user);
	});
}

module.exports.getUser = getUser;
module.exports.getUserById = getUserById;
module.exports.editUserById = editUserById;
