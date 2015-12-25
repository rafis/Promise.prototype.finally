/**
 * Promise.prototype.finally
 *
 * Pulled from https://github.com/domenic/promises-unwrapping/issues/18#issuecomment-57801572
 * @author @stefanpenner, @matthew-andrews
 */

(function() {
	// Get a handle on the global object
	var local;
	if (typeof global !== 'undefined') local = global;
	else if (typeof window !== 'undefined' && window.document) local = window;
	else local = self;

	function isPromiseLike(obj) {
		return obj !== undefined && obj !== null && typeof obj.then === 'function';
	}

	// It's replaced unconditionally to preserve the expected behavior
	// in programs even if there's ever a native finally.
	local.Promise.prototype['finally'] = function finallyPolyfill(callback) {
		var constructor = this.constructor;

		var getPromise = function() {
			var result = callback();
			return isPromiseLike(result) ? result : constructor.resolve(result);
		};

		return this.then(function(value) {
				return getPromise().then(function() {
					return value;
				});
			}, function(reason) {
				return getPromise().then(function() {
					throw reason;
				});
			});
	};
}());
