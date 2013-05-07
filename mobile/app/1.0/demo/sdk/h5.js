
window['S'] = KISSY;

KISSY.config({
	packages:[
		{
			name:"mobile",
			tag:"201112299",
			path:"http://a.tbcdn.cn/s/kissy/mobile",
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
			App.forward(url,param);
		},
		back:function(callback){
			App.back(callback);
		},
		set_browser_title : function(title){
			var that = this;
			document.getElementsByTagName('title')[0].innerHTML = title;
			if(that.nav_exist()){
				App.get('page').one('.J-top-nav').one('.J-title').html(title);
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
			App.get('page').one('.J-top-nav').one('.J-back').css({
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
			ta.on(S.UA.mobile ? 'tap' : 'click' ,callback);
		},
		nav_exist: function(){
			var that = this;
			return !!App.get('page').one('.J-top-nav');
		},
		// tap 事件的委托
		// <a target=top>链接不会被委托</a>
		// <a href="javascript:..">不会被委托</a>
		tapDelegate:function(){
			var that = this;
			S.Event.delegate(document,S.UA.mobile ? 'tap' : 'click','a',function(e){
				var el = S.one(e.target);
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
			S.mix(nsearch,{
				client_type:that.client_type,
				client_nav:that.client_nav
			});
			url = new S.Uri(url).setQuery(S.param(nsearch)).toString();
			return url;
		}

	};

	this.App = {};

	KISSY.use('mobile/app/1.0/',function(S,AppFramwork){

		var autoHeightSetting = false;
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
			animWrapperAutoHeightSetting:autoHeightSetting, //  默认为true
			containerHeighTimmer:true,
			tapTrigger:'.not-available'
			/*
			initPostData:{
				a:1,b:2
			}
			*/
		});
		S.ready(function(S){
			Host.tapDelegate();
		});

	});

}).call(this);


