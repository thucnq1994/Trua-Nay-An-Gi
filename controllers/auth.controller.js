
var GoogleAuth		= require('../config/googleauth.js')(global.app);

function login(req, res){
	var sess = req.session;
	if (sess.current_user) {
		sess.message = { content : 'You are logged in! Do not try to do this again', type : 'danger' };
		res.redirect('/');
	} else {
		res.redirect(GoogleAuth.getOAuthUrl());
	}
}

function logout(req, res){
	req.session.destroy(function(err) {
		if(err) throw err;
		res.redirect('/');
	})
}

function gglogin(req, res){
	var sess = req.session;
	if (sess.current_user) {
		sess.message = { content : 'You are logged in! Do not try to do this again', type : 'danger' };
		res.redirect('/');
	} else {

		GoogleAuth.auth(req.query.code, function(err, profile){
			if (err) {
				console.log('An error occured', err);
				return;
		 	}

		 	var email = profile.emails[0].value.split('@');
		 	if(email[1] == '2359media.com' || email[0] == 'thucnq1994'){

	    	global.Server.Model.UserModel.findOne({ gg_id : profile.id }, function(err, data) {

        	if(data) {
        		if(data.status === 0) {
        			sess.message = { content : 'You was banned! Please contact to administrator for more infomation!', type : 'danger' };
						 	res.redirect('/');
        		} else {
        			sess.current_user = {
																		id: data._id,
																		group: data.group,
																		displayName: data.username,
																		avatar: profile.image.url,
																		email: profile.emails[0].value
																 	};
							sess.message = { content : 'You have logged in successfully!', type : 'success' };
						 	res.redirect('/');
						 }

        	} else {

        		var user = new global.Server.Model.UserModel;
						user.gg_id = profile.id;
						user.username = email[0];
						user.email = profile.emails[0].value;
						user.group = 1;
						user.money = 0;
						user.status = 1;

		    		user.save(function(err, obj) {
		        	if(!err) {
								sess.current_user = {
																			id: user._id,
																			group: user.group,
																			displayName: user.username,
																			avatar: profile.image.url,
																			email: profile.emails[0].value
																	 	};
		        	}
							sess.message = { content : 'You have registered successfully!', type : 'success' };
	        		res.redirect('/');
			    	});
        	}
	    	});
		 	} else {
				sess.message = { content : 'You are not a member of 2359media!', type : 'danger' };
		 		res.redirect('/');
		 	}
		});
	}
}

module.exports.login = login;
module.exports.logout = logout;
module.exports.gglogin = gglogin;