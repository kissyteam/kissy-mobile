
KISSY.add('mobile/no-limit-scroll/1.0/index' , function(S , iScroll) {

	'use strict';

	var Scroll = function(cfg) {
		Scroll.superclass.constructor.call(this , cfg);	
		this.init(cfg);
	};
	

	Scroll.ATTRS = {
		wrap: {
			value: S.one('#km-scroll')	
		},
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
			value: [S.one('.km-scroll-unit').clone(true)]	
		},
		unitHeightQueue: {
			value: [S.one('.km-scroll-unit').height()]				  
		},
		y: {
			value: 0		
		}

	};


	S.extend(Scroll , S.Base , {
		init: function() {
			var self = this , unit0 = S.one('.km-scroll-unit');
			unit0.css({
				height: unit0.height() + 'px'
			});

			var wrapH = self.get('initWrapHeight').call(self);
			self.get('wrap').height(wrapH);

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
				if (that.y <= that.maxScrollY - 20) {
					self.get('trigMore').addClass('hidden');
					self.get('loadStatus').removeClass('hidden');
					return;
				}

				self.set('y' , that.y);

			} , 100));	 
		},
		/**
		 * 滚动结束后的回调
		 * @param void
		 */
		endCallback: function(that) {
			var self = this;
			S.later(function() {
				// 是否在滚动至最底部以后才停止滚动的
				if (self.get('trigMore').hasClass('hidden')) {
					self.get('getMoreInfo').call(self);	
				}			 
			} , 0);
		},
		// 绑定事件
		bindEvent: function() {
			var self = this;
			self.get('trigMore').on('click' , function() {
				S.one(this).addClass('hidden');
				self.get('loadStatus').removeClass('hidden');
				self.get('getMoreInfo').call(self);
			});		
			self.on('afterYChange' , function(e) {
				self.YChangeHandler(e);
			});
		},
		
		YChangeHandler: function (e) {
			var prevVal = e.prevVal , newVal = e.newVal;
			// 向上滚动
			if (prevVal > newVal) {

				this.upScroll(newVal);

					
			} else {
				// 向下滚动	
				this.downScroll(newVal);
			}
		},

		upScroll: function (val) {
			
			var unitHeightQueue = this.get('unitHeightQueue') , 
				unitQueue = this.get('unitQueue') , 
				y = Math.abs(val) , 
				curIndex = 0 ,
				units = S.all('.km-scroll-unit'),
				wrapperH = this.scrollObj.wrapperH ;

			for (var i = 0 , len = unitHeightQueue.length; i < len; i++) {
				if (y > unitHeightQueue[i] && y < unitHeightQueue[i + 1]) {
					// 当前视图所占全部视图的索引
					curIndex = i + 1;
					if (unitQueue[curIndex - 1]) {
						S.log(unitHeightQueue);
						units.item(curIndex -1).empty();
					}
						
					if (unitQueue[curIndex + 1]) {
						units.item(curIndex + 1).html(unitQueue[curIndex + 1].html());	
					}
					break;
				}
			}		
		},

		downScroll: function (val) {
			var unitHeightQueue = this.get('unitHeightQueue') , 
				unitQueue = this.get('unitQueue') , 
				y = Math.abs(val) , 
				curIndex = 0 ,
				units = S.all('.km-scroll-unit') ,
				wrapperH = this.scrollObj.wrapperH;

			for (var i = 0 , len = unitHeightQueue.length; i < len; i++) {
				if (y > unitHeightQueue[i] - wrapperH && y < unitHeightQueue[i + 1] - wrapperH) {
					// 当前视图所占全部视图的索引
					curIndex = i + 1;
					if (unitQueue[curIndex - 1]) {
						units.item(curIndex - 1).html(unitQueue[curIndex - 1].html());
					}
					if (unitQueue[curIndex + 1]) {
						units.item(curIndex + 1).empty()
					}
					break;
				}
			}		
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
				
				//self.litePredom();
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
			unitHeightQueue.push(unitHeightQueue[unitHeightQueue.length - 1] + h);
			this.set('unitHeightQueue' , unitHeightQueue);
		},

		/**
		 * 精简当前显示单元之前的dom结构
		 * @param void
		 */ 
		/*litePredom: function() {
			var unitQueue = this.get('unitQueue') , units = S.all('.km-scroll-unit');
			units.item(units.length - 3).empty();
		},*/

		resetLoad: function() {
			this.get('trigMore').removeClass('hidden');
			this.get('loadStatus').addClass('hidden');
		},

		lastsum: function(arr) {
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
