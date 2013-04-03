KISSY.add(function (S) {

	"use strict";

	function X(id,cfg) {
		if (this instanceof X) {

			this.con = S.one(id);

			X.superclass.constructor.call(this, cfg);
			this.init();

		} else {
			return new X(id,cfg);
		}
	}

	// ATTR Example
	X.ATTRS = {
		a: {
			setter: function(){},
			getter: function(){},
			value: 1
		}
	};

	S.extend(X, S.Base, {

		init: function() {
			// your code here
		},

		destory: function(){

		}
	});

	return X;

}, {
	requires: ['base','node']
});
