// Never commit authentication data to a public repository!
// config-secret.js listed in .gitignore

module.exports = {

	  // Basic auth credentials to protect routes
	auth: {
		basic: {
			 user: 'password'
			,admin: 'password'
		},

		// Don't require authentication for these IPs
		// this property is used a the second arguments to range_check.in_range
		// see: https://npmjs.org/package/range_check
		// for the range notation use: http://ip2cidr.com/
		// or see e.g. http://compnetworking.about.com/od/workingwithipaddresses/a/cidr_notation.htm
		// /32: exact ip
		ip: [
			 // localhost
			 '127.0.0.1/32'
		]
	}
}