
window['S'] = KISSY;

var bachi_debug = (function(){
	var t = new S.Uri(window.location.href).getQuery().get('bachi');
	if(S.isUndefined(t)){
		return false;
	} else {
		return true;
	}
})();

KISSY.config({
	packages:[
		{
			name:"mobile",
			tag:'20130517',
			path:bachi_debug?"http://a.zoojs.org/jayli/kissy-mobile/mobile":"http://a.tbcdn.cn/s/kissy/mobile",
			ignorePackageNameInUri:true,
			debug:true,
			charset:"utf-8"
		}
	]
});

(function(exports){
	"use strict";

	this.Host = {
		platform:'h5',
		client_type:'h5',
		client_nav:'true',
		open:function(url,param){
			// 如果打开的url不是同域，打开新的地址
			var hostname = new S.Uri(url).getHostname();
			if(hostname == "" || hostname == new S.Uri(window.location.href).getHostname()){
				App.forward(url,param);
			} else {
				window.location.href = url;
			}
		},
		back:function(callback){
			App.back(callback);
		},
		set_browser_title : function(title){
			var that = this;
			try {
				document.getElementsByTagName('title')[0].innerHTML = title;
			}catch(e){}
			if(that.nav_exist()){
				App.get('page').one('.J-top-nav').one('.u-title span').html(title);
			}
		},
		set_title : function(){
			this.set_browser_title.apply(this,arguments);
		},
		set_back: function(flag){
			var that = this;
			var style;
			if(typeof flag == 'undefined'){
				flag = true;
			}
			if(!that.nav_exist()){
				return;
			}
			if(flag === false){
				style = 'hidden';
			} else {
				style = 'visible';
			}
			App.get('page').one('.J-top-nav').one('.u-back').css({
				visibility:	style
			});
		},
		// set_icon('a.png',callback)
		set_icon: function(img,callback){
			var that = this;
			if(typeof callback == 'undefined'){
				callback = new Function;
			}

			if(!that.nav_exist()){
				return;
			}
			var ta = S.Node('<a href="javascript:void(0)"></a>');
			ta.css({
				'background':'url('+img+') no-repeat center center'	
			});
			App.get('page').one('.J-top-nav').one('.J-icon').empty().append(ta).css({
				visibility:'visible'	
			});
			ta.on(S.UA.mobile ? 'click' : 'click' ,callback);
		},
		nav_exist: function(){
			var that = this;
			return !!App.get('page').one('.J-mok');
		},
		// tap 事件的委托
		// <a target=top>链接不会被委托</a>
		// <a href="javascript:..">不会被委托</a>
		tapDelegate:function(){
			var that = this;
			S.Event.delegate(document,S.UA.mobile ? 'click' : 'click','a',function(e){
				var el = S.one(e.currentTarget);
				if((
						!S.isUndefined(el.attr('target')) && el.attr('target') !== '' ) || 
							/^javascript:/i.test(el.attr('href'))){

					if(el.attr('target') == 'top'){
						window.location.href=el.attr('href');
						e.preventDefault();
					}

					return;
				} else {
					var url = el.attr('href');
					that.open(that.wrapUrl(url));
					e.preventDefault();
				}
			});
		},
		wrapUrl: function(url){
			var that = this;
			var nsearch = S.unparam(new S.Uri(url).getQuery().toString());
			var client_type = new S.Uri(url).getQuery().get('client_type');
			var client_nav = new S.Uri(url).getQuery().get('client_nav');
			S.mix(nsearch,{
				client_type:S.isUndefined(client_type)?that.client_type:client_type,
				client_nav:S.isUndefined(client_nav)?that.client_nav:client_nav
			});
			url = new S.Uri(url).setQuery(S.param(nsearch)).toString();
			return url;
		}

	};

	this.App = {};

	KISSY.use('mobile/app/1.2/',function(S,AppFramwork){

		var autoHeightSetting = false;
		// 不考虑android下的多页面展示
		if(typeof S.UA.android != 'undefined' && S.UA.android > 0){
			autoHeightSetting = true;
		}

		App = AppFramwork({
			viewpath:'a.php?a='+new Date().getTime(),
			forceReload:true,
			fullRangeWidth:false,
			pageCache:true,
			webkitOptimize:true,
			positionMemory:true,
			// Tip
			// animWrapperAutoHeightSetting: true
			// 		切换开始的时候，首先滚动到顶部,如果带有iscroll控件，此项应当置为false
			// animWrapperAutoHeightSetting: false
			// 		切换开始的时候，不滚动到顶部，如果页面很长，要求切换过程水平平滑
			// TODO
			// 		设置为false时，总是会有闪屏,待解决
			animWrapperAutoHeightSetting:true, //  默认为true
			containerHeighTimmer:true,
			tapTrigger:'.not-available'
		});
		S.ready(function(S){
			Host.tapDelegate();
		});

	});

}).call(this);


