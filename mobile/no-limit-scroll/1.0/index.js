
KISSY.add('mobile/no-limit-scroll/1.0/index' , function(S , iScroll) {

	'use strict';

	var Scroll = function(cfg) {
		Scroll.superclass.constructor.call(this , cfg);	
		this.init(cfg);
	};

	Scroll.ATTRS = {
		contentWrap: {
			value: S.one('#km-content')
		},
		index: {
			value: 0
		}
		

	};


	S.extend(Scroll , S.Base , {
		init: function() {
			this.scrollObj = new iScroll('km-scroll' , {
				onScrollMove: function() {
					
				}	
			});
			this.bindEvent();
		},
		addUnitQueue: function (str) {
			var curIndex = this.get('index') + 1;
			this.addAttr('unitQueue' + curIndex , {
				value: str
			});	
		},
		bindEvent: function() {
			var self = this;
					
		},
		buildDom: function() {
				
		},
		addContent: function(str) {
			this.get('contentWrap').append(str);	
			this.scrollObj.refresh();
			this.addUnitQueue(str);
			debugger;
		}



	});


	//var scroll = new Scroll();
	//scroll.on('afterTestChange' , function(e) {
		//alert('现有值：' + e.prevVal + ' | 变化值：' + e.newVal)	
	//});
	return Scroll;

} , {
	requires: [
		'mobile/iscroll/iscroll',
		'base',
		'node'
	]	
});
