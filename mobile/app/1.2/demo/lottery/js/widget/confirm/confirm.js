
KISSY.add("mobile/app/1.2/demo/lottery/js/widget/confirm/confirm", function (S , Confirm) {

	var confirm = function(){
		this.init.apply(this,arguments);
	};

	confirm.prototype = {
		init: function(config){
			this.buildCfg(config).buildDom().bindEvent();;
		},
		buildCfg: function(config){
			this.onConfirm = config.onConfirm || function(){},
			this.onCancel = config.onCancel || function(){},
			this.content = config.content || '你还没有设置提示内容'
			return this;
		},
		bindEvent: function(){
			var self = this;
			this.cancel.on({
				'click': function(){
					self._cancel.call(self);
				},
				'touchstart': function(e){
					$(e.currentTarget).addClass('taped');
				},
				'touchend': function(e){
					$(e.currentTarget).removeClass('taped');
				}
			});
			this.confirm.on({
				'click': function(){
					self._confirm.call(self);	
				},
				'touchstart': function(e){
					$(e.currentTarget).addClass('taped');
				},
				'touchend': function(e){
					$(e.currentTarget).removeClass('taped');
				}
			});
		},
		_cancel: function(){
			this.destroy();
			this.onCancel();
		},
		_confirm: function(){
			this.destroy();
			this.onConfirm();
		},	
		buildDom: function(){
			var domArr = [
				'<div class="mask"></div>',
				'<div id="confirmBox">',
					'<div class="content">' + this.content + '</div>',
					'<div class="operate">',
						'<em class="cancel">取消</em>',
						'<em class="confirm">确定</em>',
					'</div>',
				'</div>'
			];
			$(document.body).append($(domArr.join('')));
			this.mask = $('.mask');
			this.mask.height(window.innerHeight + 'px');
			this.confirmBox = $('#confirmBox');
			this.cancel = this.confirmBox.find('.cancel');
			this.confirm = this.confirmBox.find('.confirm');
			return this;
		},
		destroy: function(){
			var mask = this.mask,
				confirmBox = this.confirmBox;
			this.cancel.off();
			this.confirm.off();
			//confirmBox.addClass('boxfadeout');
			//_.delay(function(){
				mask.remove();
				confirmBox.remove();
			//},300);
			
		}
	};

	return {
		initialize: confirm
	};


}, {
	requires: [
		'base',
	]
});


