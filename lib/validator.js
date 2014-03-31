var validator = {};

module.exports = function(key, value, should) {
	var result = validator[key](value);

	if (result instanceof Error) {
		throw (new Error(should + '. '+ result.message));
	}
	else return true;
};

validator.ipRanges = function(ipRanges) {
	var rangeCheck = require('range_check')
	   ,i , current
	   ,invalidIps = []
	;

	for (i = 0; i < ipRanges.length; i++) {
		current = ipRanges[i].split('/');
		if ( !rangeCheck.valid_ip(current[0]) ) {
			invalidIps.push('"'+current[0]+'"');
		}

		if ( current[1] && (current[1] < 17 || current[1] > 32) ) {
			invalidIps.push('"/'+ current[1]+'"');
		}
	}

	return invalidIps.length ? new Error('Invalid IPs/ranges: '+ invalidIps.join(', ')) : true;
};

validator.gitUri = function(uri) {

	return uri === '' || /^https:\/\/[\w\.\:/\-~]+\.git$/.test(uri) || new Error('Invalid Git URI: '+ uri);
};
