/**
 * @author yang zhenn
 */


define(function(require,exports){
	var Tool = require('../base/tool'), 	//引入算法库
		Layout = require('../base/layout'),  //引入布局模块
		Ball = require('../base/ball'); //引入选号盘模块
		
	var collectionConfig = function(){
		return {
			lines: 1,
			key: 'xssc_x1zhx',
			localStorage: new Store('xsscx1zhxball'),
			deviation: 0,
			/**
			 * 验证是否符合此玩法的选号规则
			 * @memberOf BallCollection
			 * @return string or true
			 */
			verify: function(){
				var g = this.fetchSelectNum(0);
				if(g < 1){
					return '请选择个位';
				}
				return true;
			},
			/**
			 * 获取投注字符串数组
			 * @param void
			 * @memberOf BallCollection
			 * @return result,如：{
			 * 						key:'ssq_common', //玩法对应key值
			 * 						value:{
			 * 							l1: ['01','02','03','04','05','06'],
			 * 							l2: ['01','02']
			 * 						},
			 * 						bet: 2,	//注数,
			 * 					}
			 * @type object
			 */
			getBetArray: function(){
				var self = this,
					r = [],
					selectArray = this.getSelectArray();
				var resultArr = Tool.getCompoundPermutation(selectArray);
				
				_.each(resultArr,function(n){
					var obj = {
						key: self.key,
						//用于渲染投注蓝模板
						value: {
							l1: [n.charAt(0)],
							l2: [n.charAt(1)],
							l3: [n.charAt(2)]
						},
						bet: 1,
						betstr: self.getBetString(n)
					};
					r.push(obj);
				});
				return r;				
			},
			/**
			 * 获得投注字符串，用于提交订单
			 * @memberOf 
			 * @name getBetString
			 * @return 
			 */
			getBetString: function(n){
				/**
				 * 0 -> 直选
				 * 1 -> 组三
				 * 2 -> 组六
				 */
				return n + ':0';
			}
		};
	};
	
	
	
	var appConfig = function(step,collection){
		return $.extend({
			step: step
		},{
			el: '#xssc_x1zhx',
			collection: collection
		});
	};
	

	return {
		initialize: function(step){
			var self = this;
			Layout.initialize().renderView('#xsscX1zhxTemp',step);
			//延迟500ms，保证在页面切换动画完成之后，执行业务逻辑
			_.delay(function(){
				Layout.doAbacusScroll().doTypeListScroll(0);
				C.xsscx1zhxballcollection = new Ball.Collection(collectionConfig());
				Tool.detectLocalData('xsscx1zhxball',C.xsscx1zhxballcollection);
				C.xsscx1zhxballapp = new Ball.App(appConfig(step,C.xsscx1zhxballcollection));
			},500);
		}
		
	};
});