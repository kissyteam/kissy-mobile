
KISSY.add('mobile/app/1.2/demo/lottery/js/reward/all' , function(S , Layout , Tool , Backbone , _) {

	var RewardModel = Backbone.Model.extend({});
	
	var RewardCollection = Backbone.Collection.extend({
		model: RewardModel,
		localStorage: new Store('reward'),
		initialize: function(){
			this.bind('reset',this.addAll,this);
		},
		addAll: function(){
			var frag = document.createDocumentFragment();
			this.each(function(m){
				var view = new RewardView({
					model: m
				});
				view.pushFrag(frag);
			});
			C.rewardapp.oneTimePush(frag);
		}		
	});
	
	var RewardView = Backbone.View.extend({
		tagName: 'li',

		pushFrag: function(frag){
			var domstr = _.template($('#rewardDataTemp').html(),this.model.toJSON());
			this.$el.html(domstr);
			var c = this.$el.find('a').attr('rel');
			this.$el.addClass(c);
			$(frag).append(this.$el);
		}
	});
	
	
	
	var RewardApp = Backbone.View.extend({
		el: '#reward',
		/**
		 * 初始化
		 * @memberOf NavApp
		 */
		initialize: function(){
			this.fetchReward();
			Layout.removeTaoPlus();
		},
		/**
		 * 抓取开奖公告
		 * @name fetchReward
		 * @memberOf RewardApp 
		 */
		fetchReward: function(){
			var url = C.Config.getRewardDataUrl() + '?typeId=' + C.Config.getRewardTypes() + '&callback=C.rewardapp.handle&t=' + new Date().getTime();
			Tool.getScript(url);
		},
		/**
		 * 分发数据 
		 * @memberOf RewardApp
		 * @name oneTimePush
		 * @param data{object} 抓取回来的数据
		 * @return void
		 */
		handle: function(data){
			if(!data.status){
				alert('获取数据失败，请稍后再试');
			}else{
				var c = new RewardCollection();
				c.reset(data.results.concat(C.Config.rewardArray));
			}
		},
		/**
		 * 一次性把生成的文档片段插入dom
		 * @memberOf RewardApp
		 * @name oneTimePush 
		 * @param frag{dom} 文档碎片
		 */
		oneTimePush: function(frag){
			this.$('.loading').remove();
			$('#rewardMain ul').append(frag);
			_.delay(function(){
				C.rewardMainscroll.refresh();
			},100);
		}
		
		
	});
	
	
	return {
		initialize: function(){
			this.buildScroll();
			C.rewardapp = new RewardApp();
		},
		
		/**
		 * 创建该页的iscroll对象
		 * @memberOf Nav
		 * @return Nav
		 */
		buildScroll: function(){
			var winH = window.innerHeight,
				headH = $('.header').height();
			$('#rewardMain').height(winH - headH + 'px');
			Layout.buildScroll('rewardMain');
			return this;
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

