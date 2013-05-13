
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
		trigMore: {
			value: S.one('#km-scroll-loading span')
		},
		loadStatus: {
			value: S.one('#km-scroll-status')			
		},
		
		getMoreInfo: {
			value: function(){
				S.log('你还没有设置获取更多信息的方法')	   
			}			 
		},
		timer: {
			value: null	   
		},
		unitQueue: {
			value: [S.clone(S.one('.km-scroll-unit'))]	
		},
		unitHeightQueue: {
			value: [S.one('.km-scroll-unit').height()]				  
		}

	};


	S.extend(Scroll , S.Base , {
		init: function() {
			var self = this , unit0 = S.one('.km-scroll-unit');
			unit0.css({
				height: unit0.height() + 'px'
			});
			
			self.scrollObj = new iScroll('km-scroll' , {
				onScrollMove: function(a) {
					var that = this;
					self.moveCallback(that);	
				},
				onScrollEnd: function() {
					var that = this;
					self.endCallback(that);
				},
				onBeforeScrollEnd: function(e) {
									   
				}
			});
			self.bindEvent();
		},
		/**
		 * scrollmove时的回调
		 * @param that {object} 当前iscroll实例对象
		 */
		moveCallback: function(that) {
			var self = this;
			self.get('timer') && clearTimeout(self.timer);
			self.set('timer' , setTimeout(function() {
				// iscroll 滚动至最底部超过10px即触发回调
				if (that.y <= that.maxScrollY - 10) {
					self.get('trigMore').addClass('hidden');
					self.get('loadStatus').removeClass('hidden');
					return;
				}

				var unitHeightQueue = self.get('unitHeightQueue') , unitQueue = self.get('unitQueue') , 
					y = Math.abs(that.y) , curIndex = 0 ,units = S.all('.km-scroll-unit');
				for (var i = 0 , len = unitHeightQueue.length; i < len; i++) {
					if (y > unitHeightQueue[i] && y < unitHeightQueue[i + 1]) {
						// 当前视图所占全部视图的索引
						//curIndex = i + 1;
						if (unitQueue[i]) {
							debugger;
							units.item(i).html(unitQueue[i].html());
						}
						break;
					}
				}	

			} , 50));	 
		},
		/**
		 * 滚动结束后的回调
		 * @param void
		 */
		endCallback: function(that) {
			// 是否在滚动至最底部以后才停止滚动的
			if (this.get('trigMore').hasClass('hidden')) {
				this.get('getMoreInfo').call(this);	
			}			 
			
		},
		scrolls: function() {

		},
		bindEvent: function() {
			var self = this;
			self.get('trigMore').on('click' , function() {
				S.one(this).addClass('hidden');
				self.get('loadStatus').removeClass('hidden');
				self.get('getMoreInfo').call(self);
			});		
			
		},

		/**
		 * 向已有信息盒子增加内容 
		 * @param str {string} 获取的dom字符串
		 */
		addContent: function(str) {
			var self = this;
			var targetDom = S.one('<div class="km-scroll-unit">' + str + '</div>');
			this.get('contentWrap').append(targetDom);	

			S.later(function() {
				var targetHeight = targetDom.height();
				self.addUnitQueue(str);
				self.addUnitHeightQueue(targetHeight);
				self.scrollObj.refresh();
				targetDom.css('height' , targetHeight + 'px');
				
				self.litePredom();
			} , 0);


		},

		/**
		 * 增加加载更多信息的队列，挂载到实例对象的unitQueue下面，保存每次加载的DOM
		 * @param str {string} 获取的dom字符串
		 */
		addUnitQueue: function (str) {
			var unitQueue = this.get('unitQueue');
			unitQueue.push(S.one('<div id="km-scroll-unit">' + str + '</div>'));
			this.set('unitQueue' , unitQueue);
		},
		
		/**
		 * 增加显示单元的高度队列 ， 用于计算视口当前区域所在的显示单元
		 * @param h {number} 最新加载的显示单元的高度
		 */ 
		addUnitHeightQueue: function (h) {
			var unitHeightQueue = this.get('unitHeightQueue');
			unitHeightQueue.push(this.sum(unitHeightQueue) + h);
			this.set('unitHeightQueue' , unitHeightQueue);
		},

		/**
		 * 精简当前显示单元之前的dom结构
		 * @param void
		 */ 
		litePredom: function() {
			var unitQueue = this.get('unitQueue') , units = S.all('.km-scroll-unit');
			units.item(units.length - 3).empty();
		},

		resetLoad: function() {
			this.get('trigMore').removeClass('hidden');
			this.get('loadStatus').addClass('hidden');
		},

		sum: function(arr) {
			var result = 0;
			for (var i = 0 , len = arr.length; i < len; i++) {
				var val = arr[i];
				if (!S.isNumber(arr[i])) {
					continue;
				}

				result += arr[i];
			}
			return result;
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
		'node',
		'ajax'
	]	
});
