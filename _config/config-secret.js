// Never commit authentication data to a public repository!
// config-secret.js listed in .gitignore

module.exports = {

	  // Basic auth credentials to protect routes
	auth: {
		basic: {
			user: 'password'
		}
	}
}