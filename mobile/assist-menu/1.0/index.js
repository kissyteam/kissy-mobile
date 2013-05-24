/**
 * @file index.js
 * @author zhenn, donghan@taobao.com
 * @version 1.0
 * @date 2013-05-21
 */

KISSY.add('mobile/assist-menu/1.0/index' , function(S) {

	'use strict';

	var AssistMenu = function(cfg) {
		AssistMenu.superclass.constructor.call(this , cfg);	
		this.init(cfg);
	};
	
	// 给AssistMenu类增加默认属性
	AssistMenu.ATTRS = {
		trigSelector : {
			value : 'button'	
		},
		menuWrap : {
			value : '#assist-menu'		   
		},
		trigCallback : {
			value : function () {}	
		}
	};

	// 扩展Scroll的原型
	S.extend(AssistMenu , S.Base , {
		init: function() {
			this.bindEvent().bindCustomEvent();
			this.setMenuRegion();
		},
		
		setMenuRegion: function () {
			var menu = S.one(this.get('menuWrap')) ,
				winH = window.innerHeight;

			menu.css({
				height: winH + 'px'
			});
		},

		bindEvent : function () {
			var self = this ,
				trig = S.all(this.get('trigSelector'));

			trig.on('click' , function (e) {
				var obj = S.one(e.currentTarget).prev(); 

				self.fire('trig' , {
					trigElement : obj	
				})	
			});

			return self;
			
		},

		bindCustomEvent : function () {
			var self = this ,
				trigCallback = self.get('trigCallback');

			self.on('trig' , function (e) {
				alert(2)
			});	

			return self;
		},

		showMenu: function () {
					  
		}
		

	});

	S.augment(AssistMenu , S.EventTarget);
	

	return AssistMenu;

} , {
	requires: [
		'base',
		'node'
	]	
});
