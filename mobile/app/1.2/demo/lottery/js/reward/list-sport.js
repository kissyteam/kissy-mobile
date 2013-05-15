/**
 * 声明seajs模块
 */

KISSY.add('mobile/app/1.2/demo/lottery/js/reward/list-sport' , function(S , Tool , Layout ,  Backbone , _) {
	var ItemModel = Backbone.Model.extend({});
	
	/**
	 * 开奖结果列表数据集合
	 * @class ItemCollection
	 * @name ItemCollection
 	 */
 	var ItemCollection = Backbone.Collection.extend({
 		model: ItemModel
	});

	/**
	 * 订单列表视图
	 * @class ItemView
	 * @name ItemView
	 */
	var ItemView = Backbone.View.extend({
		events: {
			'click .hd': 'toggleCallapse'
		},
		render: function(tpl) {
			var obj = this.model.toJSON();
			$(this.el).html(_.template(tpl, obj));
			return this;
		},
		toggleCallapse: function(e) {
			e.stopPropagation();
			Tool.toggleClass($(e.currentTarget).find('s'), 'fold');
			Tool.toggleClass($(e.currentTarget).siblings(), 'collapse');
			C['match-boxscroll'].refresh();
		}
	});

	var AppView = Backbone.View.extend({
		el: '#reward',
		initialize: function(cfg) {
			var self = this;
			//配置
			cfg = $.extend({}, cfg);
			Tool.buildCfg.call(self, cfg);
			
			this.$('.header h2').html(self.lotteryTypeLocalName);
			
			//初始化控件
			self.getData();
		},
		initReward: function(data) {
			var self = this;
			Layout.removeTransBox();
			$('#match-box .child').empty();
			if (data.status !== 'ok') {
				//exception
				app.jump('exception/index','forward','errcode=' + data.resultCode);
				return;
			}

			if (data.results.length == 0) {
				$('#loading').html('<div class="reward-empty">很抱歉，今日无开奖数据</div>').removeClass('hidden');
				return;
			}

				self.collection = new ItemCollection();
				self.collection.bind('reset', self.renderMatch, this);
			
			//处理data
			var result = data.results;
			_.each(result, function(matchList) {
				_.each(matchList.matchList, function(match) {
					var isDc = true;					
					if (match.lotteryType != 16) {
						isDc = false;
						sp = match.multiSp.split(',');
					}
											
					match.matchsTimes = matchList.matchsTimes;
					match.matchOrder = match.matchOrder.toString().slice(-3);
					match.gameName = Tool.sub(match.gameName, 10);
					match.hostTeam = Tool.sub(match.hostTeam, 8);
					match.visTeam = Tool.sub(match.visTeam, 8);
					match.adjust = isDc ? match.realHandicap : sp[0];
					match.matchWeek = '周' + match.matchsTimes.slice(-1);       //周三
					match.matchTime = match.buyTime.slice(11,16);              //23:45
				});				
			});
			self.collection.reset(result);
		},
		renderMatch: function() {
			var self = this,
				frag = document.createDocumentFragment();
			self.collection.each(function(model){
				var itemView = new ItemView({model: model}),
					tpl = self.tpl;
				$(frag).append(itemView.render(tpl).$el);
			});
			$('#loading').addClass('hidden');
			$('#match-box .child').append(frag);
			$('#match-box').height(window.innerHeight - 52 + 'px');
			Layout.singleScroll('match-box',{
				useTransition: true
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
		'mobile/app/1.2/demo/lottery/js/lib/backbone',
		'mobile/app/1.2/demo/lottery/js/lib/underscore'
	]	
});

