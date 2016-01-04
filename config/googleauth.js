var google = require('googleapis');

module.exports = function (app) {

	var OAuth2Client = google.auth.OAuth2;
	var plus = google.plus('v1');
	var oauth2Client = new OAuth2Client(app.config.google.CLIENT_ID, app.config.google.CLIENT_SECRET, app.config.google.REDIRECT_URL);

	function auth(code, callback) {
		oauth2Client.getToken(code, function(err, tokens) {
			oauth2Client.setCredentials(tokens);
			plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
				if (err) {
					return callback && callback(err);
			 	}
			 	return callback && callback(null, profile);
			});
	 	});
	};

	function getOAuthUrl() {
		return oauth2Client.generateAuthUrl({
			access_type: 'offline', // will return a refresh token
			scope: 'email' // can be a space-delimited string or an array of scopes
		});
	};
	
	return { getOAuthUrl : getOAuthUrl, auth : auth };
};



	