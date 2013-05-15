/**
 * 声明seajs模块
 * 竞技彩赛事筛选
 */


KISSY.add("mobile/app/1.2/demo/lottery/js/base/filter" , function (S , Backbone, Tool , Layout , juicer) {

	var FilterModel = Backbone.Model.extend({});

	/**
	 * 赛事筛选视图
	 * @class AppView
	 * @name AppView
	 */
	var AppView = Backbone.View.extend({
		el: '#filter-content',
		events: {
			'click li': 'setCheck'
		},
		_template: $('#FilterTemp').html(),
		//初始化
		initialize: function(cfg) {
			var self = this;
			
			//配置
			cfg = $.extend({}, cfg);
			Tool.buildCfg.call(self, cfg);
			//左操作符：返回
			window['leftBar'] = function(){
				//直接返回
				alipay.navigation.popWindow();	
			};
			
			app.on('jump:jczq/match',function(e){
				var obj = e.trigger;
				//完成筛选
				if(obj.hasClass('type')){
					//C[self.lotteryTypeName + 'matchtype'] = _.clone(self.filterRes);
					C[self.lotteryTypeName + 'matchtype'] = self.model.toJSON();
					return true;
				}else if(obj.hasClass('return')){
					//直接返回
					return true;
				}
				return false;
			},app);
			
			//右操作符：确定
			window['rightBar'] = function() {
				
				alipay.navigation.popWindow();
			};
			
			//test
			$('#leftBar').click(function(){
				window.leftBar();
			});
			$('#rightBar').click(function(){
				window.rightBar();
			});
			//model initialize
			this.model = new FilterModel(C[self.lotteryTypeName + 'matchtype']);
			//this.filterRes = _.clone(C[self.lotteryTypeName + 'matchtype']);
			this.model.bind('change:length', this.change, this);		
			this.render();
			this.bindEvent();
		},
		bindEvent: function(){
			var self = this;
			$('.return,.type').on({
				'touchstart': self.tap,
				'touchend': self.untap 
			});
		},
		//UI生成
		render: function() {
			this.$el.html(juicer(this._template, this.model.toJSON()));
			setTimeout(function(){
				$('#filter-scroll').height(window.innerHeight - 74 + 'px');
				Layout.singleScroll('filter-scroll',{
					useTransition: true,
					bounce: false
				});
			},0);
			return this;
		},
		change: function() {
			this.$el.find('#num').html(this.model.get('length'));
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
		//设置选中
		setCheck: function(e) {
			var tar = $(e.currentTarget);
				
			//不可点击，直接返回
			if (tar.hasClass('disable')) {
				return;
			}

			Tool.toggleClass(tar, 'on');
			
			//change model
			var model = this.model,
				data = model.get('data'),
				lenth = model.get('length'),
				key = tar.html(),
				value = data[key],
				select;
			
			select = value.select = !value.select;
			if (select) {
				model.set('length', lenth + value.num);
				//this.filterRes.data[key] = data[key];
			} else {
				model.set('length', lenth - value.num);
				//this.filterRes.data = _.omit(this.filterRes.data,key)
			}
			
		}
	});
	
	return {
		app: AppView
	}

} , {
	requires: [
		'mobile/app/1.2/demo/lottery/js/lib/backbone',
		'mobile/app/1.2/demo/lottery/js/base/tool',
		'mobile/app/1.2/demo/lottery/js/base/layout',
		'mobile/app/1.2/demo/lottery/js/lib/juicer'
	]
});

