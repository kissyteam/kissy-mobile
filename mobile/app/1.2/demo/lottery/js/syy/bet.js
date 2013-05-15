
KISSY.add("mobile/app/1.2/demo/lottery/js/syy/bet", function (S , Layout , Bet , Tool , Backbone , _) {

	var rx2_random = function(){
		var reds = Tool.baseBallRandom(2,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: reds
			},
			betstr: reds.join(' ') + ':102',
			manualFirst: true
		};
		this.create(result);
	};
	
	var rx3_random = function(){
		var reds = Tool.baseBallRandom(3,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: reds
			},
			betstr: reds.join(' ') + ':103',
			manualFirst: true
		};
		this.create(result);
	};
	
	var rx4_random = function(){
		var reds = Tool.baseBallRandom(4,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: reds
			},
			betstr: reds.join(' ') + ':104',
			manualFirst: true
		};
		this.create(result);
	};
	
	var rx5_random = function(){
		var reds = Tool.baseBallRandom(5,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: reds
			},
			betstr: reds.join(' ') + ':105',
			manualFirst: true
		};
		this.create(result);
	}; 
	
	var rx6_random = function(){
		var reds = Tool.baseBallRandom(6,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: reds
			},
			betstr: reds.join(' ') + ':106',
			manualFirst: true
		};
		this.create(result);
	};
	
	var rx7_random = function(){
		var reds = Tool.baseBallRandom(7,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: reds
			},
			betstr: reds.join(' ') + ':107',
			manualFirst: true
		};
		this.create(result);
	};
	
	var rx8_random = function(){
		var reds = Tool.baseBallRandom(8,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: reds
			},
			betstr: reds.join(' ') + ':117',
			manualFirst: true
		};
		this.create(result);
	};
	
	var q1_random = function(){
		var reds = Tool.baseBallRandom(1,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: reds
			},
			betstr: reds.join(' ') + ':101',
			manualFirst: true
		};
		this.create(result);
	};
	
	var q2zhx_random = function(){
		var line1 = Tool.baseBallRandom(1,11,false,true,'ceil').sort(),
			line2 = [];
		while(true){
			line2 = Tool.baseBallRandom(1,11,false,true,'ceil').sort();
			if(_.indexOf(line1,line2[0]) < 0){
				break;
			}
		}
		
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: line1,
				l2: line2
			},
			betstr: line1.join(' ') + '|' + line2.join(' ') + ':142',
			manualFirst: true
		};
		this.create(result);
	};
	
	var q2zx_random = function(){
		var line1 = Tool.baseBallRandom(2,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: line1
			},
			betstr: line1.join(' ') + ':108',
			manualFirst: true
		};
		this.create(result);
	};
	
	var q3zhx_random = function(){
		var line1 = Tool.baseBallRandom(1,11,false,true,'ceil'),
			line2 = [],
			line3 = [];
		while(true){
			line2 = Tool.baseBallRandom(1,11,false,true,'ceil');
			if(_.indexOf(line1,line2[0]) < 0){
				break;
			}
		}
		while(true){
			line3 = Tool.baseBallRandom(1,11,false,true,'ceil');
			if(_.indexOf(line1,line3[0]) < 0 && _.indexOf(line2,line3[0]) < 0){
				break;
			}
		}
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: line1,
				l2: line2,
				l3: line3
			},
			betstr: line1.join(' ') + '|' + line2.join(' ') + '|' + line3.join(' ') + ':162',
			manualFirst: true
		};
		this.create(result);
	};
	
	var q3zx_random = function(){
		var line1 = Tool.baseBallRandom(3,11,false,true,'ceil');
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: line1
			},
			betstr: line1.join(' ') + ':109',
			manualFirst: true
		};
		this.create(result);
	};
	
	var collectionConfig = function(){
		return {
			localStorage: new Store('syybet'),
			tempBox: '#syyBetViewTemp',
			maxbt: 99,
			/**
			 * 机选产生一注
			 * @name random
			 * @memberOf BetCollection
			 */
			random: rx5_random,
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
	
	var appConfig = function(subtype,collection){
		return {
			el: '#betBasket',
			collection: collection,
			title: '十一运夺金',
			manualTar: {
				href: 'syy/' + subtype + '.html',
				animDir: 'forward',
				param: 'edit=true'
			},
			//确定彩种类型
			madeType: function(){
				var key = this.key = 'syy_' + subtype;
				this.setKey();
				this.$el.find('.return').attr('href','syy/'+subtype + '.html');
				if(key == 'syy_rx2'){
					this.collection.random = rx2_random;	
				}else if(key == 'syy_rx3'){
					this.collection.random = rx3_random;
				}else if(key == 'syy_rx4'){
					this.collection.random = rx4_random;
				}else if(key == 'syy_rx5'){
					this.collection.random = rx5_random;
				}else if(key == 'syy_rx6'){
					this.collection.random = rx6_random;
				}else if(key == 'syy_rx7'){
					this.collection.random = rx7_random;
				}else if(key == 'syy_rx8'){
					this.collection.random = rx8_random;
				}else if(key == 'syy_q1'){
					this.collection.random = q1_random;
				}else if(key == 'syy_q2zhx'){
					this.collection.random = q2zhx_random;
				}else if(key == 'syy_q2zx'){
					this.collection.random = q2zx_random;
				}else if(key == 'syy_q3zhx'){
					this.collection.random = q3zhx_random;
				}else if(key == 'syy_q3zx'){
					this.collection.random = q3zx_random;
				}
			},
			confBack: function(subtype){
				this.$el.find('.return').attr('href','ssy/'+subtype);
			},	
			/**
			 * 增加继续购买的选号
			 * @param num{string} 选号字符串
			 */
			addContinues: function(num){
				var self = this;
				self.collection.clear();
				var arr = num.split('&');
				_.each(arr,function(n){
					var _arr = n.split(':');
					var str = _arr[0];
					switch(_arr[1]){
						//任选二
						case '102':
							self.collection.create({
								key: 'syy_rx2',
								bet: Tool.numC(str.split(' ').length,2),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选三
						case '103':
							self.collection.create({
								key: 'syy_rx3',
								bet: Tool.numC(str.split(' ').length,3),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选四
						case '104':
							self.collection.create({
								key: 'syy_rx4',
								bet: Tool.numC(str.split(' ').length,4),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选五
						case '105':
							self.collection.create({
								key: 'syy_rx5',
								bet: Tool.numC(str.split(' ').length,5),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选六
						case '106':
							self.collection.create({
								key: 'syy_rx6',
								bet: Tool.numC(str.split(' ').length,6),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选七
						case '107':
							self.collection.create({
								key: 'syy_rx7',
								bet: Tool.numC(str.split(' ').length,7),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选八
						case '117':
							self.collection.create({
								key: 'syy_rx8',
								bet: Tool.numC(str.split(' ').length,8),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//前一
						case '101':
							self.collection.create({
								key: 'syy_q1',
								bet: str.split(' ').length,
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//前二直选
						case '142':
							self.collection.create({
								key: 'syy_q2zhx',
								bet: str.split('|')[0].split(' ').length * str.split('|')[1].split(' ').length,
								value: {
									l1: str.split('|')[0].split(' '),
									l2: str.split('|')[1].split(' ')
								},
								betstr: n
							});
							break;
						//前二组选
						case '108':
							self.collection.create({
								key: 'syy_q2zx',
								bet: Tool.numC(str.split(' ').length,2),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//前三直选
						case '162':
							self.collection.create({
								key: 'syy_q3zhx',
								bet: str.split('|')[0].split(' ').length * str.split('|')[1].split(' ').length * str.split('|')[2].split(' ').length,
								value: {
									l1: str.split('|')[0].split(' '),
									l2: str.split('|')[1].split(' '),
									l3: str.split('|')[2].split(' ')
								},
								betstr: n
							});
							break;
						//前三组选
						case '109':
							self.collection.create({
								key: 'syy_q3zx',
								bet: Tool.numC(str.split(' ').length,3),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						default:
							break;
					}
				});
			
				
			}
		};
	};

	return {
		initialize: function(subtype){
			C.betcollection = new Bet.Collection(collectionConfig());
			C.betapp = new Bet.App(appConfig(subtype,C.betcollection));
			Tool.detectLocalData('syybet',C.betcollection,'syy',C.Config.tipDetect);
			C.betapp.continueBuy();
			C.betapp.madeType(subtype);
			this.insertNewSelect();
		},
		insertNewSelect: function(){
			if(typeof C.syyrx2ballcollection !== 'undefined' && C.syyrx2ballcollection.verify() === true){
				var betArray = C.syyrx2ballcollection.getBetArray();
				C.betcollection.create(betArray);
				C.syyrx2ballcollection.clear();
			}else if(typeof C.syyrx3ballcollection !== 'undefined' && C.syyrx3ballcollection.verify() === true){
				var betArray = C.syyrx3ballcollection.getBetArray();
				C.betcollection.create(betArray);
				C.syyrx3ballcollection.clear();
			}else if(typeof C.syyrx4ballcollection !== 'undefined' && C.syyrx4ballcollection.verify() === true){
				var betArray = C.syyrx4ballcollection.getBetArray();
				C.betcollection.create(betArray);
				C.syyrx4ballcollection.clear();
			}else if(typeof C.syyrx5ballcollection !== 'undefined' && C.syyrx5ballcollection.verify() === true){
				var betArray = C.syyrx5ballcollection.getBetArray();
				C.betcollection.create(betArray);
				C.syyrx5ballcollection.clear();
			}else if(typeof C.syyrx6ballcollection !== 'undefined' && C.syyrx6ballcollection.verify() === true){
				var betArray = C.syyrx6ballcollection.getBetArray();
				C.betcollection.create(betArray);
				C.syyrx6ballcollection.clear();
			}else if(typeof C.syyrx7ballcollection !== 'undefined' && C.syyrx7ballcollection.verify() === true){
				var betArray = C.syyrx7ballcollection.getBetArray();
				C.betcollection.create(betArray);
				C.syyrx7ballcollection.clear();
			}else if(typeof C.syyrx8ballcollection !== 'undefined' && C.syyrx8ballcollection.verify() === true){
				var betArray = C.syyrx8ballcollection.getBetArray();
				C.betcollection.create(betArray);
				C.syyrx8ballcollection.clear();
			}else if(typeof C.syyq1ballcollection !== 'undefined' && C.syyq1ballcollection.verify() === true){
				var betArray = C.syyq1ballcollection.getBetArray();
				C.betcollection.create(betArray);
				C.syyq1ballcollection.clear();
			}else if(typeof C.syyq2zhxballcollection !== 'undefined' && C.syyq2zhxballcollection.verify() === true){
				var betArray = C.syyq2zhxballcollection.getBetArray();
				C.betcollection.create(betArray);
				C.syyq2zhxballcollection.clear();
			}else if(typeof C.syyq2zxballcollection !== 'undefined' && C.syyq2zxballcollection.verify() === true){
				var betArray = C.syyq2zxballcollection.getBetArray();
				C.betcollection.create(betArray);
				C.syyq2zxballcollection.clear();
			}else if(typeof C.syyq3zhxballcollection !== 'undefined' && C.syyq3zhxballcollection.verify() === true){
				var betArray = C.syyq3zhxballcollection.getBetArray();
				C.betcollection.create(betArray);
				C.syyq3zhxballcollection.clear();
			}else if(typeof C.syyq3zxballcollection !== 'undefined' && C.syyq3zxballcollection.verify() === true){
				var betArray = C.syyq3zxballcollection.getBetArray();
				C.betcollection.create(betArray);
				C.syyq3zxballcollection.clear();
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

