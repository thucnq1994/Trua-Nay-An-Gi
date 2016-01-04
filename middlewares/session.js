// return Middleware contains session data.

/*
var fakeReq = {
	session : {
		message : {
			content : '',
			type : ''
		},
		current_user : {

		}
	}
};

*/

function getSessionData(req,res,next){
  var sess = req.session;

  var mess_content = null;
	var mess_type = null;
	if(sess.message) {
		if(sess.message.content){
			mess_content = sess.message.content;
			sess.message.content = null;
		}
		if(sess.message.type){
			mess_type = sess.message.type;
			sess.message.type = null;
		}
	}
	
  if (sess.current_user) {
  	req.currentData = {
	  	current_user : sess.current_user,
	  	message : { content : mess_content, type : mess_type }
  	};
  } else {
  	req.currentData = {
	  	current_user : null,
	  	message : { content : mess_content, type : mess_type }
  	};
  }

  next();
}

module.exports.getSessionData = getSessionData;