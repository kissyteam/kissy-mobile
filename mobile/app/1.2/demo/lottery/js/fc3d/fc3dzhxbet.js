
KISSY.add("mobile/app/1.2/demo/lottery/js/fc3d/fc3dzhxbet" , function (S , BackboneLocalstorage ,  Layout , Bet , Tool , _) {
	
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
				var b = Tool.baseBallRandom(1,9,true,false,'ceil').sort(),
					s = Tool.baseBallRandom(1,9,true,false,'ceil').sort(),
					g = Tool.baseBallRandom(1,9,true,false,'ceil').sort();
				var result = {
					key: C.Config.key,
					bet: 1,
					value: {
						l1: b,
						l2: s,
						l3: g
					},
					betstr: b.toString() + s.toString() + g.toString() + ':0'
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
			key: 'fc3d_zhx',
			title: '福彩3D',
			manualTar: {
				href: 'fc3d/zhx.html',
				animDir: 'forward'
			},
			/**
			 * 增加继续购买的选号
			 * @param num{string} 选号字符串，如01 03 04 05 06 07:01 02:2:4&01 03 04 05 06 07:01 02:2:4
			 */
			addContinues: function(num){
				var self = this;
				var arr = num.split('&');
				_.each(arr,function(val){
					var _arr = val.split(':');
					
					var t = _arr[1];
					if(t === '0'){
						var n = _arr[0].split('');
						//直选
						self.collection.create({
							key: 'fc3d_zhx',
							bet: 1,
							value: {
								l1: n[0].split(''),
								l2: n[1].split(''),
								l3: n[2].split('')
							},
							betstr: val
						});
					}else if(t === '1'){
						//组三
						self.collection.create({
							key: 'fc3d_z3',
							bet: 1,
							value: {
								l1: _arr[0].split('')
							},
							betstr: val
						});
					}else if(t === '2'){
						//组六
						self.collection.create({
							key: 'fc3d_z6',
							bet: 1,
							value: {
								l1: _arr[0].split('')
							},
							betstr: val
						});
					}
					
				});
				
				
			}
		};
	};
	

	return {
		initialize: function(step){
			C.betcollection = new Bet.Collection(collectionConfig());
			C.betapp = new Bet.App(appConfig(C.betcollection));
			Tool.detectLocalData('fc3dbet',C.betcollection,'fc3d',C.Config.tipDetect);
			C.betapp.continueBuy();
			this.insertNewSelect();
		},
		/**
		 * 插入新的选号到投注列表
		 * @memberOf ssqbet
		 */
		insertNewSelect: function(){
			if(typeof C.fc3dzhxballcollection !== 'undefined' && C.fc3dzhxballcollection.verify() === true){
				//获取选号盘产生的选号对象，不区分普通、胆拖
				var betArray = C.fc3dzhxballcollection.getBetArray();
				_.each(betArray,function(n){
					C.betcollection.create(n);
				});
				//清除选号盘集合中的数据
				C.fc3dzhxballcollection.clear();
			}else if(typeof C.fc3dzhxhzballcollection !== 'undefined' && C.fc3dzhxhzballcollection.verify() === true){
				//获取选号盘产生的选号对象，不区分普通、胆拖
				var betArray = C.fc3dzhxhzballcollection.getBetArray();
				_.each(betArray,function(n){
					C.betcollection.create(n);
				});
				//清除选号盘集合中的数据
				C.fc3dzhxhzballcollection.clear();
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
