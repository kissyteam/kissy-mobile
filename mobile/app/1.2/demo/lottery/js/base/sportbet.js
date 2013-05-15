/**
 * 声明seajs模块
 * 竞技彩赛事筛选
 */


KISSY.add("mobile/app/1.2/demo/lottery/js/base/sportbet", function (S , Tool , Layout , Calculator , Confirm , _ , Backbone) {

	!C.DataCache && (C.DataCache = {});
	_.extend(C.DataCache, Backbone.Events);   //使该对象可发起自定义事件
	
	C.Calculator = Calculator;
	
	//model
	var ItemModel = Backbone.Model.extend({
		initialize: function() {
			//设置ID
			this.set('id', this.get('matchOrder'));
 		}
	});
	
	/**
	 * 对阵数据集合
	 * @class ItemCollection
	 * @name ItemCollection
 	 */
 	var ItemCollection = Backbone.Collection.extend({
 		model: ItemModel,
 		/**
		 * initialize
 		 */
 		initialize: function() {
			//this._obj = obj;       //ItemCollection实例所属对象
			this.frag = document.createDocumentFragment();
			this.bind('add', this.addItem, this);
 		},
		//添加一条数据
		addItem: function(model, models, option) {
			var itemView = new ItemView({model: model});
			$(this.frag).append(itemView.render().$el);
			
			if (option.index === (this.length - 1)) {
				C.DataCache.issueId = model.get('issueId');
				C.DataCache.trigger('appendBet', {
					data: this.frag
				});
			}
 		}
	});

	/**
	 * 对阵列表视图
	 * @class ItemView
	 * @name ItemView
	 */
	var ItemView = Backbone.View.extend({
		tagName: 'li',
		events: {
			'click span.bet': 'setMatch',
			'click span.dt': 'setDt'
		},
		_template: $('#ItemTemp1').html(),
		initialize: function() {
			var model = this.model;
   			model.bind('change:win', this.matchChange, this);
   			model.bind('change:even', this.matchChange, this);
   			model.bind('change:negative', this.matchChange, this);
   			model.bind('change:dtDisable', this.dtStaChange, this);
 		},
		//渲染数据
		render: function() {
			var obj = this.model.toJSON();
			//渲染数据
			$(this.el).html(juicer(this._template, obj));			
			return this;
		},
		//model:match变化响应
		matchChange: function() {
			var model = this.model,
				oldselectNum = model.get('selectNum'),
				selectNum;
			
			//num change
			selectNum = Number(model.get('win')) + Number(model.get('even')) + Number(model.get('negative'));
			model.set('selectNum', selectNum, {silent: true});   //不触发change事件
			
			if (oldselectNum == 0 && selectNum != 0) {
				C.DataCache.matchNum ++;
				model.set('dtDisable', false); 
			} else if (oldselectNum != 0 && selectNum == 0) {
				C.DataCache.matchNum --;
				model.set('dtDisable', true);  //选择场次为0，不可设胆
			}
			
			C.DataCache.trigger('resetStatus');
		},
		//model:dtDisable变化响应
		dtStaChange: function() {
			var model = this.model,
				$dt = this.$el.find('.dt'),
				dtDisable = model.get('dtDisable');
			
			if (dtDisable) {
				model.set('isDt', false);
				if ($dt.hasClass('on')) {
					$dt.removeClass('on');
					C.DataCache.dNum --;
				}
				$dt.addClass('disable');
			} else {
				$dt.removeClass('disable');
			}	
		},
		//点击设置选中
		setMatch: function(e) {
			var tar = $(e.currentTarget),
				model = this.model,
				val = tar.attr('rel');
				
			//UI change
			Tool.toggleClass(tar, 'on');
			//model change
			model.set(val, !model.get(val));
		},
		setDt: function(e) {
			var tar = $(e.currentTarget);
				
			//不可点击，直接返回
			if (tar.hasClass('disable')) {
				return;
			}
			//UI change
			Tool.toggleClass(tar, 'on');
			
			var model = this.model;
			//model change
			model.set('isDt', !model.get('isDt'));
			model.get('isDt') ? C.DataCache.dNum ++ : C.DataCache.dNum --;

			C.DataCache.trigger('resetStatus');
		}
	});
	
	/**
	 * 视图
	 * @class AppView
	 * @name AppView
	 */
	var AppView = Backbone.View.extend({
		el: '#sport-bet',
		playType: 200,
		minMatch: 2,
		hasRepeat: false,  //是否去重
		percent: 1,  //奖金分成
		fullNum: 3,
		maxBt: 1000,
		maxBetFee: 2000,
		betPlayType: 0,
		betSort: false,
		events: {
			//'click #scroll-trig': 'collapseAct',
			//'click #pass-type li': 'setCheck',       //过关方式
			//'click #delall': 'deleteAll',
			//'click #submit': 'submit',        //确认进入下一步
			//'click #agree': 'agreeTreaty',        //勾选购彩协议
			//'click #treaty': 'showTreaty',        //查看购彩协议
			
			'input #bt': 'setBt',
			'click #pass-type li': 'setCheck',       //过关方式
			'click #agree': 'agreeTreaty',        //勾选购彩协议
			'click #treaty': 'showTreaty',        //查看购彩协议
			'click #delall': 'deleteAll',
			'click #submit': 'submit',        //确认进入下一步
			'touchstart #delall , #submit , .return , .type': 'tap',  //二态
			'touchend #delall , #submit , .return , .type': 'untap'  //常态
		},
		//初始化
		initialize: function(cfg) {
			var self = this;
			//配置
			cfg = $.extend({}, cfg);
			Tool.buildCfg.call(self, cfg);
			this.loadSubmit(this.id + '.orderCallback');
			//左操作符：返回
			window['leftBar'] = function() {
				//同步选择比赛状态
				var _old = localStorage.getItem('__tbcp__match'),
					_new = '', arr = [];
					
				self.collection.each(function(model) {
					arr[arr.length] = JSON.stringify(model.toJSON());
				});
				_new = arr.join('^_^');
					
				if (_old !== _new) {
					localStorage.setItem('__tbcp__match__change', 'true');
					localStorage.setItem('__tbcp__match', _new);
				}
				localStorage.setItem('__tbcp__passtype', C.DataCache.passType.join('^'));
				localStorage.setItem('__tbcp__bt', C.DataCache.bt);
				
				alipay.navigation.popWindow();	
			};
			
			
			//
			C.DataCache.on('resetStatus', function() {
				self.setPassTypeAble();
				self.setDanAble();
				
				C.DataCache.trigger('calculate');
			});
			
			C.DataCache.on('calculate', function() {
				self.calculate();
			});
			
			C.DataCache.on('renderBetFee', function() {
				var bt = C.DataCache.bt,
					fee = self.fee,
					max = Number(self.max),
					min = Number(self.min),
					totalFee = self.totalFee = fee * bt;
				$('#fee').html(totalFee + '元');
				$('#award').html((min * bt).toFixed(2) + '-' + (max * bt).toFixed(2));
			});
			
			C.DataCache.on('appendBet', function(e) {
				self.appendBet(e.data);
			});
			
			this.initCollection();
		},
		initCollection: function() {
			var self = this;
			//self.collection = new ItemCollection();
			
			C.DataCache.betSelected = new ItemCollection();
			
			//from local storage
			var models = (C.DataCache.selectedCollection && C.DataCache.selectedCollection.toJSON()),
				passType = [],
				bt = 1;
			
			/*_.each(models, function(model, index) {
				models[index] = JSON.parse(model);
			});*/
			if(typeof models !== 'undefined'){
				C.DataCache.betSelected.add(models);
			}			
			
			//cache
			C.DataCache.matchNum = models ? models.length : 0; 
			C.DataCache.dNum = 0;
			C.DataCache.passType = passType;
			C.DataCache.bt = bt;
			C.DataCache.minMatch = self.minMatch;
			C.DataCache._passType = [];      //编码后passType数组
			
			//投注和排序用
			_.each(passType, function(pt) {
				C.DataCache._passType.push(self.decodePassType(pt));
			});

			//UI change
			$('#bt').val(bt);
			
			//过关方式
			C.DataCache.trigger('resetStatus');
		},
		/*
		 * 二态
		 */
		tap: function(e){
			$(e.currentTarget).addClass('tap');
		},
		untap: function(e){
			$(e.currentTarget).removeClass('tap');
		},
		decodePassType: function(str) {
			return str === '单关' ? '1' : str.replace('串', '*');
		},
		//UI生成
		appendBet: function(frag) {
			var self = this;
			$('#match-list ul').append(frag);
			setTimeout(function() {
				self.setRegion();
			}, 0);
		},
		setBt: function(e) {
			var tar = $(e.target),
				bt = Number(tar.val());
			
			bt = (isNaN(bt)) ? 1 : bt;
			if (bt > this.maxBt) {
				bt = this.maxBt;
			}	
			tar.val((bt == 0) ? '' : bt);
			
			C.DataCache.bt = bt;
			C.DataCache.trigger('renderBetFee');
		},
		setRegion: function() {
			var winH = window.innerHeight,
				botH = $('#actarea').hasClass('opposite') ? 45 : 159,
				maxH = winH - botH,
				matchH = $('#match-list ul').height();
			$('#match-list').height(winH - 213 + 'px');
			Layout.singleScroll('match-list',{
				useTransition: true,
				bounce: false
			});
		},
		setPassTypeAble: function() {
			var self = this,
				cache = C.DataCache;
			if (!self.$passType) {
				self.$passType = $('#pass-type li');
			}
			
			var $pt = self.$passType;
			$pt.each(function(index, node) {
				var $node = $(node),
					rel = $node.attr('rel');
				if (rel < cache.minMatch || rel > cache.matchNum || rel <= cache.dNum) {   //小于最小场次或大于已选比赛场次
					$node.removeClass('on').addClass('disable');
					return;
				}
				
				$node.removeClass('disable');
				
				//初始化时读取缓存
				if (C.DataCache.passType.indexOf($node.html()) >= 0) {
					$node.addClass('on');
				}
			});
		},
		setDanAble: function() {
			var self = this,
				cache = C.DataCache,
				ptArr = C.DataCache._passType;
			
			if (!ptArr.length) {     //如果过关方式为空，able所有胆(没有选择的场次仍为disable)
				if (cache.dNum == cache.matchNum - 1) {
					//如果当前胆数 = 所选场次数-1，disable其他所有胆		
					C.DataCache.betSelected.each(function(model) {
						if (!model.get('isDt')) {
							model.set('dtDisable', true);
						}
					});
				} else {
					C.DataCache.betSelected.each(function(model) {
						if (model.get('selectNum') > 0) {
							model.set('dtDisable', false)
						}
					});
				}
			} else {
				//获取最小过关方式
				var minPt = ptArr.sort()[0],
					m = minPt.charAt(0);
					 
				if (m >= cache.matchNum) {
					//如果最小过关方式 >= 所选比赛场次，disable所有胆
					C.DataCache.betSelected.each(function(model) {
						model.set('dtDisable', true);
					});
				} else if (cache.dNum == m - 1) {
					//如果当前胆数 = 最小过关方式-1，disable其他所有胆		
					C.DataCache.betSelected.each(function(model) {
						if (!model.get('isDt')) {
							model.set('dtDisable', true);
						}
					});
				} else {
					C.DataCache.betSelected.each(function(model) {
						if (model.get('dtDisable') && model.get('selectNum') > 0) {
							model.set('dtDisable', false);
						}
					});
				}
			}
		},
		collapseAct: function(e) {
			Tool.toggleClass($('#actarea'), 'opposite');
			this.setRegion();    //重置滚动区域
		},
		setCheck: function(e) {
			var tar = $(e.currentTarget),
				pt = tar.html(),
				_pt = this.decodePassType(pt);
				
			//不可点击，直接返回
			if (tar.hasClass('disable')) {
				return;
			}
			
			//UI change
			Tool.toggleClass(tar, 'on');
			
			if (tar.hasClass('on')) {
				C.DataCache.passType.push(pt);
				C.DataCache._passType.push(_pt);    
			} else {
				C.DataCache.passType = _.without(C.DataCache.passType, pt);
				C.DataCache._passType = _.without(C.DataCache._passType, _pt);
			}
			C.DataCache.trigger('resetStatus');
		},
		agreeTreaty: function(e) {			
			//UI change
			Tool.toggleClass($(e.currentTarget), 'checked');	
		},
		showTreaty: function() {
			app.jump('treaty/index','forward');
		},
		deleteAll: function(e) {
			var self = this; 
			new Confirm.initialize({
				onConfirm: function(){
					self.clearAll();
				},
				content: '清空已选赛事？'
			});
			
		},
		clearAll: function() {
			var self = this;
			$('#match-list ul').empty();
			C.DataCache.betSelected.each(function(model) {
				model.set({
					'win': false,
					'even': false,
					'negative': false,
					'isDt': false,
					'dtDisable': false,
					'selectNum': 0
				}, {silent: true});
			});
			C.DataCache.matchNum = 0;
			self.betString = [];
			
			$('#pass-type li').each(function(index, node) {
				$(node).addClass('disable').removeClass('on');
			});
			
			C.DataCache.passType = [];
			C.DataCache._passType = [];
			
			//clear bt UI
			$('#bt').val(1);
			
			//clear bt
			C.DataCache.bt = 1;
			
			C.DataCache.trigger('resetStatus');
		},
		calculate: function() {
			var self = this,
				num, fee, min, max, betString = []; 
			if (!C.DataCache.passType.length) {
				num = fee = 0;
				min = max = '0.00';
			} else {
				var dArr = [], tArr = [], spArray = [], minSpArray = [], maxSpArray = [], dCount = 0, count = 0, alldCount = 0, allCount = 0;
				C.DataCache.betSelected.each(function(model) {
					var selectNum = model.get('selectNum');
					if (selectNum > 0) {   //该场比赛已选赛事不为0
						var _arr = [], _str = model.get('matchOrder'), isDt = model.get('isDt'), isFull = (selectNum == self.fullNum);
						if (isDt) {
							dArr.push(selectNum);
							dCount ++;
							if (isFull) {
								alldCount ++;
								allCount ++;
							}
							_str += '#';
						} else {
							tArr.push(selectNum);
							if (isFull) {
								allCount ++;
							}
						}
						
						count ++;
						_str += ':'
						
						if (self.betSort) {
							if (model.get('negative')) {
								_arr.push(Number(model.get('negativeSp')));
								_str += '0,';
							} 
							if (model.get('even')) {
								_arr.push(Number(model.get('evenSp')));
								_str += '1,';
							} 
							if (model.get('win')) {
								_arr.push(Number(model.get('winSp')));
								_str += '3,';
							} 
						} else {
							if (model.get('win')) {
								_arr.push(Number(model.get('winSp')));
								_str += '3,';
							} 
							if (model.get('even')) {
								_arr.push(Number(model.get('evenSp')));
								_str += '1,';
							} 
							if (model.get('negative')) {
								_arr.push(Number(model.get('negativeSp')));
								_str += '0,';
							} 
						}
						
						_arr.sort();
						spArray.push({
							min: _arr[0],
							max: _arr[_arr.length - 1],
							isDt: isDt,
							isFull: isFull
						});  
						betString.push(_str.slice(0, -1));       //投注字符串
					}
				});
				
				dArr = Calculator.transArrayToNum(dArr);
				tArr = Calculator.transArrayToNum(tArr);
				minSpArray = Calculator.sortSPArray(spArray, true);
				maxSpArray = Calculator.sortSPArray(spArray, false);
				passType = C.DataCache._passType;
				
				
				num = Calculator.calCount(self.hasRepeat, dArr, tArr, passType, dCount, count);
				fee = num * 2;
				min = Calculator.calExtreme(self.hasRepeat, minSpArray, passType, dCount, 'min', self.percent, alldCount, allCount);
				max = Calculator.calExtreme(self.hasRepeat, maxSpArray, passType, dCount, 'max', self.percent, alldCount, allCount);
			} 
			
			//cache
			self.num = num;
			self.fee = fee;
			self.max = max;
			self.min = min;
			self.betString = betString;
			C.DataCache.trigger('renderBetFee');
		},
		submit: function(e) {
			if (this.verify()) {
				//getTradeNo
				Layout.transBox('正在提交订单，请稍候');
				Tool.getScript(C.Config.getBetUrl() + this.getFormFields(this.id + '.orderCallback'), {
					offhandler: function() {
						Layout.removeTransBox();
					}
				});
			}
			return false;
		},
		/**
		 * js触发click事件
		 * @memberOf BetApp
		 * @name simulateClick 
		 * @param el{dom}  裸的dom元素
		 */
		simulateClick: function(el){
			//检测是否webkit内核
			var isWebkit = /webkit/.test(navigator.userAgent.toLowerCase());
			if(isWebkit){
				try{  
		            var evt = document.createEvent('Event');  
		            evt.initEvent('click',true,true);  
		            el.dispatchEvent(evt);  
		        }catch(e){
		        	alert(e,function(){},'提示');
		        };
			}else{
				el.click();
			}
		},
		orderCallback: function(data) {
			var self = this;	
			Layout.removeTransBox();
			if (data.status === false) {
				if (data.resultCode == 'NEW_LOTTERY_USER') {
					new Confirm.initialize({
						onConfirm: function(){
							app.jump('newuser/index','forward','betfrom=' + encodeURIComponent(location.href));
						},
						onCancel: function(){
							//如果已经登陆后
							if(location.search.indexOf('numberStrings') < 0){
								return;
							}
							//未登录
							self.cutPageUrl();
						},
						content: '首次购彩完善信息，现在就去？'
					});
					
				} else if (data.resultCode === 'ERR_LOGIN') {
					//未登录
					var search = this.getFormFields(self.id+'.orderCallback') , s = location.search , origin = location.origin, pathname = location.pathname,
						hash = location.hash,
						redirectUrl = encodeURIComponent(origin + pathname + search + hash);
					location.href = C.Config.getLoginUrl() + '?TPL_redirect_url=' + redirectUrl;
				} else {
					//其他异常处理
					app.jump('exception/index','forward','errcode=' + data.resultCode);
				}
			}else{
				//进入付款流程
				//从href中取sid值，同返回的alipay_trade_no一起提交
				var s_id = C.Template.searchJSON(location.search).sid;
				//正常生成交易订单号
				if(data.tradeNo.indexOf(';') < 0){   //单笔交易
					$('#paybtn').attr('href',C.Config.getPaySingleUrl() + '?alipay_trade_no=' + data.tradeNo.replace(/;/gi,',') + '&s_id=' + s_id);
				}else{
					//多笔交易
					$('#paybtn').attr('href',C.Config.getPayMultiUrl() + '?trade_nos=' + data.tradeNo.replace(/;/gi,',') + '&s_id=' + s_id);
				}
				this.simulateClick($('#paybtn')[0]);
				//投注页面上其他处理
				this.clearAll();
				_.delay(function(){
					self.cutPageUrl();
				},1000);
			}
		},
		/**
		 * 精简成功提交彩票订单返回页面URL（主要清理url中的订单相关参数）
		 * @memberOf 
		 * @name cutPageUrl 
		 */
		cutPageUrl: function(){
			var search = location.search, hash = location.hash, j = Tool.searchJSON(search);
			var sid = j.sid,  mode = j.mode , data = j.mode;
			location.href = location.href.replace(search,'').replace(hash,'') + '?sid=' + sid + '&mode=' + mode + '&data=' + data + hash;
		},
		/**
		 * 登陆后返回的页面，此时直接提交订单（已获sid）
		 * @name loadSubmit
		 * @memberOf BetApp
		 * @return void
		 */
		loadSubmit: function(callback){
			var obj = Tool.searchJSON(location.search),
				_url = '', 
				arr = [];
			
			//判断是否是登陆返回的页面
			if(obj.callback !== callback) return;
			
			Layout.transBox('正在提交订单，请稍候');
			for(var i in obj){
		  		arr.push(i + '=' + obj[i]);
			}
			_url = C.Config.getBetUrl() + '?' + arr.join('&');	
			Tool.getScript(_url);
		},
		//
		verify: function() {
			//勾选购彩协议
			if (!$('#agree').hasClass('checked')) {
				alert('你没有同意网上购彩协议！', function(){}, '提示');
				return false;
			} else if (C.DataCache.matchNum < this.minMatch) {
				alert('至少选择' + this.minMatch + '场比赛，方可投注', function(){}, '提示');
				return false;
			} else if (C.DataCache.passType.length <= 0) {
				alert('至少选择1种过关方式，方可投注', function(){}, '提示');
				return false;
			} else if (C.DataCache.bt <= 0) {
				alert('倍投不能为空', function(){}, '提示');
				return false;
			} else if ((this.fee * C.DataCache.bt) > 2000) {
				alert('单笔投注金额不能超过2000元', function(){}, '提示');
				return false;
			}
			return true;
		},
		/**
		 * 整合提交订单的各字段值
		 * @memberOf BetAppView
		 */
		getFormFields: function(callback){
			/**
			 * agree 是否同意购彩协议 , note: 1 ->同意	0 -> 不同意
			 * lotteryTypeId 彩种ID , note: 21 -> 竞彩足球(建立全彩种lotteryTypeId查询map，config.js)
			 * issueId 彩期ID ， note: xxxx -> 服务器端获取
			 * orderType 订单类型， note: 0 -> 代购	 1 -> 发起合买	2 -> 参与合买	3 -> 追号
			 * buyFrom 订单来源 note: 1 -> 无线
			 * ttid	固定字段	note: html5
			 * playType	竞彩足球特有 note:	0 -> 胜平负玩法
			 * multiple 倍投
			 * totalNum 注数
			 * totalFee 金额
			 * numberStrings 选号格式 note：201205034014:1/201205034015#:1/201205034016#:3,1,0/201205034017:1,0/201205034018:0_3*1^4*1  -> 201205034014 比赛对阵标识  # 设胆  3 1 0 胜平负
			 * callback jsonp回调，开发自定义
			 * sid 登陆后回调参数，用于验证用户登陆状态
			 */
			var numberStrings = this.betString.join('/') + '_' + C.DataCache._passType.join('^'),
				agree = 1,
				lotteryTypeId = this.lotteryType,
				issueId = C.DataCache.issueId,
				orderType = 0,
				buyFrom = 1,
				ttid = C.Config.ttid(),
				playType = this.betPlayType,
				multiple = C.DataCache.bt,
				totalNum = this.num ,sid,
				totalFee = this.totalFee;
			if(Tool.searchJSON().sid){
				sid = Tool.searchJSON().sid;
				localStorage.setItem('sid',sid);
			}else if(localStorage.getItem('sid')){
				sid = localStorage.getItem('sid');
			}
			return '?agree=' + agree + '&lotteryTypeId=' + lotteryTypeId + '&issueId=' + issueId + '&orderType=' + orderType + '&buyFrom=' + buyFrom + '&ttid=' + ttid + '&playType=' + playType + '&multiple=' + multiple + '&totalNum=' + totalNum + '&totalFee=' + totalFee + '&numberStrings=' + numberStrings + '&callback=' + callback + '&sid=' + sid + '&mode=' + Tool.searchJSON().mode + '&data=' + Tool.searchJSON().data; 
		}
	});
	
	return {
		app: AppView
	}

} , {
	requires: [
		'mobile/app/1.2/demo/lottery/js/base/tool',
		'mobile/app/1.2/demo/lottery/js/base/layout',
		'mobile/app/1.2/demo/lottery/js/base/calculator',
		'mobile/app/1.2/demo/lottery/js/widget/confirm/confirm',
		'mobile/app/1.2/demo/lottery/js/lib/underscore',
		'mobile/app/1.2/demo/lottery/js/lib/backbone-localstorage'
	]
});

