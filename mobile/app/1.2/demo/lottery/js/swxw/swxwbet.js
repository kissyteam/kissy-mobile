
KISSY.add("mobile/app/1.2/demo/lottery/js/swxw/swxwbet", function (S , Layout , Bet , Tool , Backbone , _) {
	
	var collectionConfig = function(){
		return {
			localStorage: new Store('swxwbet'),
			tempBox: '#qlcBetViewTemp',
			maxbt: 99,
			/**
			 * 机选产生一注
			 * @name random
			 * @memberOf BetCollection
			 */
			random: function(){
				var reds = Tool.baseBallRandom(5,15,false,true,'ceil').sort();
				var result = {
					key: C.Config.key,
					bet: 1,
					value: {
						l1: reds
					},
					betstr: reds.join(' ')
				};
				this.create(result);
			},
			/**
			 * 获取投注投注字符串
			 * @name getNumberString
			 * @memberOf BetCollection
			 * @return 
			 */
			getNumberString: function(){
				var arr = [];
				this.each(function(model){
					//如果是创建collection实例时，传进来的model，忽略之
					if(model.get('tempBox')) return;
					arr.push(model.get('betstr'));
				});
				return arr.join('&');
			}
		};
	};
	
	
	var appConfig = function(collection){
		return {
			el: '#betBasket',
			collection: collection,
			key: 'swxw_common',
			title: '15选5',
			manualTar: {
				href: 'swxw/common.html',
				animDir: 'forward'
			},
			/**
			 * 增加继续购买的选号
			 * @param num{string} 选号字符串，如01 03 04 05 06 07:01 02:2:4&01 03 04 05 06 07:01 02:2:4
			 */
			addContinues: function(num){
				var self = this;
				//胆拖号码,直接返回
				if(num.indexOf(':') > 0) return;
				var arr = num.split('&');
				_.each(arr,function(val){
					var _arr = val.split(' ');
					var bets = Tool.numC(_arr.length,5);
					self.collection.create({
						key: C.Config.key,
						bet: bets,
						value: {
							l1: _arr,
						},
						betstr: val
					});
					
				});
			}
		};
	};
	

	return {
		initialize: function(step){
			C.betcollection = new Bet.Collection(collectionConfig());
			C.betapp = new Bet.App(appConfig(C.betcollection));
			Tool.detectLocalData('swxwbet',C.betcollection,'swxw',C.Config.tipDetect);
			C.betapp.continueBuy();
			this.insertNewSelect();
		},
		/**
		 * 插入新的选号到投注列表
		 * @memberOf ssqbet
		 */
		insertNewSelect: function(){
			//判断是否在当前hash刷新,或者直接进入当前hash
			if(typeof C.swxwcommonballcollection !== 'undefined' && C.swxwcommonballcollection.verify() === true){
				//获取选号盘产生的选号对象，不区分普通、胆拖
				var betArray = C.swxwcommonballcollection.getBetArray();
				C.betcollection.create(betArray);
				//清除选号盘集合中的数据
				C.swxwcommonballcollection.clear();
			}
		}
		
	};

} , {
	requires: [
		'mobile/app/1.2/demo/lottery/js/base/layout',
		'mobile/app/1.2/demo/lottery/js/base/bet',
		'mobile/app/1.2/demo/lottery/js/base/tool',
		'mobile/app/1.2/demo/lottery/js/lib/backbone-localstorage',
		'mobile/app/1.2/demo/lottery/js/lib/underscore'
	]
});
