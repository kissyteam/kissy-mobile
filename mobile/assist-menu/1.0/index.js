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
		// 显示menu触发器的选择器
		trigSelector : {
			value : '.trigMenu'	
		},
		// menu的外层包裹器
		menuWrap : {
			value : '#assist-menu'		   
		},
		// menu显示的滑动时间
		slideTime : {
			value : 200	,
			setter : function (val) {
				if (typeof val !== 'number') {
					return 200;	
				} else if (val < 100 || val > 1000) {
					return 200;	
				}
				return val;
			}
		},
		// 用于数据交换
		data: {
			value : null	
		}
	};

	// 扩展Scroll的原型
	S.extend(AssistMenu , S.Base , {
		init: function() {
			this.bindEvent().bindCustomEvent();
			this.setWrapRegion().setMenuInitStatus();
		},
		
		setWrapRegion: function () {
			var menu = S.one(this.get('menuWrap')) ,
				winH = window.innerHeight;

			menu.css({
				height: winH + 'px'
			});

			return this;
		},

		setMenuInitStatus : function () {
			var menuCon = S.one(this.get('menuWrap') + ' .assist-menu-content') , 
				w = menuCon.width() ,
				h = menuCon.height(),
				duration = this.get('slideTime') / 1000 + 's';

			menuCon.css({
				'left' : '50%',
				'margin-left' : -w/2 + 'px',
				'bottom' : '0',
				'-webkit-transition' : '-webkit-transform ' + duration + ' ease-in-out',
				'-webkit-transform' : 'translate3d(0 , ' + h + 'px, 0)'
			});

			return this;
		},

		bindEvent : function () {
			var self = this ,
				trig = S.all(this.get('trigSelector')) , 
				menu = S.one(this.get('menuWrap'));

			trig.on('click' , function (e) {
				var obj = S.one(e.currentTarget).prev(); 

				self.fire('trig' , {
					trigElement : obj	
				});
			});

			menu.delegate(  'click' , '.assist-menu-mask' , self.hide , self);

			menu.delegate('click' , 'li' , self.selectMenuOption , self);

			return self;
			
		},

		bindCustomEvent : function () {
			var self = this; 

			self.on('trig' , function (e) {
				self.show();
			});	

			return self;
		},
			
		selectMenuOption : function (e) {
			var self = this ,
				obj = S.one(e.currentTarget);

			if (obj.attr('ref') == 'select') {
				self.fire('select' , {
					selectElement :  obj		
				});
			}	

		},

		show: function () {
			var self = this ,
				menu = S.one(this.get('menuWrap')) , 
				page = S.one('body'),
				winH = window.innerHeight;
			
			menu.removeClass('hidden');
			page.css({
				'height' : winH + 'px',
				'overflow' : 'hidden'
			});
			this.buildAnim('show');
			this.addVisitSignet();
		},
		
		// 增加访问标记，用于兼容浏览器后退（android物理返回键）
		addVisitSignet : function () {
			var self = this;

			history.pushState({
				'location' : 'assist-menu'
			} , '' , '');	

			window.onpopstate = function (e) {
				if (e.state.location == 'assist-menu') {
					self.hide();		
					window.onpopstate = null;
				}
			};
		},

		buildAnim : function (act) {
			var menuCon = S.one(this.get('menuWrap') + ' .assist-menu-content') , 
				h = menuCon.height() ,
				y = act === 'show' ? '0' : h + 'px';

			menuCon.css({
				'-webkit-transform' : 'translate3d(0 , ' + y  + ' , 0)'	
			});
		},
		
		/**
		 * 隐藏菜单
		 * @
		 */ 
		hide : function () {
			var page = S.one('body') , 
				time = this.get('slideTime') , 
				menuWrap = S.one(this.get('menuWrap')); 

			// 不传任何参数则代表构建消失动画
			this.buildAnim();
			S.later(function () {
				menuWrap.addClass('hidden');	
				page.css({
					'height' : 'auto',
					'overflow' : 'auto'
				});
			} , time);
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
