/**
 * 声明seajs模块
 * 竞技彩对阵页
 */
KISSY.add("mobile/app/1.2/demo/lottery/js/base/match" , function(S , Tool , Layout , _ , Backbone , juicer) {
	!C.DataCache && (C.DataCache = {});
	_.extend(C.DataCache, Backbone.Events);   //使该对象可发起自定义事件
	
	
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
				C.DataCache.trigger('append', {
					data: this.frag
				});
			}
 		}
	});
	
	/**
	 * 已选对阵数据集合
	 * @class SelectedCollection
	 * @name SelectedCollection
 	 */
 	var SelectedCollection = Backbone.Collection.extend({
 		model: ItemModel
	});

	/**
	 * 对阵列表视图
	 * @class ItemView
	 * @name ItemView
	 */
	var ItemView = Backbone.View.extend({
		tagName: 'dl',
		events: {
			'click dd': 'setSelect' 
		},
		_template: $('#ItemTemp').html(),
		//_template1: $('#ItemTemp1').html(),
		initialize: function() {
   			 this.model.bind('change', this.change, this);
 		},
		//渲染数据
		render: function() {
			var obj = this.model.toJSON(),
				game = obj.gameName;
			//渲染数据
			$(this.el).html(juicer(this._template, obj)).attr('data-gameName', game);
			//根据筛选条件判断是否显示
			if (C.DataCache.filter && !C.DataCache.filter[game].select) {
				$(this.el).addClass('hidden');	
			}
			
			return this;
		},
		//model变化响应
		change: function() {
			var model = this.model,
				id = model.get('id'),
				winChanged = model.hasChanged('win'),
				evenChanged = model.hasChanged('even'),
				negativeChanged = model.hasChanged('negative'),
				selectNum;
			
		
			if (!winChanged && !evenChanged && !negativeChanged) {
				return;
			}

			//UI change
			if (winChanged) {
				Tool.toggleClass(this.$el.find('.win'), 'on');
			}
			if (evenChanged) {
				Tool.toggleClass(this.$el.find('.even'), 'on');
			}
			if (negativeChanged) {
				Tool.toggleClass(this.$el.find('.negative'), 'on');
			}

			//num change
			selectNum = Number(model.get('win')) + Number(model.get('even')) + Number(model.get('negative'));
			model.set('selectNum', selectNum, {silent: true});   //不触发change事件
			
			//selected collection change
			var _selected = C.DataCache.selectedCollection,
				_model = _selected.get(id);
			if (_model) {
				_selected.remove(_model);  //如果已存在，先删除
			}
			
			selectNum && _selected.add(model.toJSON());   //该行已选个数不为0时添加
			
			//渲染UI
			C.DataCache.trigger('match-number-change', {
				len: _selected.length 
			});
		},
		//点击设置选中
		setSelect: function(e) {
			var tar = $(e.currentTarget);
				
			//不可点击，直接返回
			if (tar.hasClass('disable')) {
				return;
			}
			//UI change
			//Tool.toggleClass(tar, 'on');
			
			//model change
			var model = this.model,
				val = tar.attr('rel');
			model.set(val, !model.get(val));	
		}	
	});
	
	
	//对阵页面交互
	var AppView = Backbone.View.extend({
		el: '#sport-match',
		unit: 20,
		playType: 200,
		minMatch: 2,
		events: {
			'click #more': 'showMore',        //显示更多
			'click #delall': 'deleteAll',     //清空
			'click #submit': 'submit',
			'click .type': 'filterMatch',
			'touchstart #delall , #submit , .return , .type': 'tap',  //二态
			'touchend #delall , #submit , .return , .type': 'untap'  //常态
		},
		/* 入口
		 * 配置参数说明
		 * @param {string} id  实例ID，用于jsonp回调
		 * @param {number} lotteryType  彩种ID
		 * @param {string} lotteryTypeName  彩种标识，用于请求数据
		 * @param {number} playType     玩法类型
		 * @param {number} minMatch     最少选择场次
		 * @param {number} unit         每页显示场次，默认为20
		 * @param {string} betpage      投注页url
		 * @param {string} filterpage   筛选页url
		 */
		initialize: function(cfg) {
			var self = this;
			//配置
			cfg = $.extend({}, cfg);
			Tool.buildCfg.call(self, cfg);
			self.layout();
			Layout.removeTaoPlus();
			
			//前往投注
			app.on('jump:jczq/bet',function(e){
				var obj = e.trigger;
				if (self.verify()){
					return true;
				}
				return false;
			},app);
			
			
			//渲染选择比赛场次
			C.DataCache.on('match-number-change', function(e) {
				$('#submit .l').html('已选' + e.len + '场比赛');
			});
			
			C.DataCache.on('append', function(e) {
				self.append(e.data);
			});
					
			//get Data
			var url = C.Config.getMatchDataUrl() + '?callback=' + self.id + '.initMatch&lotteryTypeId=' + self.lotteryTypeName + '&playType=' + self.playType + '&t=' + new Date().getTime();
			Tool.getScript(url);
		},

		filterMatch: function(e) {
			var self = this;
			if (!C.DataCache.matchList) {       //无赛事
				alert('暂无赛事');
				e.preventDefault();
			}
			if (!C[self.lotteryTypeName + 'matchtype']) {    //首次进入筛选
				//遍历match对象(全部，非当前collection)，生成筛选明细				
				var obj = {};
				obj.length = 0;
				obj.data = {};
				_.each(C.DataCache.matchList, function(match) {
					var name = match.gameName;	
					if (!obj.data[name]) {
						obj.data[name] = {};
						obj.data[name].num = 0;
						obj.data[name].select = true;
					}
					obj.data[name].num ++;
					obj.length ++;
				});	
				C[self.lotteryTypeName + 'matchtype'] = obj;	
			}
		},

		layout: function(){
			var win = window.innerHeight;
			$('#content').height(win - 125 + 'px');
			$('#footer').removeClass('hidden').css('top',80 + $('#content').height() + 'px');
			Layout.singleScroll('content', {
				useTransition: true,
				bounce: false
			});
		},
		//初始化对阵
		initMatch: function(data) {
			var self = this;
			//异常
			if (data.status !== 'ok') {
				localStorage.setItem('exceptionCode', data.resultCode);
				alipay.navigation.pushWindow('../exception/exc.html');
				return;		
			}
			//无对阵
			if (data.results.length === 0) {
				$('#loading').html('<div class="match-empty">今日暂无对阵</div>').removeClass('hidden');
				return;
			}
			
			self.collection = new ItemCollection();
			C.DataCache.selectedCollection = new SelectedCollection();
			//处理数据，单场和竞彩稍有不同
			var arr = [];
			_.each(data.results, function(matchList) {
				_.each(matchList.matchList, function(match) {
					//过滤掉的赛事，忽略
					if(typeof C[self.lotteryTypeName + 'matchtype'] !== 'undefined' && !C[self.lotteryTypeName + 'matchtype'].data[Tool.sub(match.gameName, 10)].select){
						return;
					}
					if (!match.dcIsFinished) {         //单场结束标识
						var isDc = true, sp;
						if (match.lotteryType != 16) {
							isDc = false;
							sp = match.multiSp.split(',');
						}
						match.matchsTimes = matchList.matchsTimes;
						match.gameName = Tool.sub(match.gameName, 10);
						match.hostTeam = Tool.sub(match.hostTeam, 8);
						match.visTeam = Tool.sub(match.visTeam, 8);
						match.win = false;
						match.even = false;
						match.negative = false;
						match.adjust = isDc ? match.realHandicap : sp[0].split(':')[0];
						match.winSp = isDc ? match.scsp3.toFixed(2) : Number(sp[1]).toFixed(2);
						match.evenSp = isDc ? match.scsp0.toFixed(2) : Number(sp[2]).toFixed(2);
						match.negativeSp = isDc ? match.scsp1.toFixed(2) : Number(sp[3]).toFixed(2);
						match.selectNum = 0;                                        
						match.matchWeek = '周' + match.matchsTimes.slice(-1);       //周三
						match.matchTime = match.buyTime.slice(11,16);              //23:45
						match.isDt = false;         	 //是否为胆码，投注用
						match.dtDisable = false;  
						arr.push(match);
					}
				});				
			});
			//单场赛事已截止
			if (arr.length == 0) {
				$('#loading').html('<div class="match-empty">本期赛事已截止</div>').removeClass('hidden');
				return;
			}
			
			C.DataCache.matchList = arr;
			C.DataCache.totalPage = Math.ceil(arr.length / self.unit); //分页
			C.DataCache.page = 1;
			//debugger;
			//避免渲染时间过长，首次渲染20条(可配置)
			self.collection.add(arr.slice(0, self.unit));
			self.betCallBack();
		},
		/**
		 * 插入HTML文档片段
		 * @param {node/string} frag  文档片段
		 */
		append: function(frag) {
			var self = this;
			$('#match-box').append(frag);
			$('#loading').css({'paddingTop': '20px', 'paddingBottom': '0'}).addClass('hidden');
			//是否显示更多
			if (C.DataCache.totalPage > C.DataCache.page) {
				$('#more').removeClass('hidden');
			}
			C.contentscroll.refresh();	
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
		//显示更多
		showMore: function() {
			var self = this,
				page = C.DataCache.page;				
			C.DataCache.page ++;
			$('#more').addClass('hidden');
			$('#loading').removeClass('hidden');
			
			//显示下一页
			_.delay(function() {
				self.collection.add(C.DataCache.matchList.slice(page * self.unit, (page + 1) * self.unit));
				self.betCallBack();
			}, 300);
		},
		//清除选号
		deleteAll: function() {
			var self = this,
				_selected = C.DataCache.selectedCollection,
				arr = [];
			if (!_selected.length) {   //已选场次为0
				return;
			}
			
			//获取需要清空的model数组，减少循环的长度
			_selected.each(function(model) {
				arr[arr.length] = model.get('id');
			}); 
			
			//将数据状态同步到collection上，全部选项置为false
			_.each(arr, function(id) {
				self.collection.get(id).set({
					'win': false,
					'even': false,
					'negative': false
				});
			});
		},
		//确定进入下一步
		submit: function(e) {
			if (this.verify()) {
				//存储已选比赛数组	
				var arr = [];
				C.DataCache.selectedCollection.each(function(model) {
					arr[arr.length] = JSON.stringify(model.toJSON());
				});
				return true;
			}
			return false;
		},
		//验证
		verify: function() {
			var len = C.DataCache.selectedCollection.length,
				min = this.minMatch;
			if (len < min) {
				alert('请至少选择' + min + '场赛事', function(){}, '提示');
				return false;
			}
			return true;
		},
		
		//选择比赛改变回调
		betCallBack: function() {
			if(!C.DataCache.betSelected) return;
			var self = this;
			_.each(self.collection.models,function(match){
				_.each(C.DataCache.betSelected.models,function(m){
					if(m.get('matchOrder') == match.get('matchOrder')){
						match.set({
							win: m.get('win'),
							even: m.get('even'),
							negative: m.get('negative'),
							isDt: m.get('isDt')
						});
					}
				});
			});
		}
	});
	
	return {
		app: AppView
	}

} , {
	requires: [
		'mobile/app/1.2/demo/lottery/js/base/tool',
		'mobile/app/1.2/demo/lottery/js/base/layout',
		'mobile/app/1.2/demo/lottery/js/lib/underscore',
		'mobile/app/1.2/demo/lottery/js/lib/backbone',
		'mobile/app/1.2/demo/lottery/js/lib/juicer'
	]	
});


