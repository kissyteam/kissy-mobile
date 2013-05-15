
KISSY.add('mobile/app/1.2/demo/lottery/js/reward/list' , function(S , Layout , Tool , Backbone , _) {
	
	var Model = Backbone.Model.extend({});

	var ListCollection = Backbone.Collection.extend({
		model: Model,
		localStorage: new Store('rewardList'),
		initialize: function(){
			this.bind('add',this.addOne,this);
		},
		addOne: function(model){
			var view = new RewardView({
				model: model
			});
			view.render();
		}		
	});
	
	var RewardView = Backbone.View.extend({
		tagName: 'li',
		render: function(){
			var domstr = _.template($('#rewardDataListTemp').html(),this.model.toJSON());
			this.$el.html(domstr);
			$('#rewardListMain ul').append(this.$el);
			C.rewardListMainscroll.refresh();	
		}
	});
	
	var ListApp = Backbone.View.extend({
		el: '#rewardList',
		//默认拉取第一页
		page: 1,
		//默认一页10条数据
		pageSize: 10,
		//已经拉取的次数
		_exsit: 1,
		events: {
			'click .getMore' : 'getMore',
			'click .return': 'back'
		},
		back: function(e){
			location.href = decodeURIComponent($(e.currentTarget).attr('href'));
		},
		getMore: function(){
			if(this._exsit++ >= 10){
				this.$('.getMore').html('无法获取更多开奖数据...');
				return;
			}
			this.$('.getMore').addClass('hidden');
			this.$('.load').removeClass('hidden');
			this.fetchList();
		},
		/**
		 * 初始化
		 * @memberOf NavApp
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		initialize: function(type){
			this.type = type;
			this.setTitle(type);
			this.setRLRightBar(type).fetchList(type);
			this.buildPullRefresh();
			Layout.removeTaoPlus();
		},
		/**
		 * 创建该页的iscroll对象
		 * @memberOf ListApp
		 * @name buildPullRefresh
		 * @return void
		 */
		buildPullRefresh: function(){
			var winH = window.innerHeight, headH = $('.header').height();
			var self = this;
			this.tip = this.$('.tip');
			this.g = this.$('.tip s');
			this.s = this.$('.tip span');
			$('#rewardListMain').height(winH - headH + 'px');
			$('#rewardListMain ul').css('minHeight',winH - headH - 20 + 'px');
			Layout.singleScroll('rewardListMain',{
				hideScrollbar: true,
				useTransition: true
			});
			return this;
		},
		/**
		 * 设置标题
		 * @memberOf ListApp
		 * @name setTitle
		 * @return ListApp
		 */
		setTitle: function(type){
			var t = '';
			for(var i in C.Config.lotTypeNumberId){
				if(type == C.Config.lotTypeNumberId[i]){
					t = i;
				}
			}
			this.$('.header h2').html(C.Config.lotteryTypeHash[t]);
			return this;
		},
		/**
		 * 设置开奖公告列表右侧按钮状态(显示以否、超链接)
		 
		 */
		setRLRightBar: function(type){
			if(_.indexOf(C.Config.doneLot,Number(type)) >= 0){
				this.$('.type').removeClass('hidden');
			}
			var obj = this.$('.type');
			switch(type){
				case '1':
					obj.attr('data-param','lotype=ssq');
					break;
				case '8':
					obj.attr('data-param','lotype=dlt');
					break;
				case '7':
					obj.attr('data-param','lotype=qlc');
					break;
				case '22':
					obj.attr('data-param','lotype=swxw');
					break;
				case '2':
					obj.attr('data-param','lotype=fc3dzhx');
					break;
				case '15':
					obj.attr('data-param','lotype=syy&subtype=rx5');
					break;
				default:
					//todo
					break;
			}
			return this;
		},
		/**
		 * 获取更多开奖数据
		 * @name getMoreData
		 * @memberOf ListApp
		 */
		getMoreData: function(){
			var self = this;
			var isBottom = C.rewardListMainscroll.y <= C.rewardListMainscroll.maxScrollY - 60 ? true : false;
			_.delay(function(){
				if(isBottom){
					self.fetchList();						
				}
			},100);
		},
		/**
		 * 抓取开奖公告数据
		 * @name fetchReward
		 * @memberOf ListApp 
		 */
		fetchList: function(){
			var url = C.Config.getRewardDataListUrl() + '?typeId=' + this.type + '&callback=C.listapp.handle&t=' + new Date().getTime() + '&page=' + this.page + '&pageSize=' + this.pageSize;
			Tool.getScript(url);
		},
		/**
		 * 分发数据 
		 * @memberOf ListApp
		 * @name oneTimePush
		 * @param data{object} 抓取回来的数据
		 * @return void
		 */
		handle: function(data){
			this.page ++;
			var self = this;
			self.$('.loading').addClass('hidden');
			if(!data.status){
				alert('获取数据失败，请稍后再试');
			}else{
				var c = new ListCollection();
				_.each(data.issueList,function(n){
					n.lotteryType = self.type
				});
				_.each(data.issueList,function(m){
					c.create(m);
				});
				_.delay(function(){
					self.$('.getMore').removeClass('hidden');
					self.$('.load').addClass('hidden');
					C.rewardListMainscroll.refresh();
				},0);
			}
		},
		/**
		 * 保存当前step到配置项
		 * @memberOf ListApp
		 * @return ListApp
		 */
		setStep: function(step){
			C.Config.step = Number(step);
			return this;
		},
		
	});
	
	return {
		initialize: function(type){
			C.listapp = new ListApp(type);
		}
	};

} , {
	requires: [
		'mobile/app/1.2/demo/lottery/js/base/layout',	
		'mobile/app/1.2/demo/lottery/js/base/tool',	
		'mobile/app/1.2/demo/lottery/js/lib/backbone-localstorage',
		'mobile/app/1.2/demo/lottery/js/lib/underscore'
	]
});


