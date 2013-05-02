;(function($){
	var Route = $.Route;
	
	var ENV = {
		historybox: [],
		loading: [
			'<section class="MS-pannel">',
				'<div class="MS-loading">',
					'<img src="http://a.tbcdn.cn/mw/base/styles/component/more/images/loading.gif" />',
				'</div>',
			'</section>'].join(''),
		errortxt: [
			'<div class="MS-error">',
				'对不起，没有找到相应的内容<br>',
				'点击<a href="javascript:history.back()">此处</a>返回',
			'</div>'].join(''),
		oncebox: []
	};
	
	var Tool = {
		parseSearchJson: function(){
			var _search = location.search ,arr = _search.replace('?','').split('&') ,obj = {};
			for(var i = 0,len=arr.length;i<len;i++){
				var _a = arr[i].split('=');
				obj[_a[0]] = _a[1];
			}
			return obj;
		},
		//获取系统平台
		//主要区分ios和其他
		platform: function(){
			var iosReg = /(iphone)|(ipad)|(ipod)/gi , androidReg = /android/gi, useragent = navigator.userAgent.toLowerCase() , pl = 'other'
			if(iosReg.test(useragent)){
				pl = 'ios';
			}else if(androidReg.test(useragent)){
				pl = 'android';
			}
			return pl;
		},
		hasAnim: function(){
			var querys = this.parseSearchJson();
			//url 参数优先级较高
			if(querys.switchAnim == 'true'){
				return true;
			}else if(querys.switchAnim == 'false'){
				return false;
			}
			//平台检测，默认只有ios系统会自动开启slide动画
			return (this.platform() === 'ios');
		},
		addHistory: function(cfg){
			ENV.historybox.push(cfg);	
		},
		oppositeDir: function(dir){
			return (dir == 'back' || dir == 'none') ? 'forward' : 'back';
		}
	}; 
	
	//创建mslide类
	$.mslide = function(){
		this.dataspace = {};
		this.init.apply(this,arguments);
	};
	
	//原型
	$.mslide.prototype = {
		init:function(cfg){
			var self = this;
			self.isInit = true;
			self.buildParam(cfg).domHook().bindEvent();
			this.route = new Route({
				routes: {
					'': 'loadapp',
					':appath': 'loadapp',
					':appath/:param': 'loadapp'
				},
				loadapp: function(appath){
					self.loadapp(appath);
				}
			});
			this.route.start();
		},
		
		//构建参数
		buildParam: function(cfg){
			var hasParam = (typeof cfg !== 'undefined');
			cfg = {
				initPath: (hasParam && typeof cfg.initPath !== 'undefined') ? cfg.initPath : '',
				extendName: (hasParam && typeof cfg.extendName !== 'undefined') ? cfg.extendName : 'html'
			};
			for(var i in cfg){
				this[i] = cfg[i];
			}
			return this;
		},
		//缓存dom
		domHook: function(){
			var parentWrapper = this.parentWrapper = $('#MS');
			var wrapper = this.wrapper = parentWrapper.find('.MS-wrapper');
			return this;
		},
		//监听点击超链接
		bindEvent: function(){
			var self = this;
			$(document).on('click','a',function(e){
				var el = $(e.currentTarget);
				if(el.attr('dataRole') === 'inline'){
					e.preventDefault();
					var target = el.attr('href').replace(/\?.*$/gi,''), dir = el.attr('animDir') , param = el.attr('param');
					self.jumptrigger = el;
					self.jump(target,dir,param);
				}
			});
		},
		//页面跳转
		jump: function(path,dir,param){
			path = encodeURIComponent(path);
			var canJump = this.canJump(path) , paramstr = '';
			if(!canJump) return;
			Tool.addHistory({
				path: path,
				dir: dir
			});
			if(param !== null && typeof param !== 'undefined') paramstr = '/?' + param;
			if(location.hash === ''){
				location.href = location.href + '#' + path + paramstr;
			}else{
				location.href = decodeURIComponent(location.href).replace(decodeURIComponent(location.hash),'#' + path + paramstr);
			}
			
		},
		//是否可以执行跳转
		canJump: function(targetHash){
			targetHash = decodeURIComponent(targetHash);
			var obj = this._callbacks , events = { trigger: this.jumptrigger};
			//未绑定事件'jump:'+targetHash
			if(typeof obj === 'undefined') return true;
			var callbacks = obj['jump:' + targetHash + ':from:' + location.hash.replace('#','')];
			if(typeof callbacks === 'undefined') return true;
			return callbacks[callbacks.length - 2].call(this,events);
		},
		//隐藏浏览器导航栏
		//（ios系统有效）
		hideToolbar: function(){
				//app形式
				var wrapper = this.wrapper, nons = $('.MS-non') , h = 0;
				wrapper.height('5000px');
				for(var i = nons.length;i--;){
					h += nons.eq(i).height();
				}
				setTimeout(function(){
					window.scrollTo(0,0);
					wrapper.css({
						height: window.innerHeight - h + 'px'
					});
				},0);
				return this;
		},
		//获取应用模块，忽略网络状态
		getMojo: function(url){
			navigator.onLine ? this.async(url) : this.fetch(url);
			//this.fetch(url);
		},
		//恢复dom结构
		resetDom: function(){
			if(this.dir === 'forward'){
				$('.MS-pannel').eq(0).remove();
				this.wrapper.removeClass(this.forwardClass);
			}else if(this.dir === 'back'){
				$('.MS-pannel').eq(1).remove();
				this.wrapper.removeClass(this.backClass);
			}
		},
		//使用ajax请求异步请求html模板
		async: function(url){
			var self = this, hasDir = (self.dir !== 'none');
			var context = (hasDir ? this.context : $('.MS-pannel')) , t = new Date().getTime();
			$.ajax({
				url: decodeURIComponent(url) + '.' + self.extendName + '?t=' + t,
				context: context,
				success: function(o){
					self.manageStorage(decodeURIComponent(url) + '.' + self.extendName,t,o);
					if(hasDir){
						self.resetDom();
					}
					self.offall();
					this.html(o);
					self.hideToolbar();
				},
				error: function(){
					var errors = ENV.errortxt;
					if(hasDir){
						self.resetDom();
					}
					self.offall();
					this.html(errors);
				}
				
			});
		},
		//在offline情况下从本地存储中读取html模板文件
		fetch: function(url){	
			var hasDir = (this.dir !== 'none') , str = null;
			var context = (hasDir ? this.context : $('.MS-pannel'));
			for(var i=0,len=localStorage.length;i<len;i++){
				var key = localStorage.key(i);
				if(key.indexOf(decodeURIComponent(url) + '.' + this.extendName) >= 0){
					str = localStorage.getItem(key);
					break;
				}
			}
			if(hasDir){
				this.resetDom();
			}
			this.offall();
			context.html(str);
			this.hideToolbar();
		},
		//管理本地存储中的html模板
		manageStorage: function(url,t,o){
			for(var i=0,len=localStorage.length;i<len;i++){
				var key = localStorage.key(i);
				if(key.indexOf(url) >= 0){
					localStorage.removeItem(key);
					break;
				}
			}
			localStorage.setItem(location.host + '_' + url + '?t=' + t,o);
		},
		//确定slide的方向
		//包括点击进入和前段后退两种方式
		getSlideDir: function(appath){
			var dir = 'none';
			if(ENV.historybox.length > 0){
				//点击进入
				if(appath == ENV.historybox[ENV.historybox.length - 1].path){
					dir = ENV.historybox[ENV.historybox.length - 1].dir;
				}else{
					var oldpath = this.route.oldHash.replace(/\/.+/gi,'') , oldindex;
					//浏览器后退、前进
					for(var i = ENV.historybox.length;i--;){
						if(ENV.historybox[i].path == appath){
							for(var j = ENV.historybox.length;j--;){
								if(ENV.historybox[j].path == oldpath){
									oldindex = j;
									break;
								}
							}
							
							//浏览器后退
							if(oldindex > i){
								dir = Tool.oppositeDir(ENV.historybox[oldindex].dir);
							}else{
								//浏览器前进
								dir = ENV.historybox[i].dir;
							}
							break;
						}
					}					
				}
			}
			return dir;
		},
		//匹配hash后的回调方法
		loadapp: function(appath){
			//alert(appath)
			var self = this , url, wrapper = self.wrapper ,
				initPath = self.initPath , extendName = self.extendName , duration = self.duration,
				context = self.context = $(ENV.loading);
			url = (typeof appath === 'undefined') ? initPath : appath;
			if(Tool.hasAnim()){
				self.backClass = 'MS-anim-back';
				self.forwardClass = 'MS-anim-forward';
			}else{
				self.backClass = 'MS-back';
				self.forwardClass = 'MS-forward';
				duration = 0;
			}
			var dir = this.dir = this.getSlideDir(appath);
			if(dir === 'forward'){
				wrapper.append(context);
				wrapper.removeClass(self.backClass).addClass(self.forwardClass);
			}else if(dir === 'back'){
				$('.MS-pannel').before(context);
				wrapper.removeClass(self.forwardClass).addClass(self.backClass);
			}
			if(dir == 'none'){
				duration = 0;
			}
			if(this.isInit){
				Tool.addHistory({
					path: appath,
					dir: dir
				});
				this.isInit =false;
			}
			//debugger;
			setTimeout(function(){
				self.getMojo.call(self,url);
			},300);
		},
		//获取hash动态参数
		query: function(){
			return this.route.query();
		},
		//解除所有自定义事件绑定
		offall: function(){
			delete this._callbacks;
		},
		//绑定自定义事件，增加每个事件绑定的上下文标示，
		on: function(events, callback, context) {
			var obj = this._callbacks;
			this._on(events+':from:' + location.hash.replace('#',''),callback,context);
		},
		//绑定自定义事件
		_on: function(events, callback, context) {
			var calls, event, list;
			if (!callback) return this;
			events = events.split(this.eventSplitter);
			calls = this._callbacks || (this._callbacks = {});
			while (event = events.shift()) {
				list = calls[event] || (calls[event] = []);
				list.push(callback, context);
			}
			return this;
		},
		//解除自定义事件
		off: function(events, callback, context) {
			var event, calls, list, i;
			if (!(calls = this._callbacks)) return this;
			if (!(events || callback || context)) {
				delete this._callbacks;
				return this;
			}
			events = events ? events.split(this.eventSplitter) : _.keys(calls);
			while (event = events.shift()) {
				if (!(list = calls[event]) || !(callback || context)) {
					delete calls[event];
					continue;
				}
				for (i = list.length - 2; i >= 0; i -= 2) {
					if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
						list.splice(i, 2);
					}
				}
			}
			return this;
		},
		//触发自定义事件
		fire: function(events){
			var event, calls, list, i, length, args, all, rest;
			if (!(calls = this._callbacks)) return this;
			rest = [];
			events = events.split(this.eventSplitter);
			for (i = 1, length = arguments.length; i < length; i++) {
				rest[i - 1] = arguments[i];
			}
			while(event = events.shift()){
				if(all = calls.all) all = all.slice();
				if(list = calls[event]) list = list.slice();
				if(list){
					for (i = 0, length = list.length; i < length; i += 2) {
						list[i].apply(list[i + 1] || this, rest);
					}
				}
				if(all){
					args = [event].concat(rest);
					for(i = 0, length = all.length; i < length; i += 2) {
						all[i].apply(all[i + 1] || this, args);
					}
				}
			}
			return this;
		},
		//在浏览器一个生命周期内，在当前视图仅执行以此回调
		//注意：app.html?nbet/?lotype=ssq  和 app.html?nbet/?lotype=dlt
		//虽然调取同一个模板文件nbet，在这里实际上是两个独立的视图
		once: function(fn){
			var sign = location.hash.replace('#','') + fn.toString();
			for(var i= ENV.oncebox.length;i--;){
				if(ENV.oncebox[i] === sign) return;
			}
			fn.call(this);
			ENV.oncebox.push(sign);
  		}
		
	};

}(Zepto));
