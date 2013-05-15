
KISSY.add("mobile/app/1.2/demo/lottery/js/fc3d/fc3dz6bet" , function (S , BackboneLocalstorage ,  Layout , Bet , Tool , _) {
	
	var collectionConfig = function(){
		return {
			localStorage: new Store('fc3dbet'),
			tempBox: '#fc3dBetViewTemp',
			maxbt: 99,
			/**
			 * 机选产生一注
			 * @name random
			 * @memberOf BetCollection
			 */
			random: function(){
				var b = Tool.baseBallRandom(3,9,false,false,'ceil').sort();
				var result = {
					key: C.Config.key,
					bet: 1,
					value: {
						l1: b
					},
					betstr: b.join('') + ':0',
					canEdit: false
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
			key: 'fc3d_z6',
			title: '福彩3D',
			manualTar: {
				href: 'fc3d/z6.html',
				animDir: 'forward'
			}
		};
	};
	

	return {
		initialize: function(){
			C.betcollection = new Bet.Collection(collectionConfig());
			//以下是业务逻辑
			C.betapp = new Bet.App(appConfig(C.betcollection));
			Tool.detectLocalData('fc3dbet',C.betcollection,'fc3d',C.Config.tipDetect);
			this.insertNewSelect();
		},
		/**
		 * 插入新的选号到投注列表
		 * @memberOf ssqbet
		 */
		insertNewSelect: function(){
			if(typeof C.fc3dz6ballcollection !== 'undefined' && C.fc3dz6ballcollection.verify() === true){
				//获取选号盘产生的选号对象，不区分普通、胆拖
				var betArray = C.fc3dz6ballcollection.getBetArray();
				_.each(betArray,function(n){
					C.betcollection.create(n);
				});
				//清除选号盘集合中的数据
				C.fc3dz6ballcollection.clear();
			}else if(typeof C.fc3dz6hzballcollection !== 'undefined' && C.fc3dz6hzballcollection.verify() === true){
				//获取选号盘产生的选号对象，不区分普通、胆拖
				var betArray = C.fc3dz6hzballcollection.getBetArray();
				_.each(betArray,function(n){
					C.betcollection.create(n);
				});
				//清除选号盘集合中的数据
				C.fc3dz6hzballcollection.clear();
			}
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
