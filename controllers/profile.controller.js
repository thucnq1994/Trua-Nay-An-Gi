//Profile Controller
var moment = require('moment');

function profileController(req, res){
	var sess = req.session;
	if (sess.current_user) {
		var avatar = sess.current_user.avatar.substr(0, sess.current_user.avatar.length - 2) + '250';
		res.render('profile', {data : req.currentData, avatar : avatar, curDate : moment().add(1, 'days').format("DD/MM/YYYY")});
	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
		res.redirect('/');
	}
}

module.exports = profileController;