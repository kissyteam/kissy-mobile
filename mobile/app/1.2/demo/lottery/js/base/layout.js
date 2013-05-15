/**
 * @fileoverview  网页布局管理模块
 * @author 栋寒（zhenn）	
 * @dependencise: iscroll
 * @for: pad webapp
 */


KISSY.add("mobile/app/1.2/demo/lottery/js/base/layout", function (S , Iscroll , app , _) {

	var layout = {
    	doc: S.one('#doc'),
    	wrapper: S.one('#wrapper'),
        initialize: function() {
            return this;
        },
        setBetRegion: function(){
			var lotype = app.queryKey('lotype' , 'hash');
			if(lotype == 'dlt'){
				$('#bottom').css('height' , '132px');
			}
			var winH = window.innerHeight, 
				issueH = $('#issueInfo').height(), 
				headH = $('.header').height() , 
				footH = parseInt($('#bottom').css('height'));
			var result = winH - footH  - issueH - headH  ;
			if(lotype == 'syy' || lotype == 'xssc'){
				$('#issueInfo').removeClass('hidden');
			}
			S.later(function(){
				$('#pullSelect').height(result  + 'px');
				$('#guide').height(result - 14 + 'px');
				$('#bottom').css('top',$('#pullSelect').height() + issueH + headH + 'px').removeClass('hidden');
			},0);
			return this;
        },
		showSubmit: function(){
			$('.submitBtn').removeClass('hidden');
		},
		removeTaoPlus: function(){
			var taojia = $('#J_Taojia');
			if(taojia.length > 0){
				taojia.remove();
				$('#J_Shade').remove();
			}
		},
        /**
         * 批量创建滚动对象
         * @memberOf Layout
         */
        buildScroll: function() {
            _.each(arguments, function(n) {
                C[n+'scroll'] && C[n+'scroll'].destroy();
                C[n + 'scroll'] = new Iscroll(n, {
                	hideScrollbar: true
                });
            });
            return this;
        },
        /**
         * 单独创建滚动对象，可传配置项
         * @name singleScroll
         * @memberOf Layout
         */
        singleScroll: function(id,cfg){
        	C[id+'scroll'] && C[id+'scroll'].destroy();
        	C[id+'scroll'] = new Iscroll(id,cfg);
        },
        /**
         * 构建AbacusScroll
         * @name buildAbacusScroll
         * @memberOf Layout
         * @return Layout
         */
        doAbacusScroll: function(){
        	var winH = window.innerHeight,
				headH = $('.header').height(),
				playType = $('#selPlayType').height(),
				actarea = $('.actarea').height();
			var result = winH - headH - playType - actarea - 20;
			$('#Abacus').height(result + 'px');
			$('#Abacus .box').css('minHeight',result - 20 + 'px');
			this.singleScroll('Abacus',{
				hideScrollbar: true
			});
			return this;
        },
        /**
         * 构建typeListScroll
         * @param initx{number} 初始化滚动位置
         * @name doTypeListScroll
         * @memberOf Layout
         * @return Layout
         */
        doTypeListScroll: function(initx){
        	$('#typeList ul').width(70 * $('#typeList ul li').length);
			this.singleScroll('typeList',{
				//隐藏水平方向滚动条
				hScrollbar: false,
				onScrollEnd: function(){
					if(this.x == this.maxScrollX){
						$('.more').eq(0).addClass('hidden');
					}else{
						$('.more').eq(0).removeClass('hidden');
					}
				},
				hideScrollbar: true,
				x: initx
				
			});
			return this;
        },
        /**
         * 构建遮罩层
         * @memberOf Laout
         */
        buildMaskLayer: function() {
            var layer = document.createElement('div');
            layer.className = 'mask';
            layer.style.height = window.innerHeight + 'px';
            this.layer = $(layer);
            $('body').append(layer);
        },
        /**
         * 构建遮罩层
         * @memberOf Laout
         */
        removeMaskLayer: function() {
			if(!this.layer) return;
			this.layer.remove();
        },
        /**
		 * 过渡界面
		 * @memberOf Laout 
		 */
		transBox: function(str){
			this.buildMaskLayer();
			$('body').append('<div id="wait"><p>' + str + '</p></div>');
		},
		/**
		 * 移除过渡界面
		 * @memberOf Laout
		 */
		removeTransBox: function(){
			this.removeMaskLayer();
			$('#wait').remove();
		}


    };

	return layout;

}, {
	requires: [
		'mobile/app/1.2/demo/lottery/js/lib/iscroll',
		'mobile/app/1.2/index',
		'mobile/app/1.2/demo/lottery/js/lib/underscore'
	]
});

