
/**
 * @author yang zhenn
 */
KISSY.add("mobile/app/1.2/demo/lottery/js/dlt/dltbet" , function (S , Backbone ,  Layout , Bet , Tool , _) {
	
	var collectionConfig = function(){
		return {
			localStorage: new Store('dltbet'),
			tempBox: '#ssqBetViewTemp',
			maxBt: 99,
			/**
			 * 机选产生一注
			 * @name random
			 * @memberOf BetCollection
			 */
			random: function(){
				var reds = Tool.baseBallRandom(5,35,false,true,'ceil').sort(),
					blues = Tool.baseBallRandom(2,12,false,true,'ceil').sort();
				var result = {
					key: C.Config.key,
					bet: 1,
					value: {
						l1: reds,
						l2: blues
					},
					betstr: reds.join(' ') + '-' + blues.join(' ')
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
				for(var i=0,len=this.models.length;i<len;i++){
					if(this.models[i].get('betstr') === undefined){
						continue;
					}
					arr.push(this.models[i].get('betstr'));
				}
				return arr.join('&');
			}
		};
	};
	
	
	var appConfig = function(step,collection){
		return {
			el: '#betBasket',
			collection: collection,
			key: 'dlt_common',
			title: '大乐透',
			manualTar: {
				href: 'dlt/common.html',
				animDir: 'forward'
			},
			/**
			 * 增加继续购买的选号
			 * @param num{string} 选号字符串，如01 03 04 05 06 07:01 02:2:4&01 03 04 05 06 07:01 02:2:4
			 */
			addContinues: function(num){
				var self = this;
				//胆拖号码,直接返回
				if(num.indexOf('$') >= 0)return;
				var arr = num.split('&');
				_.each(arr,function(val){
					var _arr = val.split('-');
					var bets = Tool.numC(_arr[0].split(' ').length,5) * Tool.numC(_arr[1].split(' ').length,2);
					self.collection.create({
						key: C.Config.key,
						bet: bets,
						value: {
							l1: _arr[0].split(' '),
							l2: _arr[1].split(' ')
						},
						betstr: _arr[0] + '-' + _arr[1]
					});
					
				});
			
				
			}
		};
	};
	

	return {
		initialize: function(step){
			C.betcollection = new Bet.Collection(collectionConfig());
			C.betapp = new Bet.App(appConfig(step,C.betcollection));
			Tool.detectLocalData('dltbet',C.betcollection,'dlt',C.Config.tipDetect);
			C.betapp.continueBuy();
			this.insertNewSelect();
		},
		/**
		 * 插入新的选号到投注列表
		 * @memberOf ssqbet
		 */
		insertNewSelect: function(){
			//判断是否在当前hash刷新,或者直接进入当前hash
			if(typeof C.dltcommonballcollection === 'undefined' || C.dltcommonballcollection.verify() != true){
				return;
			}
			//获取选号盘产生的选号对象，不区分普通、胆拖
			var betArray = C.dltcommonballcollection.getBetArray();
			C.betcollection.create(betArray);
			//清除选号盘集合中的数据
			C.dltcommonballcollection.clear();
		}
		
	};

} , {
	requires: [
		'mobile/app/1.2/demo/lottery/js/lib/backbone-localstorage',
		'mobile/app/1.2/demo/lottery/js/base/layout',
		'mobile/app/1.2/demo/lottery/js/base/bet',
		'mobile/app/1.2/demo/lottery/js/base/tool',
		'mobile/app/1.2/demo/lottery/js/lib/underscore'
	]
});
