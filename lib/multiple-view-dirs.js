// http://stackoverflow.com/a/17252228/546491
module.exports = function ViewEnableMultiFolders(app) {
	// Monkey-patch express to accept multiple paths for looking up views.
	// this path may change depending on your setup.
	var lookup_proxy = app.get('view').prototype.lookup;

	app.get('view').prototype.lookup = function(viewName) {
		var context, match;
		if (this.root instanceof Array) {
			for (var i = 0; i < this.root.length; i++) {
				context = {root: this.root[i]};
				match = lookup_proxy.call(context, viewName);
				if (match) {
					return match;
				}
			}
			return null;
		}
		return lookup_proxy.call(this, viewName);
	};
};