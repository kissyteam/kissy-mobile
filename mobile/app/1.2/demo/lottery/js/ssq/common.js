
KISSY.add("mobile/app/1.2/demo/lottery/js/ssq/common", function (S , Tool , Layout , Ball) {

	var collectionConfig = function(){
		return {
			lines: 2,
			key: 'ssq_common',
			localStorage: new Store('ssqcommonball'),
			deviation: -1,
			/**
			 * 验证是否符合此玩法的选号规则
			 * @memberOf BallCollection
			 * @return string or true
			 */
			verify: function(){
				var redball = this.fetchSelectNum(0),
					blueball = this.fetchSelectNum(1);
				if(redball < 6){
					return '请至少选择6个红球';	
				}else if(blueball < 1){
					return '请至少选择1个篮球';	
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
				var values = {},
					selectArray = this.getSelectArray();
				for(var i=0,len=selectArray.length;i<len;i++){
					values['l'+(i+1)] = selectArray[i];
				}
				return {
					key: this.key,
					value: values,
					bet: Tool.numC(selectArray[0].length,6) * selectArray[1].length,
					betstr: this.getBetString()
				};
			},
			getBetString: function(){
				var selectArr = this.getSelectArray(),
					result = '';
				result = selectArr[0].join(' ') + ':' + selectArr[1].join(' ');
				return result;
			}
		};
	};
	
	
	
	var appConfig = function(collection){
		return {
			el: '#ssq_common',
			collection: collection
		};
	};
	

	return {
		initialize: function(step){
			Layout.doAbacusScroll();
			C.ssqcommonballcollection = new Ball.Collection(collectionConfig());
			Tool.detectLocalData('ssqcommonball',C.ssqcommonballcollection,C.Config.betHashMap['ssq']);
			C.ssqcommonballapp = new Ball.App(appConfig(C.ssqcommonballcollection));
		}
	};

} , {
	requires: [
		'mobile/app/1.2/demo/lottery/js/base/tool',
		'mobile/app/1.2/demo/lottery/js/base/layout',
		'mobile/app/1.2/demo/lottery/js/base/ball'
	]
});	

