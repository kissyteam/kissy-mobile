

KISSY.add("mobile/app/1.2/demo/lottery/js/syy/rx5" , function (S , Tool , Layout , Ball , BackboneLocalstorage , _) {
	var collectionConfig = function(){
		return {
			lines: 1,
			key: 'syy_rx5',
			localStorage: new Store('syyrx5ball'),
			deviation: -1,
			/**
			 * 验证是否符合此玩法的选号规则
			 * @memberOf BallCollection
			 * @return string or true
			 */
			verify: function(){
				var b = this.fetchSelectNum(0);
				if(b < 5){
					return '至少选择5个号码';	
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
				return {
					key: self.key,
					value: {
						l1: selectArray[0]
					},
					bet: Tool.numC(selectArray[0].length,5),
					betstr: self.getBetString(selectArray[0].join(' ')),
					manualFirst: true
				};
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
				return n + ':105';
			}
		};
	};
	
	var appConfig = function(isEdit,collection){
		return {
			el: '#syy_rx5',
			collection: collection,
			noRepeat: false,
			random: function(){
				var self = this;
				self.collection.clear();
				var l1 = Tool.baseBallRandom(5,11,false,true,'ceil').sort();
				_.each(l1,function(n){
					self.collection.syncData(true,[{line:0,val:n}]);
				});
			},
			setbar: function(){
				if(!isEdit) return;
				this.$el.find('.type').addClass('hidden');
				this.$el.find('.return').attr({
					href: 'nbet/index.html',
					'data-param': 'lotype=syy&subtype=rx5',
					dir: 'back'
				});
				this.$el.find('#selectDone').attr('dir','back');
			}
		};
	};

	return {
		initialize: function(isEdit){
			Layout.doAbacusScroll().doTypeListScroll(0);
			C.syyrx5ballcollection = new Ball.Collection(collectionConfig());
			Tool.detectLocalData('syyrx5ball',C.syyrx5ballcollection);
			C.syyrx5ballapp = new Ball.App(appConfig(isEdit,C.syyrx5ballcollection));
			this.setType(isEdit);
		},
		setType: function(isEdit){
			if(!isEdit) return;
			$('#selPlayType li a').attr('data-param','edit=true');
		}
	};

} , {
	requires: [
		'mobile/app/1.2/demo/lottery/js/base/tool',
		'mobile/app/1.2/demo/lottery/js/base/layout',
		'mobile/app/1.2/demo/lottery/js/base/ball',
		'mobile/app/1.2/demo/lottery/js/lib/backbone-localstorage',
		'mobile/app/1.2/demo/lottery/js/lib/underscore'
	]	
});


