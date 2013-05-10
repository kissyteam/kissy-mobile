/**
 * @file index.js
 * @brief 
 * @author jayli, bachi@taobao.com
 * @version 
 * @date 2012-12-18
 */

/*jshint smarttabs:true,browser:true,devel:true,sub:true,evil:true */

KISSY.add("mobile/app/1.0/index", function (S,Slide) {

	// Jayli TODO: Android下未完全测试

	"use strict";

	var his = window.history;

	function MS(cfg) {
		if (this instanceof MS) {

			MS.superclass.constructor.call(this, cfg);
			this.init();

		} else {
			return new MS(cfg);
		}
	}

	// MS.ATTR
	MS.ATTRS = {
		viewpath: {
			value: 'index.html',
			setter: function(v){
				return decodeURIComponent(v);
			}
		},
		forceReload:{ // 切换时（不论前进后退），都进行重新加载
			value: true 
		},
		page:{
			value: null
		},
		direction:{
			value: 'none'  // none,next,prev
		},
		anim:{
			value: true
		},
		dataload:{
			value: 'true'
		},
		param:{ // 临时参数对象，页面之间相互传参用
			value: null 
		},
		pageCache:{
			value:false // 加载过的page是否保存到本地，默认不保存
		},
		tapTrigger:{
			value:'a'
		},
		animWrapperAutoHeightSetting: {
			value:true
		},
		containerHeighTimmer: {
			value:true
		},
		basepath:{
			value:window.location.protocol + '//' + window.location.hostname +
					window.location.pathname.replace(/\/[^\/]+$/i,'').replace(/\/$/,'') + '/',
			setter:function(v){
				if(/\/$/.test(v)){
					return v;
				} else {
					return v + '/';
				}
			}
		},
		initPostData:{
			value:null
		},
		// 当前访问记录
		signet:{
			value:{
				level:0,
				viewpath:'',
				hisurl:'',
				lastviewpath:'', // 上一个view地址
				forward:0, // 前进距离，1，前进，-1，后退，0，无状态
				scrollTop:0 // 用来记录当前页面离开时的滚动条位置
			}
		},
		fullRangeWidth:{
			value:function(){
				return document.body.offsetWidth;
			}
		},
		webkitOptimize:{
			value:true
		},
		positionMemory:{
			value:true
		}
		
	};

	// 全局静态方法
	S.mix(MS,{
		READY:{},// 专场动画完成后，页面的执行函数，一个页面一个，类似Domready
		STARTUP:{},// 来到页面时的启动函数，一个页面多个
		TEARDOWN:{},// 离开页面时的清理函数，一个页面多个
		INCLUDEONCE:{},// 该页面首次加载时执行一次，一个页面多个
		DESTROY:{},// 该页面被销毁时执行一次
		PAGECACHE:{},//每个页面的镜像字符串，保存在这里
		PAGESCROLL:{},//每个页面离开时的scrollTop高度
		STORAGE:{},//每个页面对应的本地存储
		APP:null,//全局的APP引用，默认指向最新创建的
		// Android 4.3以下不支持 History，临时变量存储Android下的历史记录，只能作简单的前进后退动画
		// 这里的实现不完全，比如a->b->c<-a后，节点为a->b->a，这时需要手动清空MS.AndroidHis = {};
		// Android 4.3以下的后退时scrollTop复原的操作，需要开发者自行添加（框架不知道是否是后退还是人为）
		// TODO: 完全模拟History?
		AndroidHis:{
			/*
			 'mb/a.html':null,
			 'mb/b.html':null,
			 'mb/c.html':1 // 1 表明是最新的一个
			 ...
			 **/
		},
		includeOnce:function(cb){
			if(!MS.APP.slide){
				cb.call(this.APP);
			}else {
				var k = this.APP.get('viewpath');
				if(!S.isFunction(this.INCLUDEONCE[k])){
					this.INCLUDEONCE[k] = cb;
					cb.call(this.APP,this.APP);
				}
			}
		},
		destroy:function(cb){
			var k = this.APP.get('viewpath');
			if(!S.isFunction(this.DESTROY[k])){
				this.DESTROY[k] = cb;
			}
		},
		startup:function(cb){
			// 单页面
			if(!MS.APP.slide){
				cb.call(MS.APP);
			}else {
				var k = this.APP.get('viewpath');
				/*
				if(!S.isFunction(this.STARTUP[k])){
					this.STARTUP[k] = cb;
				}
				*/
				this.STARTUP[k].push(cb);
			}
		},
		ready:function(cb){
			if(!MS.APP.slide){
				cb.call(this.APP);
			}else {
				var k = this.APP.get('viewpath');
				/*
				if(!S.isFunction(this.READY[k])){
					this.READY[k] = cb;
				}
				*/
				this.READY[k].push(cb);
			}
		},
		teardown:function(cb){
			if(!MS.APP.slide){
				cb.call(this.APP);
			}else{
				var k = this.APP.get('viewpath');
				/*
				if(!S.isFunction(this.TEARDOWN[k])){
					this.TEARDOWN[k] = cb;
				}
				*/
				this.TEARDOWN[k].push(cb);
			}
		},
		// 清空当前view的startup,ready,teardown
		cleanup:function(){
			var k = this.APP.get('viewpath');
			this.STARTUP[k] = [];
			this.READY[k] = [];
			this.TEARDOWN[k] = [];
		}
	});

	S.extend(MS, S.Base, {

		init: function() {
			var self = this;
			MS.APP = self;
			self.MS = self.constructor;

			if(S.one("#MS")){
				if(S.UA.opera && S.UA.opera > 0){
					self.set('animWrapperAutoHeightSetting',true);
				}

				self.slide = new Slide('MS',{
					autoSlide:false,
					effect:self.get('anim')?'hSlide':'none',
					touchmove:false,
					adaptive_fixed_width:true,
					contentClass:'MS-con',
					speed:450,
					pannelClass:'MS-pal',
					animWrapperAutoHeightSetting:self.get('animWrapperAutoHeightSetting'),//不需要自动修正wrapper的高度
					webkitOptimize:self.get('webkitOptimize'),
					adaptive_width:self.get('fullRangeWidth')
				});


				self.positionTimmer = null;

				if(self.get('containerHeighTimmer')){
					self.slide.addHeightTimmer();
				}

				self.bindEvent();
				self.initLoad();
			} else {
				self.set('page',S.one('body'));
			}
			self.initPageStorage();
			self.set('storage',self.MS.STORAGE[self.get('viewpath')]||{});

			return this;
		},
		callDestroy:function(){
			var self = this;
			var lastviewpath = self.get('signet').lastviewpath;
			var cb = self.MS.DESTROY[lastviewpath];
			if(S.isFunction(cb)){
				cb.call(self,self);
			}
			return this;
		},
		initPageStorage:function(){
			var self = this;
			var k = self.get('viewpath');
			if(!S.isObject(this.MS.STORAGE[k])){
				var myClass = function(){};
				S.augment(myClass,S.Base.Attribute,S.EventTarget);
				this.MS.STORAGE[k] = new myClass();
			}

		},
		callReady:function(path){
			var self = this;
			if(S.isUndefined(path)){
				path = self.get('viewpath');
			}
			var cb = self.MS.READY[path];
			var param = self.get('param');

			if(S.isArray(cb)){
				S.each(cb,function(v,k){
					setTimeout(function(){
						v.call(self,param);
					},200);
				});
			}

			if(S.isFunction(cb)){
				setTimeout(function(){
					cb.call(self);
				},200);
			}
			return this;
		},
		callStartup:function(path){
			var self = this;
			if(S.isUndefined(path)){
				path = self.get('viewpath');
			}
			var cb = self.MS.STARTUP[path];

			var param = self.get('param');
			// 取到参数后立即清空，防止其他页面也会拿到这个参数
			self.set('param',null); 

			self.set('storage',self.MS.STORAGE[path] || {});

			if(S.isArray(cb)){
				S.each(cb,function(v,k){
					v.call(self,param);
				});
			}

			if(S.isFunction(cb)){
				cb.call(self,param);
			}

			return this;
		},
		// teardown的时候应当恢复调用之前的hash
		callTeardown:function(path){
			var self = this;
			if(S.isUndefined(path)){
				path = self.get('viewpath');
			}
			if(path === ''){
				return;	
			}
			var cb = self.MS.TEARDOWN[path];
			self.rememberPosition(path);

			if(S.isArray(cb)){
				S.each(cb,function(v,k){
					setTimeout(function(){
						v.call(self,self);
					},0);
				});
			}

			if(S.isFunction(cb)){
				// TODO 这里的设计有点问题，理论上teardown事件不应当被阻止,类似onload和domready等
				return cb.call(self,self); 
			}
			return true;
		},
		// 记住当前viewport的scrollTop高度(以便恢复)
		rememberPosition:function(path){
			// TODO: 在Firefox中，当点击浏览器前进按钮时，首先触发hashchange，页面复位至顶部
			// 再执行teardown，再执行到这里，得到的scrollTop始终是0，如何解决
			var self = this;
			self.MS.PAGESCROLL[path] = S.DOM.scrollTop();
		},
		// 恢复之前的高度
		// TODO: Opera Mini 中recall操作失效，scrollTo()方法跳入到的位置不准确，待解决
		recallPosition:function(){
			var self = this;
			if(!self.get('positionMemory')){
				return;
			}
			var vp = self.get('viewpath');
			var scrollTop = self.MS.PAGESCROLL[vp];
			if(scrollTop){
				// window.scrollTo(0,scrollTop);
				if(S.DOM.scrollTop() === 0){
					setTimeout(function(){
						S.Anim(window,{
							scrollTop:scrollTop
						},0.5,'easeBoth',function(){

						}).run();
					},200);
				}
			}
		},
		initLoad:function(){
			var self = this;

			if(!S.isUndefined(S.getHash()['viewpath'])){
				self.set('viewpath',(S.getHash()['viewpath']));
			}

			if(!S.isNull(self.get('initPostData'))){
				self.__post = self.get('initPostData');
			}

			self._go(self.get('viewpath'),'none');

			var hisurl = self.formatUrlTail(self.get('viewpath'),S.getHash());

			var state = {
				level:0,
				viewpath:self.get('viewpath'),
				hisurl:hisurl,
				forward:0,
				lastviewpath:'',
				scrollTop:S.DOM.scrollTop()
			};

			self.set('signet',state);
			his.replaceState(state,"",hisurl);

			self.set('viewpath',(S.getHash()['viewpath']));

		},
		// 此方法暂时废弃
		rollback:function(){
			var self = this;

			var hisurl = self.formatUrlTail(self.get('viewpath'),S.getHash());

			var state = {
				level:0,
				viewpath:self.get('viewpath'),
				hisurl:hisurl,
				forward:0,
				lastviewpath:'',
				scrollTop:S.DOM.scrollTop()
			};

			self.set('signet',state);
			his.replaceState(state,"",hisurl);

			self.set('viewpath',(S.getHash()['viewpath']));

		},
		// 调用Loading
		loading:function(){
			var self = this;
			var loading = S.one('#MS-loading');

			var loadingHtml = [
					'<div id="MS-loading" style="display:none">',
					'<img src="http://img04.taobaocdn.com/tps/i4/T1aIsKXmReXXa679Pe-40-40.gif" />',
					'</div>'
				].join('');

			loading = loading ? loading:
				S.Node(loadingHtml).appendTo('body');

			loading.one('img').css({
				'margin-top':'5px'
			});
			loading.css({
				display:'none',
				position:'fixed',
				height:'50px',
				width:'50px',
				top:'50%',
				left:'50%',
				'margin-top':'-25px',
				'margin-left':'-25px',
				'border-radius':'6px',
				'text-align':'center',
				'background-color':'white',
				opacity:0.7
			});

			// 如果加载太快，少于350毫秒，则不显示loading
			// 加载的慢才显示loading
			self.loadingTimer = setTimeout(function(){
				loading.css({
					display:'block'	
				});
				self.loadingTimer = null;
			},350);

			return self;

		},
		// 关闭 loading 层
		closeLoading:function(){
			var self = this;

			if(self.loadingTimer){
				clearTimeout(self.loadingTimer);
			}
			
			var loading = S.one('#MS-loading');

			if(loading){
				loading.css({
					display:'none'	
				});
			}
			
			return self;
		},
		// http://a.b.cn/path/to/file.do?search#hash => file.do?search
		getUrlPrefix:function(){
			var self = this;
			var loc = window.location;
			var t = loc.pathname.replace(/\/.+\//i,'').replace('/','') + loc.search;
			return t;
		},
		// path:a.html  param:  a=1&b=2&c=3,param可以是对象
		// return:  urlprefix?abc#viewpath=a.html&a=1&b=2&c=3 
		formatUrlTail:function(path,param){
			var self = this;

			if(S.isUndefined(param)){
				param = '';
			}
			if(S.isString(param)){
				param = S.unparam(param);
			}

			var url = S.setHash(S.merge(param,{
				viewpath:encodeURIComponent(path)
			}));

			return self.getUrlPrefix() + url.replace(/^.+#/i,'#');

		},

		// 点击a标签时，意欲发生跳转时，只应当调用这个方法
		setRouteHash:function(path,param){
			var self = this;

			self.set('viewpath',(path));

			if(S.isUndefined(param)){
				param = '';
			}

			if(S.isString(param)){
				param = S.unparam(param);
			}

			var hisurl = self.formatUrlTail(path,S.getHash());

			var state = {
				level:self.get('signet').level + 1,
				viewpath:path,
				hisurl:S.setHash(decodeURIComponent(hisurl),param),
				forward:1,
				lastviewpath:path,
				scrollTop:S.DOM.scrollTop()  // 暂时无用
			};

			var lo = window.location;

			var newpath = lo.protocol + '//' + lo.hostname + lo.pathname + lo.search;
			
			newpath = S.setHash(newpath,S.merge({
				viewpath:encodeURIComponent(path)
			},param));

			if(S.UA.android && S.UA.android < 4.3){
				window.location.href = newpath;
			} else {
				self.doHashChange(path,param);
				his.replaceState(state,"",newpath);
			}
			// his.replaceState(state,"",S.setHash(hisurl,param));

		},

		// pushState方法不会触发hashchange
		// 因此需要手动触发一下Hashchange
		doHashChange:function(viewpath,param){
			var self = this;
			var ou = S.setHash(S.merge({
				stamp:S.now(),
				viewpath:encodeURIComponent(viewpath)
			},param));
			var hash = ou.match(/#.*$/i)[0];
			window.location.hash = hash;
		},

		bindEvent:function(){
			var self = this;

			// TODO 在pad里，tap有时会发生页面跳转
			var triggerType = S.UA.mobile? 'click':'click';

			if(S.UA.android && S.UA.android < 4.3){
				var vp = S.getHash()['viewpath'] ?  S.getHash()['viewpath'] : self.get('viewpath');
				self.MS.AndroidHis[vp] = 1;
			}


			// 写状态
			// 只有两种途径可以写状态，1，点击链接更改hash，2，history操作更改hash
			self.slide.con.delegate(triggerType,self.get('tapTrigger'),function(e){
				var el = S.one(e.currentTarget);
				if((
						!S.isUndefined(el.attr('target')) && el.attr('target') !== '' ) || 
							/^javascript:/i.test(el.attr('href'))){

					if(el.attr('target') == 'top'){
						window.location.href=el.attr('href');
						e.preventDefault();
					}

					return true;

					// 如果链接有target，则为默认行为
				} else {
					self.__clickEvent = true;
					var path = el.attr('href');
					var param = el.attr('data-param');
					if(path === ''){
						return true;
					}
					self.setRouteHash(path,param);
					e.preventDefault();
					// self.next(path);
				}
				
			});

			S.Event.on(window,'hashchange',function(e){

				// 当前时刻（hash变化后，触发行为之前），不管何种状态，只有signet（印记）是旧的
				var state = self.get('signet');
				var level = 0;
				var viewpath = decodeURIComponent(S.getHash()['viewpath']);

				self.set('viewpath',viewpath);

				// 判断是否从普通点a标签击事件触发hashchange
				var clicked = false;
				if(self.__clickEvent && self.__clickEvent === true){
					clicked = true;
				}else{
					clicked = false;
				}
				delete self.__clickEvent;

				if(S.isUndefined(viewpath)){
					return;
				}

				var hisurl = self.formatUrlTail(viewpath,S.getHash());

				/*
				S.log('===========forward===============');
				S.log(self.get('signet').forward);
				S.log(his.state.forward);
				S.log(self.get('signet').level);
				S.log(his.state.level);
				S.log('==========================');
				*/

				// http://code.google.com/p/android/issues/detail?id=23979
				// android 4.3 及以下不支持History

				if(S.UA.android && S.UA.android < 4.3){
					self._androidHistoryMan(clicked);
				}else if(S.isUndefined(his.state) || S.isUndefined(his.state.level)){
					// 从零加载第一帧
					self._go(viewpath,'none');
					self.recordSignet(0,viewpath);

				}else if(self.get('signet').forward === 0 && his.state.forward > 0 ){
					// 后退到开始帧，前进到下一帧时
					self.next(viewpath);
					self.recordSignet(1,viewpath);
				}else if(his.state.level > state.level){
					// 普通的帧进入
					// 由hashchange带动的进入行为不需写history
					if(self.get('signet').forward > 0 && his.state.forward < 0){
						self.prev(viewpath);
						self.recordSignet(1,viewpath,-1);
					} else {
						self.next(viewpath);
						self.recordSignet(1,viewpath);
					}

				}else if(self.get('signet').forward > 0 && his.state.forward < 0){
					// 如果back，上一帧态为“进入” 时
					self.prev();
					self.recordSignet(-1,viewpath,his.state.forward);

				}else if(self.get('signet').forward < 0 && his.state.forward > 0){
					// 如果上一帧在本帧右侧，回退时采用“进入”动作，但进入后要删除倒数第二帧
					self.next(viewpath,function(){
						self.callDestroy();
						self.slide.remove(self.slide.length - 2);
					});
					self.recordSignet(-1,viewpath,his.state.forward);
					
				}else{
					// 自然退出行为（无装载）

					self.prev(function(){
						self.recallPosition();
					});
					self.recordSignet(-1,viewpath,his.state.forward);
				}

				// self._go(route.viewpath,route.direction);

				/*
				if(route.dataload !== 'true'){

				}
				*/
			});

		},
		// 处理当前view访问记录是否增加还是减少
		// 此函数不会操作历史记录
		// forward:当前面板的动作方向，1 进入，-1 退出，默认为1
		// 在操作过后调用
		recordSignet:function(index,path,forward){
			var self = this;

			if(S.isUndefined(index)){
				index = 0;
				path = S.getHash()['viewpath'];
				forward = 1;
			}

			if(S.isUndefined(path)){
				path = S.getHash()['viewpath'];
				forward = 1;
			}

			if(S.isUndefined(forward)){
				forward = 1;
			}

			var olevel = self.get('signet').level;
			var hisurl = self.formatUrlTail(path,S.getHash());

			var state = {
				level:olevel + index,
				viewpath:path,
				hisurl:hisurl,
				forward:forward,
				lastviewpath:self.get('signet').viewpath,
				scrollTop:S.DOM.scrollTop()
			};

			self.set('signet',state);

			return state;

		},

		// TODO: MS实例的销毁
		destroy: function(){

		},
		_go :function(path,type,callback){
			var self = this;

			if(self.callTeardown(self.get('signet').viewpath) === false){
				self.rollback();
				return this;
			}

			if(S.isUndefined(type)){
				type = 'next';
				callback = function(){};
			}
			if(S.isFunction(type)){
				callback = type;
				type = 'next';
			}
			if(S.isUndefined(callback)){
				callback = function(){};
			}

			// self.slide.removeHeightTimmer();

			self.loadData(path,type,callback);
			/*
			window.history.pushState({

			},"page 3",path);
			*/
		},

		/*
			{
				path:undefined
				data:undefined
				callback:undefined
			}
		 
		 */
		postback: function(o){
			var self = this;
			self.__post = o.data;
			if(S.isString(o.path)){
				self.back(o.path,o.data,o.callback);
			}else{
				self.back(o.data,o.callback);
			}
		},

		// 参数格式同上
		postforward: function(o){
			var self = this;
			self.__post = o.data;
			if(S.isString(o.path)){
				self.forward(o.path,o.data,o.callback);
			}else{
				self.forward(o.data,o.callback);
			}
		},

		// param 只能是对象
		// type 可以是post，也可以是get，默认是get
		back: function(path,param,callback){
			var self = this;

			// back(path)
			// back(path,callback)
			// back(path,param)
			// back(param)
			// back(path,param,callback)

			if(S.isUndefined(path)){
				path = undefined;
				param = {};
				callback = function(){};
			}
				
			if(S.isUndefined(param)){
				param = {};
				callback = function(){};
			}

			if(S.isFunction(param)){
				callback = param;
				param = {};
			}

			if(S.isObject(path)){
				param = path;
				callback = function(){};
				path = undefined;
			}

			if(S.isObject(param) && S.isUndefined(callback)){
				callback = function(){};
			}

			if(S.isString(param)){
				param = S.unparam(param);
			}

			if(S.isString(path)){
				path = encodeURIComponent(path);
			}

			// 保存临时参量
			self.set('param',S.merge(param,{
				from:self.get('signet').viewpath
			}));

			// 如果后退到新页面,历史记录加1
			if(S.isString(path)){
				/*
				S.log('===========forward===============');
				S.log(self.get('signet').forward);
				*/
				/*
				if(S.UA.android && S.UA.android < 4.3){
					self._androidHistoryMan(path);
				}
				*/
				self.prev.apply(self,[path,param,callback]);
				var state = self.recordSignet(1,path,-1);
				his.pushState(state,"",S.setHash(state.hisurl,param));
				/*
				S.log(his.state.forward);
				S.log('==========================');
				*/
			}else{
				// 否则 控制历史记录
				his.back();
			}

			self.set('viewpath',(S.getHash()['viewpath']));

			return this;
		},


		// 前进时需要给定path
		forward: function(path,param,callback){
			var self = this;

			// forward(path)
			// forward(path,callback)
			// forward(path,param)
			// forward(path,param,callback)
			
			if(S.isUndefined(param)){
				param = {};
				callback = function(){};
			}

			if(S.isFunction(param)){
				callback = param;
				param = {};
			}

			if(S.isObject(param) && S.isUndefined(callback)){
				callback = function(){};
			}

			if(S.isString(param)){
				param = S.unparam(param);
			}

			self.set('param',S.merge(param,{
				from:self.get('signet').viewpath
			}));

			/*
			if(S.UA.android && S.UA.android < 4.3){
				self._androidHistoryMan();
			}
			*/
			path = encodeURIComponent(path);
			self.next.apply(self,[path,param,callback]);

			var state = self.recordSignet(1,path);
			his.pushState(state,"",S.setHash(state.hisurl,param));
			self.set('viewpath',S.getHash()['viewpath']);
			return self;
		},

		// 在不支持H5 HIstory 的设备中，使用此方法记录简单的前进后退
		// clicked: true,通过发生click事件进入的操作，则总是执行进入
		_androidHistoryMan : function(clicked,viewpath){
			var self = this;

			if(S.isUndefined(viewpath)){
				viewpath = self.get('viewpath');
			}

			if(clicked || !(viewpath in self.MS.AndroidHis)){
				// Android 进入操作
				self.next(viewpath);
				self.recordSignet(1,viewpath);
			}else{
				// Android 后退操作
				self.prev(viewpath,function(){
					self.recallPosition();
				});
				self.recordSignet(1,viewpath,-1);
				for(var i in self.MS.AndroidHis){
					if(self.MS.AndroidHis[i] == 1){
						delete self.MS.AndroidHis[i];
					}
				}

			}

			for(var j in self.MS.AndroidHis){
				self.MS.AndroidHis[j] = null;
			}

			self.MS.AndroidHis[viewpath] = 1;

		},

		// next 和 prev 是私有方法，只做切换,不处理history
		next:function(path,callback){
			var self = this;

			if(S.isFunction(path)){
				callback = path;
				path = undefined;
			}

			if(S.isUndefined(callback)){
				callback = function(){};
			}

			if(S.isUndefined(path)){
				if(self.callTeardown(self.get('signet').viewpath) === false){
					self.rollback();
					return this;
				}
				self.slide.removeHeightTimmer();
				if(self.get('animWrapperAutoHeightSetting')){
					window.scrollTo(0,0);
				}
				self.slide.next(function(){
					if(self.get('containerHeighTimmer')){
						self.slide.addHeightTimmer();
					}
					if(S.isFunction(callback)){
						callback.call(self.slide,self.slide);
					}
					if(self.get('forceReload')){
						self.slide.remove(self.slide.length - 2);
					}
					setTimeout(function(){
						self.callReady();
					},0);
				});
				self.set('page',self.slide.getCurrentPannel());
				setTimeout(function(){
					self.callStartup();
				},0);
			}else{
				self._go(path,'next',callback);
			}
		},


		// 传入path就可以装载数据
		prev: function(path,callback){
			var self = this;

			if(S.isFunction(path)){
				callback = path;
				path = undefined;
			}

			if(S.isUndefined(callback)){
				callback = function(){};
			}

			if(!S.isString(path) && self.get('forceReload')){
				path = self.get('viewpath');
			}

			if(S.isUndefined(path)){
				if(self.callTeardown(self.get('signet').viewpath) === false){
					self.rollback();
					return this;
				}
				self.slide.removeHeightTimmer();
				self.slide.previous(function(){
					var that = this;
					if(self.get('containerHeighTimmer')){
						self.slide.addHeightTimmer();
					}
					self.callDestroy();
					that.removeLast();
					if(S.isFunction(callback)){
						callback.call(self.slide,self.slide);
					}
					setTimeout(function(){
						self.callReady();
					},0);
				});
				self.set('page',self.slide.getCurrentPannel());
				setTimeout(function(){
					self.callStartup();
				},0);
			}else{
				self._go(path,'prev',callback);

				/*
				var state = self.get('signet');
				var hisurl = self.formatUrlTail(viewpath,S.getHash());
				level = state.level - 1;
				self.set('signet',{
					level:level,
					viewpath:path,
					hisurl:hisurl
				});
				*/
				// TODO 手动调用装载上一帧时写hash
			}

			// window.history.back();
		},
		getAjaxPath:function(path){
			var self = this;
			return self.get('basepath') + path;
		},
		loadData:function(path,type,callback){
			var self = this;
			if(S.isUndefined(type)){
				type = 'next';
				callback = function(){};
			}
			if(S.isFunction(type)){
				callback = type;
				type = 'next';
			}
			if(S.isUndefined(callback)){
				callback = function(){};
			}

			var renderPage = function(html){

				self.closeLoading();

				var prel = self.get('page');
				var el = S.Node('<div class="MS-pal">'+html+'</div>');
				//向前
				self.set('page',el);
				switch(type){
				case 'prev':
					self.slide.add(el,self.slide.currentTab);
					self.slide.relocateCurrentTab(self.slide.currentTab + 1);
					self.MS.cleanup();
					S.execScript(html);
					// TODO: 重新考虑，是否在prev动画执行完成之后调用initPageStorage和callStartup
					// TODO：切换之前作执行，有何风险
					setTimeout(function(){
						self.initPageStorage();
						self.callStartup();
					},0);
					setTimeout(function(){
						self.slide.removeHeightTimmer();
						self.slide.previous(function(){
							var that = this;
							if(self.get('containerHeighTimmer')){
								self.slide.addHeightTimmer();
							}
							self.callDestroy();
							if(S.isFunction(callback)){
								callback.call(self.slide,self.slide);
							}
							setTimeout(function(){
								self.callReady();
							},0);
							that.removeLast();
						});
					},150);
					break;
				case 'next':
					// TODO: 只有异步加载新页面时，才会修正进入view的marginTop
					self._fixScrollTopBefore(el,prel);
					self.slide.add(el);
					self.MS.cleanup();
					S.execScript(html);
					setTimeout(function(){
						self.initPageStorage();
						self.callStartup();
					},0);
					setTimeout(function(){
						self.slide.removeHeightTimmer();
						if(self.get('animWrapperAutoHeightSetting')){
							window.scrollTo(0,0);
						}
						self.slide.next(function(){
							// TODO: Android 2 下这里不执行？
							self.callDestroy();
							if(S.isFunction(callback)){
								callback.call(self.slide,self.slide);
							}
							if(self.get('forceReload')){
								self.slide.remove(self.slide.length - 2);
							}
							setTimeout(function(){
								self.callReady();
							},0);
							self._fixScrollTopAfter(el,prel);
						});
					},150);

					break;
				case 'none':
					self.slide.add(el,self.slide.currentTab);
					self.callDestroy();
					self.MS.cleanup();
					S.execScript(html);
					setTimeout(function(){
						self.initPageStorage();
						self.callStartup();
					},0);
					callback.call(self.slide,self.slide);
					setTimeout(function(){
						self.callReady();
					},0);
					self.slide.removeLast();
					// self.slide.next(callback);
					break;
				}

			};

			var handleHTML = function(str){
				str = str.replace(/\r/mig,'$123').replace(/\n/g,'$456').replace(/.*<!--kdk{{-->/i,'').replace(/<!--kdk}}-->.*$/i,'');
				str = str.replace(/\$123/g,'\r').replace(/\$456/g,'\n');
				self.MS.PAGECACHE[path] = str;
				renderPage(str);
			};

			var fullpath = self.getAjaxPath(decodeURIComponent(path));

			self.loading();

			if(self.__post){
				S.io.post(fullpath,self.__post,handleHTML);
				delete self.__post;
			}else if(self.get('pageCache') && !S.isUndefined(self.MS.PAGECACHE[path])){
				renderPage(self.MS.PAGECACHE[path]);
			}else {
				S.io.get(fullpath,handleHTML);
			}

		},
		// 切换前，修正新节点切换高度
		_fixScrollTopBefore: function(el,prel){
			var self = this;
			if(self.get('animWrapperAutoHeightSetting')){
				return;
			}
			var scrollTop = S.DOM.scrollTop();
			el.css({
				'margin-top':scrollTop+'px'
			});
		},
		// 切换后，修正新节点高度，使高度复位
		_fixScrollTopAfter: function(el,prel){
			var self = this;
			if(self.get('animWrapperAutoHeightSetting')){
				return;
			}

			var p = el.parent();

			var doReset = function(){
				el.css({
					'position':'absolute',
					top:0
				}).css({
					'margin-top':0,
					'position':'relative',
					'-webkit-backface-visibility':false,
					'left':0
				}).appendTo(p);

				if(self.get('containerHeighTimmer')){
					self.slide.addHeightTimmer();
				}
			};

			// Info: 必须将子节点挂载到body下，position:fixed 才起作用,不知道原因
			el.appendTo('body').css({
				'margin-top':0,
				'position':'fixed',
				'top':0,
				'-webkit-backface-visibility':false,
				'left':self.slide.con.offset().left + 'px'
			});

			// 使用动画来规避瞬间css赋值带来的闪屏
			
			if(S.UA.opera && S.UA.opera > 0){
				// Opera 的判断代码废弃
				window.scrollTo(0,0);
				doReset();
			}else{
				// 对于支持position:fixed的环境
				S.Anim(window,{
					scrollTop:0
				},0.1,'easeNone',function(){
					doReset();
				}).run();
			}
		}
	});

	//Util.init();

	return MS;

}, {
	requires: [
		'./slide',
		'base',
		'ajax'
	]
});

/*jshint browser:true,devel:true */

KISSY.add('mobile/app/1.0/kissy2yui',function(S){

	"use strict";

	// KISSY 2 YUI3
	S.augment(S.Node,{

		_delegate:function(){
			var self = this;
			if(S.isFunction(arguments[1])){
				self.delegate(arguments[0],arguments[2],arguments[1]);
			}else {
				self.delegate.apply(self,arguments);
			}
			return self;
		},

		// IndexOf 原生节点
		indexOf : function(node){
			var self = this;
			if(S.isUndefined(node)){
				return null;
			}
			if(node[0]){
				node = node[0];
			}
			var i = 0;
			self.each(function(el,index){
				if(el[0] === node){
					i = index;
				}
			});
			return i;

		},
		
		size:function(){
			return this.length;
		},

		set:function(k,v){
			if(k === 'innerHTML') {
				this.html(v);
			} else {
				this.attr(k,v);
			}
			return this;
		},

		get : function(k){
			var self = this;
			var o = {
				'innerHTML':function(){
					return self.html();
				},
				'region':function(){
					return {
						'height':self.height(),
						'width':self.width()
					};
				}

			};
			if(k in o){
				return o[k]();
			}
		},

		appendChild:function(){
			this.append.apply(this,arguments);
			return this;
		},
		
		setStyle : function(k,v){
			this.css.apply(this,arguments);
			return this;
		},
		
		setStyles: function(o){
			this.css.apply(this,arguments);
			return this;
		},

		cloneNode: function(){
			return this.clone.apply(this,arguments);
		}
	});

	S.Node.create = function(str){
		return S.Node(str);
	};

},{
	requires:['node','event']
});

/**
 * @file base.js
 * @brief Slide
 * @author jayli, bachi@taobao.com
 * @version 
 * @date 2013-01-08
 */

/*jshint smarttabs:true,browser:true,devel:true,sub:true,evil:true */

KISSY.add("mobile/app/1.0/slide",function(S){

	"use strict";

	// $ is $
	var $ = S.Node.all;

	// BSlide构造器
	// TODO BSlide工厂
	var BSlide = function(){
		
		// TODO 如何传参?
		if (!(this instanceof BSlide)) {
			throw new Error('please use "new Slide()"');
		}

		this.init.apply(this,arguments);
	};

	// TODO 抽离切换“机制”和实现的方法
	BSlide.plug = function(fn){

	};

	// 扩充BSlide
	S.augment(BSlide,S.Event.Target,{

		// 构造函数
		init:function(selector,config){

			var self = this;

			if(S.isObject(selector)){
				self.con = selector;
			}else if(/^#/i.test(selector)){
				self.con = S.one(selector);
			}else if(S.one("#"+selector)){
				self.con = S.one("#"+selector);
			}else if(S.one(selector)){
				self.con = S.one(selector);
			}else {
				throw new Error('Slide Container Hooker not found');
			}
			//接受参数
			self.buildParam(config);
			//构建事件中心,YUI3需要另外创建事件中心
			// self.buildEventCenter();
			//构造函数
			self.buildHTML();
			//绑定事件
			self.bindEvent();
			
			// TODO:这句话永远无法触发ready事件
			self.fire('ready',{
				index:0,
				navnode:self.tabs.item(0),
				pannelnode:self.pannels.item(0)
			});

			if(self.reverse){
				var _t ;
				_t = self.previous;
				self.previous = self.next;
				self.next = _t;
			}

			// 在移动终端中的优化
			if(self.carousel){
				for(var i = 0;i<self.colspan;i++){
					self.fix_for_transition_when_carousel(i*2);
				}
			}

			self.fixSlideSize();

			// LayerSlide 效果增强
			if(self.layerSlide){
				self.initLayer();
			}

			return this;
		},

		// offset 1,-1
		setWrapperSize:function(offset){
			var self = this;


			if(S.isUndefined(offset)){
				offset = 0;
			}

			self.pannels = self.con.all('.' + self.contentClass + ' div.' + self.pannelClass);
			self.length = self.pannels.length;

			var reHandleSize = {
				'none':function(){
				},
				'vSlide':function(){
					//统一容器和item的宽高及选中默认值
					var animconRegion = self.animcon.get('region');
					self.animwrap.setStyles({
						'height': (self.length+offset) * animconRegion.height / self.colspan + 'px'
					});

				},
				'hSlide':function(){
					//统一容器和item的宽高及选中默认值
					var animconRegion = self.animcon.get('region');
					self.animwrap.setStyles({
						'width': (self.length+offset) * animconRegion.width / self.colspan + 'px'
					});
				},
				'fade':function(){
				}

			};

			reHandleSize[self.effect]();

			// 如果传入offset 说明仅仅计算wrapper的宽度
			if(!S.isUndefined(offset)){
				self.relocateCurrentTab();
			}

			return this;
		},

		// 添加一个帧，index为添加到的索引，默认添加到最后
		add: function(node,index){
			var self = this;

			if(S.isUndefined(index) || index > self.length){
				index = self.length;
			}

			if(S.isString(node)){
				node = S.one(node);
			}

			/*
			node.css({
				float:'left'	
			});
			*/

			// bugfix pad/phone中避免闪屏
			/*
			 * pad/phone中容器宽度>=641时，dom上的样式改变会有reflow，小于时，没有reflow
			 * 在phone中会比较平滑，不会有闪屏
			 *
			 */
			if(self.transitions){
				node.css({
					visibility:'hidden'
				});
			}

			if(index == self.length){
				// bugfix，防止在webkit中因为设置了backface属性，导致dom操作渲染延迟，slide操作会有闪烁
				setTimeout(function(){
					self.setWrapperSize(1);
				},0);
				node.insertAfter(self.pannels[index - 1]);
			}else{
				node.insertBefore(self.pannels[index]);
			}

			self.setWrapperSize();

			self.fixSlideSize(self.currentTab);

			// S.log(node.offset().top);

			// bugfix pad/phone中避免闪屏
			if(self.transitions){
				node.css({
					visibility:''
				});
			}

			if(self.transitions){
			}

			return this;

			// TODO 添加面板的时候，没有添加导航
		},
		remove:function(index){
			var self = this;

			if(self.length === 1){
				return;
			}

			// 删除当前帧和之前帧时，currentTab需-1
			if(index <= self.currentTab){
				self.currentTab --;
				self.length --;
			}

			// bugfix,防止移动设备中的闪屏
			if(self.transitions){
				self.con.css({
					display:'none'
				});
			}

			S.one(self.pannels[index]).remove();

			self.setWrapperSize();

			// bugfix,防止移动设备中的闪屏
			if(self.transitions){
				self.con.css({
					display:'block'
				});
			}

			self.fixSlideSize(self.currentTab);

			// TODO 删除面板的时候，没有删除导航
			return this;
		},
		removeLast:function(){
			var self = this;
			self.remove(self.length - 1);
			return self;
		},

		//渲染textarea中的内容，并放在与之相邻的一个div中，若有脚本，执行其中脚本
		renderLazyData:function(textarea){
			var self = this;
			textarea.setStyle('display','none');
			if(textarea.attr('lazy-data')=='1'){
				return ;
			}
			textarea.attr('lazy-data','1');
			var	id = S.stamp(div),
				html = textarea.get('innerHTML').replace(/&lt;/ig,'<').replace(/&gt;/ig,'>'),
				div = S.Node.create('<div>'+html+'</div>');
			S.DOM.insertBefore(div,textarea);
			//textarea.insertBefore(div);
			S.execScript(html);
		},
		// 绑定函数 ,YUI3需要重新定义这个绑定函数,KISSY不需要
		/*
		on:function(type,foo){
			var self = this;
			self.EventCenter.subscribe(type,foo);
			return this;
		},
		*/

		// 如果是动画效果，则构建Wrap
		buildWrap: function(){
			var self = this;

			self.animwrap = S.Node.create('<div style="position:absolute;"></div>');
			self.animwrap.set('innerHTML', self.animcon.get('innerHTML'));
			self.animcon.set('innerHTML', '');
			self.animcon.appendChild(self.animwrap);
			self.pannels = self.con.all('.' + self.contentClass + ' div.' + self.pannelClass);

			return self;

		},

		// 各种动画效果的初始化行为
		// TODO 应当从BSLide中抽取出来
		doEffectInit: function(){

			var self = this;

			var effectInitFn = {
				'none':function(){

					self.pannels = self.con.all('.' + self.contentClass + ' div.' + self.pannelClass);
					self.pannels.setStyles({
						display:'none'	
					});

					self.pannels.item(self.defaultTab).setStyles({
						'display':'block'	
					});

				},
				'vSlide':function(){
					self.buildWrap();
					//统一容器和item的宽高及选中默认值
					var animconRegion = self.animcon.get('region');
					self.pannels.setStyles({
						'float': 'none',
						'overflow': 'hidden'
					});
					self.animwrap.setStyles({
						'height': self.length * animconRegion.height / self.colspan + 'px',
						'overflow': 'hidden',
						'top': -1 * self.defaultTab * animconRegion.height + 'px'
					});

				},

				'hSlide':function(){
					self.buildWrap();
					//统一容器和item的宽高及选中默认值
					var animconRegion = self.animcon.get('region');
					self.pannels.setStyles({
						'float': 'left',
						'overflow': 'hidden'
					});
					self.animwrap.setStyles({
						'width': self.length * animconRegion.width / self.colspan + 'px',
						'overflow': 'hidden',
						'left': -1 * self.defaultTab * animconRegion.width + 'px'
					});
				},
				'fade':function(){

					self.pannels = self.con.all('.' + self.contentClass + ' div.' + self.pannelClass);
					self.pannels.setStyles({
						'position': 'absolute',
						'zIndex': 0
					});
					self.pannels.each(function(node, i){
						if (i == self.defaultTab) {
							//node.removeClass('hidden');
							node.setStyles({
								'opacity': 1,
								'display': 'block'
							});
						} else {
							//node.addClass('hidden');
							node.setStyles({
								'opacity':0,
								'diaplay':'none'	
							});
						}
					});

				}

			};

			effectInitFn[self.effect]();

			return this;

		},
		//构建html结构的全局函数
		buildHTML: function() {
            var self = this;
			var con = self.con;
            self.tabs = con.all('.' + self.navClass + ' '+self.triggerSelector);

            var tmp_pannels = con.all('.' + self.contentClass + ' .' + self.pannelClass);
            self.length = tmp_pannels.size();

			if(!con.one('.'+self.navClass)){
				S.Node('<ul class="'+self.navClass+'" style="display:none"></ul>').appendTo(self.con);
			}

            if (self.tabs.size() === 0) {
                //nav.li没有指定，默认指定1234
                var t_con = con.all('.' + self.navClass);
				var t_str = '';
                for (var i = 0; i < self.length; i++) {
                    var t_str_prefix = '';
                    if (i === 0) {
                        t_str_prefix = self.selectedClass;
                    }
                    t_str += '<li class="' + t_str_prefix + '"><a href="javascript:void(0);">' + (i + 1) + '</a></li>';
                }
                t_con.set('innerHTML', t_str);
            }
            self.tabs = con.all('.' + self.navClass + ' '+self.triggerSelector);
            self.animcon = con.one('.' + self.contentClass);
            self.animwrap = null;

			self.doEffectInit();

			self.fixSlideSize(self.currentTab);
            //添加选中的class
			self.hightlightNav(self.getWrappedIndex(self.currentTab));
            //是否自动播放
            if (self.autoSlide === true) {
                self.play();
            }
            return this;
        },
		getCurrentPannel:function(){
			var self = this;
			return S.one(self.pannels[self.currentTab]);
		},


		// 重新渲染slide内页(pannels)的宽度
		renderWidth:function(){
			var self = this;
			//有可能animcon没有定义宽度
			var width = self.animcon.get('region').width;
			if(self.effect == 'hSlide'){
				width /= self.colspan;
			}
			self.pannels.setStyles({
				width:width + 'px'
			});
			return this;
		},
		
		//重新渲染slide内页(pannels)的高度
		renderHeight :function(){
			var self = this;
			//有可能animcon没有定义高度
			var height = self.animcon.get('region').height;
			if(self.effect == 'vSlide'){
				height /= self.colspan;
			}
			self.pannels.setStyles({
				height:height + 'px'
			});
			return this;
		},

		//当当前帧的位置不正确时，重新定位当前帧到正确的位置,无动画
		relocateCurrentTab:function(index){
			var self = this;
			if(S.isUndefined(index)){
				index = self.currentTab;
			}
			if(self.effect != 'hSlide'){
				return;
			}

			if(self.transitions){
				self.animwrap.setStyles({
					'-webkit-transition-duration': '0s',
					'-webkit-transform':'translate3d('+(-1 * index * self.animcon.get('region').width)+'px,0,0)',
					'-webkit-backface-visibility':'hidden'
				});
			}else{
				self.animwrap.setStyles({
					left: -1 * index * self.animcon.get('region').width
					
				});
			}

			self.currentTab = index;
			
			return this;
		},

		//根据配置条件修正控件尺寸
		// 重新渲染slide的尺寸，
		// 根据go到的index索引值渲染当前需要的长度和宽度
		fixSlideSize:function(index){
			var self = this;
			if(self.adaptive_fixed_width){
				self.renderWidth();
			}
			if(self.adaptive_fixed_height){
				self.renderHeight();
			}
			if(self.adaptive_fixed_size){
				self.renderHeight().renderWidth();
			}
			self.resetSlideSize(index);
			return this;
		},

		// timmer 是指的动态监控wrapperCon高度的定时器
		// wrapperCon在很多时候高度是可变的
		// 这时就需要timmer来监听了
		removeHeightTimmer: function(){
			var self = this;
			if(!S.isNull(self.heightTimmer)){
				clearInterval(self.heightTimmer);
				self.heightTimmer = null;
			}
		},
		addHeightTimmer: function(){
			var self = this;
			if(!S.isNull(self.heightTimmer)){
				clearInterval(self.heightTimmer);
				self.heightTimmer = null;
			}

			var resetHeight = function(){
				if(self.effect == 'hSlide'){
					self.animcon.setStyles({
						height:self.pannels.item(self.currentTab).get('region').height+'px'
					});
				}
			};
			self.heightTimmer = setInterval(resetHeight,100);
			resetHeight();
		},

		//在before_switch和windowResize的时候执行，根据spec_width是否指定，来决定是否重置页面中的适配出来的宽度和高度并赋值
		// index是go的目标tab-pannel的索引
		// 这个函数主要针对横向滚动时各个pannel高度不定的情况
		resetSlideSize:function(index){
			var self = this;
			var width,height;
			if(typeof index == 'undefined' || index === null){
				index = self.currentTab;
			}
			// 如果没有开关，或者没有滑动特效，则退出函数
			if(self.effect != 'hSlide' && self.effect != 'vSlide'){
				return;
			}
			//var width = self.spec_width();
			
			if(self.effect == 'hSlide'){
				width = self.adaptive_width ? 
										self.adaptive_width():
										self.animcon.get('region').width;
				height = self.pannels.item(index).get('region').height;

				width /= self.colspan;

				// pannels的高度是不定的，高度是根据内容
				// 来撑开的因此不能设置高度，而宽度则需要设置
				self.pannels.setStyles({
					width:width+'px',
					display:'block'
				});

				self.animcon.setStyles({
					width:width * self.colspan +'px',
					overflow:'hidden'
				});

				if(self.animWrapperAutoHeightSetting){
					self.animcon.setStyles({
						height:height+'px'
						//强制pannel的内容不超过动画容器的范围
					});
				}
			}

			if(self.effect == 'vSlide'){
				width = self.pannels.item(index).get('region').width;
				height = self.adaptive_height ? 
										self.adaptive_height():
										self.animcon.get('region').height;
				height /= self.colspan;

				self.pannels.setStyles({
					height:height * self.colspan +'px',
					display:'block'
				});

				self.animcon.setStyles({
					height:height * self.colspan +'px',
					overflow:'hidden'
				});

				if(self.animWrapperAutoHeightSetting){
					self.animcon.setStyles({
						width:width +'px'
						//强制pannel的内容不超过动画容器的范围
					});
				}

			}

			return this;
		},

		// 得到tabnav应当显示的当前index索引，0,1,2,3...
		getWrappedIndex:function(index){
			var self = this,wrappedIndex = 0;

			if(index === 0){
				//debugger;
			}
			if(self.carousel){
				
				if(index < self.colspan){
					wrappedIndex = self.length - self.colspan * 3 + index; 
				} else if(index >= self.length - self.colspan) {
					wrappedIndex = index - (self.length - self.colspan);
				} else {
					wrappedIndex = index - self.colspan;
				}

			}else{
				wrappedIndex = index;
			}
			return wrappedIndex;
		},


		// 绑定默认事件
		bindEvent:function(){
			var self = this;
			if(	S.inArray(self.eventType,['click','mouseover','mouseenter'] )) {
				self.con._delegate(self.eventType,function(e){
					e.halt();
					var ti = Number(self.tabs.indexOf(e.currentTarget));
					if(self.carousel){
						ti = (ti + 1) % self.length;
					}
					self.go(ti);
					if(self.autoSlide){
						self.stop().play();
					}
				},'.'+self.navClass+' '+self.triggerSelector);
			}

			// 是否支持鼠标悬停停止播放
			if(self.hoverStop){
				self.con._delegate('mouseover',function(e){
					//e.halt();
					if(self.autoSlide)self.stop();
				},'.'+self.contentClass+' div.'+self.pannelClass);
				self.con._delegate('mouseout',function(e){
					//e.halt();
					if(self.autoSlide)self.play();
				},'.'+self.contentClass+' div.'+self.pannelClass);
			}

			// 绑定窗口resize事件 
			S.Event.on(window,'resize',function(e){
				self.fixSlideSize(self.currentTab);
				self.relocateCurrentTab();
			});

			// 绑定判断switch发生的时机
			self.on('beforeSwitch',function(o){
				if(this.layerSlide && this.isAming()){
					return false;
				}
			});

			//终端事件触屏事件绑定
			// TODO 触屏设备目前和ie6的降级方案实现一样,目前没实现降级
			// TODO 需要将触屏支持抽离出BSlide
			if ( 'ontouchstart' in document.documentElement ) {

				if(!self.touchmove){
					return this;
				}

				self.con._delegate('touchstart',function(e){
					self.stop();
					self.touching = true;
					if(self.is_last() && self.carousel){
						self.fix_next_carousel();
					}
					if(self.is_first() && self.carousel){
						self.fix_pre_carousel();
					}
					self.startX = e.changedTouches[0].clientX;
					self.startY = e.changedTouches[0].clientY;
					self.animwrap.setStyles({
						'-webkit-transition-duration': '0s'
					});
					self.startT = Number(new Date());//如果快速手滑，则掠过touchmove，因此需要计算时间
				},'.'+self.contentClass); 

				self.con._delegate('touchend',function(e){
					self.touching = false;
					var endX  = e.changedTouches[0].clientX;
					var width = Number(self.animcon.get('region').width);
					self.deltaX = Math.abs(endX - self.startX);//滑过的距离
					var swipeleft = (Math.abs(endX) < Math.abs(self.startX));//是否是向左滑动
					var swiperight = !swipeleft;
					//判断是否在边界反滑动，true，出现了反滑动，false，正常滑动
					var anti = self.carousel ? false : ( self.is_last() && swipeleft || self.is_first() && swiperight );

					//复位
					var reset = function(){
						self.animwrap.setStyles({
							'-webkit-transition-duration': (Number(self.speed) / 2) + 's',
							'-webkit-transform':'translate3d('+(-1 * self.currentTab * self.animcon.get('region').width / self.colspan)+'px,0,0)'
						});
					};

					//根据手势走向上一个或下一个
					var goswipe = function(){
						var colwidth = self.animcon.get('region').width / self.colspan;
						var span = parseInt( (self.deltaX - colwidth / 2) / colwidth , 10);
						// 滑动距离超过一帧
						if(swipeleft){//下一帧
							if(span >= 1 && self.length >2){
								// TODO 这里将solspan设为大于1的值时，有时候会意外复位，复现条件未知
								/*
								console.log('currentTab:'+self.currentTab+' span:'+span);
								*/
								self.currentTab += span;
								if(self.currentTab >= self.length - 1){
									self.currentTab = self.length - 2;
								}
							}
							self.next();
						}else{//上一帧
							if(span >= 1 && self.length > 2){
								if(self.currentTab - span <= 0){
									self.currentTab = 1;
								}else{
									self.currentTab += -1 * span;
								}
							}
							self.previous();
						}
					};

					//如果检测到是上下滑动，则复位并return
					/*
					if(self.isScrolling){
						reset();
						return;
					}
					*/

					//如果滑动物理距离太小，则复位并return
					//这个是避免将不精确的点击误认为是滑动
					if(self.touchmove && self.deltaX < 30){
						reset();
						return;
					}


					if(		!anti && (
								// 支持touchmove，跑马灯效果，任意帧，touchmove足够的距离
								( self.touchmove && (self.deltaX > width / 3) ) ||
								// 不支持touchmove，跑马灯
								( !self.touchmove && self.carousel ) ||
								// 正常tab，支持touchmove，横向切换
								( !self.carousel && self.touchmove && self.effect == 'hSlide' ) || 
								// 不支持touchmove，不支持跑马灯
								( !self.touchmove && !self.carousel) ||
								//快速手滑
								( Number(new Date()) - self.startT < 550 )
							)
						
						){

							//根据根据手滑方向翻到上一页和下一页
							goswipe();

					}else{
						//复位
						reset();
					}

					if(self.autoSlide){
						self.play();
					}
				},'.'+self.contentClass);


				//处理手指滑动事件相关
				if(self.touchmove){

					// TODO 网页放大缩小时，距离计算有误差


					self.con._delegate('touchmove',function(e){
						// 确保单手指滑动，而不是多点触碰
						if(e.touches.length > 1 ) return;


						//deltaX > 0 ，右移，deltaX < 0 左移
						self.deltaX = e.touches[0].clientX- self.startX; 

						//判断是否在边界反滑动，true，出现了反滑动，false，正常滑动
						var anti = ( self.is_last() && self.deltaX < 0 || self.is_first() && self.deltaX > 0 );

						if(!self.carousel && self.effect == 'hSlide' && anti){
							self.deltaX = self.deltaX / 3; //如果是边界反滑动，则增加阻尼效果
						}

						// 判断是否需要上下滑动页面


						self.isScrolling = ( Math.abs(self.deltaX) < Math.abs(e.touches[0].clientY- self.startY) ) ? true: false;

						if(!self.isScrolling){

							// 阻止默认上下滑动事件
							e.halt();

							self.stop();
							var width = Number(self.animcon.get('region').width / self.colspan);
							var dic = self.deltaX - self.currentTab * width;

							// 立即跟随移动
							self.animwrap.setStyles({
								'-webkit-transition-duration': '0s',
								'-webkit-transform':'translate3d('+dic+'px,0,0)'
							});

						}
						
					},'.'+self.contentClass); 

					// TODO 触屏设备中的AnimEnd事件的实现
					self.animwrap.on('webkitTransitionEnd',function(){
						
						/*
						self.fire('afterSwitch',{
							index: index,
							navnode: self.tabs.item(self.getWrappedIndex(index)),
							pannelnode: self.pannels.item(index)
							
						});	
						*/
					}); 
				}

			}

			return this;

		},

		// 初始化所有的SubLayer
		// TODO 从BSlide中抽离出来

		/*
		 * SubLayer存放在:
		 *
		 * self {
		 *		sublayers:[
		 *			[],	// 第一帧的sublay数组,可以为空数组
		 *			[], // ...
		 *			[]
		 *		]
		 * }
		 *
		 * */
		
		initLayer: function(){
			var self = this;

			// 在触屏设备中layer功能暂时去掉
			// TODO 应当加上触屏支持
			if ( 'ontouchstart' in document.documentElement ) {
				return;
			}

			if(S.UA.ie > 0 && S.UA.ie < 9){
				return;
			}

			// 过滤rel中的配置项
			var SubLayerString = [
				"durationin",
				"easingin",
				"durationout",
				"easingout",
				"delayin",
				"delayout",
				"slideindirection",
				"slideoutdirection",
				"offsetin",
				"offsetout",
				"alpha",
				
				"easeInStrong",
				"easeOutStrong",
				"easeBothStrong",
				"easeNone",
				"easeIn",
				"easeOut",
				"easeBoth",
				"elasticIn",
				"elasticOut",
				"elasticBoth",
				"backIn",
				"backOut",
				"backBoth",
				"bounceIn",
				"bounceOut",
				"bounceBoth",
				"left",
				"top",
				"right",
				"bottom"
			];

			// sublay的默认配置项，参照文件顶部文档说明
			var SubLayerConfig = {
				"durationin":			1000,
				"easingin":				'easeIn',
				"durationout":			1000,
				"easingout":			'easeOut',
				"delayin":				300,
				"delayout":				300,
				"slideindirection":		'right',
				"slideoutdirection":	'left',
				"alpha":				true,	
				"offsetin":				50,	
				"offsetout":			50

			};

			// SubLayer 构造器,传入单个el，生成SubLayer对象
			var SubLayer = function(el){

				var that = this;
				var _sublayer_keys = [];
				
				/*
				S.each(SubLayerConfig,function(k,v){
					_sublayer_keys.push(k);
				});
				*/

				// 如果sublayer配置的书写格式不标准，则这里会报错
				// TODO 错误捕捉处理
				var json = el.attr('rel').replace(/"'/ig,'').replace(new RegExp('('+SubLayerString.join('|')+')',"ig"),'"$1"');

				var o = S.JSON.parse('{'+json+'}');
				
				function setParam(def, key){
					var v = o[key];
					// null 是占位符
					that[key] = (v === undefined || v === null) ? def : v;
				}

				
				S.each(SubLayerConfig,setParam);

				this.el = el;

				// el.offset 计算高度不准确，不知为何，改用css()
				// TODO 寻找原因
				/*
				this.left = el.offset().left;
				this.top = el.offset().top;
				*/
				this.left = Number(el.css('left').replace('px',''));
				this.top = Number(el.css('top').replace('px',''));

				// sublayer.animIn()，某个sublayer的进入动画
				this.animIn = function(){

					var that = this;

					// 记录进入偏移量和进入方向
					var offsetIn = that.offsetin;
					var inType = that.slideindirection;

					// 动画开始之前的预处理
					var prepareEl = {
						left:function(){
								 that.el.css({
									 'left':that.left-offsetIn
								 });
							 },
						top:function(){
								that.el.css({
									'top':that.top-offsetIn
								});
							},
						right:function(){
								  that.el.css({
									  'left':that.left+offsetIn
								  });
							  },
						bottom:function(){
								   that.el.css({
									   'top':that.top+offsetIn
								   });
							   }
					};

					prepareEl[inType]();

					setTimeout(function(){


						var SlideInEffectTo = {
							left:	{
										left:that.left// + offsetIn
									},
							top:	{
										top:that.top// - offsetIn
									},
							bottom:	{
										top:that.top// + offsetIn,
									},
							right:	{
										left:that.left// - offsetIn
									}
						};



						// 动画结束的属性
						var to = {};

						S.mix(to,SlideInEffectTo[inType]);

						// 如果开启alpha，则从透明动画到不透明
						if(that.alpha){
							S.mix(to,{
								opacity:1	
							});
						}


						// 执行动画
						S.Anim(that.el,to,that.durationin/1000,that.easingin,function(){
							// TODO 动画结束后的回调事件
							// 寻找最后的动画结束时间
						}).run();
						
					},that.delayin);

					if(that.alpha){
						that.el.css({
							opacity:0	
						});
					}


				};
				// TODO 仿效animIn来实现
				this.animOut = function(){

				};

			};

			self.sublayers = [];

			self.pannels.each(function(node,index){

				if(self.effect == 'vSlide'||self.effect == 'hSlide'){
					node.css({
						position:'relative'	
					});
				}

				if(node.all('[alt="sublayer"]').length === 0){
					self.sublayers[index] = [];
					return;
				}
				if(self.sublayers[index] === undefined){
					self.sublayers[index] = [];
				}

				node.all('[alt="sublayer"]').each(function(el,j){
					self.sublayers[index].push(new SubLayer(el));
				});
				
			});

			self.on('beforeSwitch',function(o){
				if(o.index === self.currentTab){
					return false;
				}
				self.subLayerRunin(o.index);
			});

			self.on('beforeTailSwitch',function(o){
				self.subLayerRunout(o.index);	
			});

		},

		// 执行某一帧的进入动画
		subLayerRunin : function(index){

			var self = this;
			
			var a = self.sublayers[index];

			S.each(a,function(o,i){
				o.animIn();
			});
		},

		// 执行某一帧的移出动画
		subLayerRunout : function(index){
			var self = this;

			var a = self.sublayers[index];

			S.each(a,function(o,i){
				o.animOut();
			});

		},

		// 构建BSlide全局参数列表
		buildParam:function(o){

			var self = this;

			if(o === undefined || o === null){
				o = {};
			}

			function setParam(def, key){
				var v = o[key];
				// null 是占位符
				self[key] = (v === undefined || v === null) ? def : v;
			}

			S.each({
				autoSlide:		false,
				speed:			500,//ms
				timeout:		3000,
				effect:			'none',
				eventType:		'click',
				easing:			'easeBoth',
				hoverStop:		true,
				selectedClass:	'selected',
				conClass:		't-slide',
				navClass:		'tab-nav',
				triggerSelector:'li',
				contentClass:	'tab-content',
				pannelClass:	'tab-pannel',
				// before_switch:	new Function,
				carousel:		false,
				reverse:		false,
				touchmove:		false,
				adaptive_fixed_width:false,
				adaptive_fixed_height:false,
				adaptive_fixed_size:false,
				adaptive_width:	false,
				adaptive_height:false,
				defaultTab:		0,
				layerSlide:		false,
				layerClass:		'tab-animlayer',
				colspan:		1,
				animWrapperAutoHeightSetting:true,// beforeSwitch不修改wrappercon 宽高
				webkitOptimize	:true
				
			},setParam);

			S.mix(self,{
				tabs:			[],
				animcon:		null,
				pannels:		[],
				timmer:			null,
				touching:		false
			});

			self.speed = self.speed / 1000;

			if(self.defaultTab !== 0){
				self.defaultTab = Number(self.defaultTab) - 1; // 默认隐藏所有pannel
			}

			// 如果是跑马灯，则不考虑默认选中的功能，一律定位在第一页,且只能是左右切换的不支持上下切换
			if(self.carousel){
				self.defaultTab = self.colspan; //跑马灯显示的是真实的第二项
				self.effect = 'hSlide';// TODO 目前跑马灯只支持横向滚动
			}

			self.currentTab = self.defaultTab;//0,1,2,3...

			//判断是否开启了内置动画
			self.transitions = ( "webkitTransition" in document.body.style && self.webkitOptimize );

            return self;
		},
		//针对移动终端的跑马灯的hack
		//index 移动第几个,0,1,2,3
		fix_for_transition_when_carousel: function(index){
			var self = this;
			if(typeof index == 'undefined'){
				index = 0;
			}
			var con = self.con;
            self.animcon = self.con.one('.' + self.contentClass);
			self.animwrap = self.animcon.one('div');
			self.pannels = con.all('.' + self.contentClass + ' div.' + self.pannelClass);
			if(self.effect == 'hSlide'){
				var width = Number(self.animcon.get('region').width / self.colspan);
				var height = Number(self.animcon.get('region').height);
				self.animwrap.setStyle('width',self.pannels.size() * width + 2 * width);
				var first = self.pannels.item(index).cloneNode(true);
				var last = self.pannels.item(self.pannels.size()- 1 - index).cloneNode(true);
				self.animwrap.append(first);
				self.animwrap.prepend(last);
				if(self.transitions){
					//这步操作会手持终端中造成一次闪烁,待解决
					self.animwrap.setStyles({
						'-webkit-transition-duration': '0s',
						'-webkit-transform':'translate3d('+(-1 * width * (index/2 + 1))+'px,0,0)',
						'-webkit-backface-visibility':'hidden',
						'left':'0'
					});
				}else {
					self.animwrap.setStyle('left',-1 * width * (index/2 + 1));
				}
			}
			//重新获取重组之后的tabs
			self.pannels = con.all('.' + self.contentClass + ' div.' + self.pannelClass);
			self.length = self.pannels.size();

			return this;

		},

		// 是否在做动画过程中
		isAming : function(){
			var self = this;
			if(self.anim){
				return self.anim.isRunning();
			} else {
				return false;
			}
		},

		//上一个
		previous:function(callback){
			var self = this;
			//防止旋转木马状态下切换过快带来的晃眼
			try{
				if(self.isAming() && self.carousel){
					return this;
				}
			}catch(e){}
			var _index = self.currentTab+self.length-1 - (self.colspan - 1);
			if(_index >= (self.length - self.colspan + 1)){
				_index = _index % (self.length - self.colspan + 1);
			}

			if(self.carousel){

				if(self.is_first()){
					self.fix_pre_carousel();
					self.previous.call(self);
					// arguments.callee.call(self);
					return this;
				}
			}
			self.go(_index,callback);
			return this;
		},
		//判断当前tab是否是最后一个
		is_last:function(){
			var self = this;
			if(self.currentTab == (self.length - (self.colspan - 1) - 1)){
				return true;
			}else{
				return false;
			}
		},
		//判断当前tab是否是第一个
		is_first:function(){
			var self = this;
			if(self.currentTab === 0){
				return true;
			}else{
				return false;
			}
		},
		//下一个
		next:function(callback){
			var self = this;
			//防止旋转木马状态下切换过快带来的晃眼
			try{
				if(self.isAming() && self.carousel){
					return this;
				}
			}catch(e){}
			var _index = self.currentTab+1;
			if(_index >= (self.length - self.colspan + 1)){
				_index = _index % (self.length - self.colspan + 1);
			}
			if(self.carousel){

				if(self.is_last()){
					self.fix_next_carousel();
					self.next.call(self);
					// arguments.callee.call(self);
					return this;

				}

			}
			self.go(_index,callback);
			return this;
		},
		// 修正跑马灯结尾的滚动位置
		fix_next_carousel:function(){
			var self = this;

			self.currentTab = self.colspan;
			var con = self.con;
			if(self.effect != 'none'){
				self.pannels = con.all('.'+self.contentClass+' div.'+self.pannelClass);
			}

			//目标offset，'-234px'
			var dic = '-' + Number(self.animcon.get('region').width ).toString()+'px';

			if(self.effect == 'hSlide'){

				if(self.transitions){
					self.animwrap.setStyles({
						'-webkit-transition-duration': '0s',
						'-webkit-transform':'translate3d('+dic+',0,0)'
					});

				}else{
					self.animwrap.setStyle('left',dic);
				}
			} else if (self.effect == 'vSlide'){
				// 暂不支持纵向跑马灯的滚动

			}

			return;

		},

		// 修正跑马灯开始的滚动位置
		fix_pre_carousel:function(){
			var self = this;

			// jayli 这里需要调试修正，继续调试
			self.currentTab = self.length - 1 - self.colspan * 2 + 1;
			var con = self.con;
			if(self.effect != 'none'){
				self.pannels = con.all('.'+self.contentClass+' div.'+self.pannelClass);
			}
			// 目标offset,是一个字符串 '-23px'
			var dic = '-' + (Number(self.animcon.get('region').width / self.colspan) * (self.currentTab)).toString() + 'px';

			if(self.effect == 'hSlide'){
				if(self.transitions){
					self.animwrap.setStyles({
						'-webkit-transition-duration': '0s',
						'-webkit-transform':'translate3d('+dic +',0,0)'
					});

				}else{
					self.animwrap.setStyle('left',dic);
				}
			}else if (self.effect == 'vSlide'){
				//竖向滚动暂时未实现

			}

			return;

		},
		//高亮显示第index(0,1,2,3...)个nav
		hightlightNav:function(index){
			var self = this;
			// 同时是跑马灯，且一帧多元素，则不允许存在Nav
			if(self.carousel && self.colspan > 1){
				return this;
			}
			if(self.tabs.item(index)){
				self.tabs.removeClass(self.selectedClass);
				self.tabs.item(index).addClass(self.selectedClass);
			}
			return this;
		},
		//切换至index,这里的index为真实的索引
		switch_to:function(index,callback){
			var self = this;
			//首先高亮显示tab


			var afterSwitch = function(){
				if(S.isFunction(callback)){
					callback.call(self,self);
				}
				self.fire('afterSwitch',{
					index: self.currentTab,
					navnode: self.tabs.item(self.getWrappedIndex(self.currentTab)),
					pannelnode: self.pannels.item(self.currentTab)
				});
			};
			

			self.fire('beforeTailSwitch',{
                index: self.currentTab,
                navnode: self.tabs.item(self.getWrappedIndex(self.currentTab)),
                pannelnode: self.pannels.item(self.currentTab)
			});

			self.hightlightNav(self.getWrappedIndex(index));
			self.fixSlideSize(index);
			if(self.autoSlide){
				self.stop().play();
			}
            if (index >= self.length) {
                index = index % self.length;
            }
            if (index == self.currentTab) {
                return this;
            }

			if (self.anim) {
				try {
					self.anim.stop();
					//fix IE6下内存泄露的问题，仅支持3.2.0及3.3.0,3.1.0及3.0.0需修改Y.Anim的代码
					//modified by huya
					// self.anim.destroy();
					self.anim = null;
				} catch (e) {}
			}

			// TODO 帧切换动画的实现应当从Bslide中抽离出来
			var animFn = {
				'none':function(index){

					self.pannels.setStyles({
						'display':'none'	
					});

					self.pannels.item(index).setStyles({
						'display':'block'	
					});

					afterSwitch();

				},
				'vSlide':function(index){

					if(self.transitions){
						self.animwrap.setStyles({
							'-webkit-transition-duration': self.speed + 's',
							'-webkit-transform':'translate3d(0,'+(-1 * index * self.animcon.get('region').height / self.colspan)+'px,0)',
							'-webkit-backface-visibility':'hidden'
						});
						self.anim = S.Anim(self.animwrap,{
							opacity:1
						},self.speed,self.easing,function(){
							afterSwitch();
						});
						self.anim.run();
					} else {
						/*
						self.anim = new S.Anim({
							node: self.animwrap,
							to: {
								top: -1 * index * self.animcon.get('region').height
							},
							easing: self.easing,
							duration: self.speed
						});
						self.anim.run();
						*/
						self.anim = S.Anim(self.animwrap,{
							top: -1 * index * self.animcon.get('region').height / self.colspan
						},self.speed,self.easing,function(){
							afterSwitch();
						});
						self.anim.run();
					}

				},
				'hSlide':function(index){

					if(self.transitions){
						self.animwrap.setStyles({
							'-webkit-transition-duration': self.speed + 's',
							'-webkit-transform':'translate3d('+(-1 * index * self.animcon.get('region').width / self.colspan)+'px,0,0)',
							'-webkit-backface-visibility':'hidden'
						});
						self.anim = S.Anim(self.animwrap,{
							opacity:1
						},self.speed,self.easing,function(){
							afterSwitch();
						});
						self.anim.run();
					}else{

						self.anim = S.Anim(self.animwrap,{
							left: -1 * index * self.animcon.get('region').width / self.colspan
						},self.speed,self.easing,function(){
							afterSwitch();
						});

						self.anim.run();
					}

				},
				'fade':function(index){
					//重写fade效果逻辑
					//modified by huya
					var _curr = self.currentTab;

					self.anim = S.Anim(self.pannels.item(index),{
						opacity: 1
					},self.speed,self.easing,function(){

						self.pannels.item(_curr).setStyle('zIndex', 0);
						self.pannels.item(index).setStyle('zIndex', 1);
						self.pannels.item(_curr).setStyle('opacity', 0);
						self.pannels.item(_curr).setStyles({
							'display':'none'	
						});
						afterSwitch();
						/*
						self.fire('afterSwitch',{
							index: index,
							navnode: self.tabs.item(self.getWrappedIndex(index)),
							pannelnode: self.pannels.item(index)
						});
						*/
					});

					//动画开始之前的动作
					self.pannels.item(index).setStyles({
						'display':'block'	
					});
					self.pannels.item(index).setStyle('opacity', 0);
					self.pannels.item(_curr).setStyle('zIndex', 1);
					self.pannels.item(index).setStyle('zIndex', 2);

					self.anim.run();

				}

			};

			animFn[self.effect](index);

            self.currentTab = index;

			// TODO，讨论switch的发生时机
            self.fire('switch', {
                index: index,
                navnode: self.tabs.item(self.getWrappedIndex(index)),
                pannelnode: self.pannels.item(index)
            });

			//延迟执行的脚本
			var scriptsArea = self.pannels.item(index).all('.data-lazyload');
			if(scriptsArea){
				scriptsArea.each(function(node,i){
					self.renderLazyData(node);
				});
			}
		},
		//去往任意一个,0,1,2,3...
		"go":function(index,callback){
			var self = this;

            var goon = self.fire('beforeSwitch', {
				index:index,
				navnode:self.tabs.item(index),
				pannelnode:self.pannels.item(index)
            });

			if(goon !== false){
				//发生go的时候首先判断是否需要整理空间的长宽尺寸
				//self.renderSize(index);

				if(index + self.colspan > self.pannels.size()){
					index = self.pannels.size() - self.colspan;
				}
				self.switch_to(index,callback);
			}

			// TODO 讨论afterSwitch的发生时机
			/*
            self.fire('afterSwitch', {
                index: index,
                navnode: self.tabs.item(self.getWrappedIndex(index)),
                pannelnode: self.pannels.item(index)
            });
			*/

			return this;

		},
		//自动播放
		play:function(){
			var self = this;
			if(self.timer !== null){
				clearTimeout(self.timer);
			}
			self.timer = setTimeout(function(){
				self.next().play();
			},Number(self.timeout));
			return this;
		},
		//停止自动播放
		stop:function(){
			var self = this;
			clearTimeout(self.timer);
			self.timer = null;
			return this;
		}
	});

	return BSlide;

},{
	requires:['node','event','json','./util','./kissy2yui']	
});

KISSY.add('mobile/app/1.0/util',function(S){

	"use strict";

	// Node 增补方法
	
	S.mix(S,{
		setHash : function(sUrl, data){
			var url;
			var i;
			if(typeof sUrl == 'object'){
				url = window.location.href;
				data = sUrl;
			}else{
				url = sUrl;
			}
			if(url.indexOf("#") < 0){
				url+='#';
			}
			var o = this.getHash(url);

			/**
			 * 清除新视图hash中不需要的key，如果不及时清除，则存在潜在风险
			 * 比如：从视图A { 
			 *    viewpath: 'a.html',
			 *    param: 'type=ssq'
			 * }
			 * 跳转到视图B {
			 *    viewpath: 'b.html',
			 *    param: 'need=true'
			 * }
			 * hash将变成: '#viewpath=b.html&need=true' 而不是'#viewpath=b.html&type=ssq&need=true'
			 * added by zhenn(栋寒)
			 */ 
			for (var i in o) {
				if (!(i in data) && i !== 'viewpath') {
					delete o[i];
				}	
			}	

			for(i in data){
				o[i] = data[i];
			}
			url = url.split("#")[0]+'#';
			for(i in o){
				url+=i+'='+o[i]+'&';
			}
			url = url.substr(0,url.length-1);
			return url;
		},
		// url?a=1&b=2
		// url?a=1&b=2#c=3&d=4
		// url?a=1&b=2#c=3&d=4?e=5 错误的输入
		getHash : function(sUrl){
			var url = sUrl || window.location.href;
			if(url.indexOf("#") < 0){
				return {};
			}else{
				// var hash = url.split('#')[1];
				var hash = new S.Uri(url).getFragment();
				if(hash === '')return {};
				/*
				if(hash[hash.length-1] == '&')hash = hash.substr(0, hash.length-1);
				hash = hash.replace(/"/ig,'\'');
				// hash = hash.replace(/=/ig,'":"');
				hash = hash.replace(/=/ig,'":"');
				hash = hash.replace(/&/ig,'","');
				hash += '"';
				hash = "{\""+ hash + "}";
				var o = S.JSON.parse(hash);
				*/
				var o = S.unparam(hash);
				return o;
			}
		},
			
		_globalEval : function(data){
			if (data && /\S/.test(data)) {
				var head = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0],
					script = document.createElement('script');

				// 神奇的支持所有的浏览器
				script.text = data;

				head.insertBefore(script, head.firstChild);
				setTimeout(function(){
					head.removeChild(script);
				},1);
			}
		},
		// 一段杂乱的html片段，执行其中的script脚本
		// edit by donghan 
		// 增加功能：在匹配script标签时，忽略模板，避免eval报错
		execScript:function(html){
			var self = this;
			var re_script = new RegExp(/<script([^>]*)>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/ig); // 防止过滤错误

			var hd = S.one('head').getDOMNode(),
				match, attrs, srcMatch, charsetMatch,
				t, s, text,
				temp = /\stype="(javascript)|(text)\/template"/i,
				RE_SCRIPT_SRC = /\ssrc=(['"])(.*?)\1/i,
				RE_SCRIPT_CHARSET = /\scharset=(['"])(.*?)\1/i;

			re_script.lastIndex = 0;
			while ((match = re_script.exec(html))) {
				attrs = match[1];
				srcMatch = attrs ? attrs.match(RE_SCRIPT_SRC) : false;
				// 如果script标示为模板
				if (attrs.match(temp)) {
					continue;	
				}

				// 通过src抓取到脚本
				if (srcMatch && srcMatch[2]) {
					s = document.createElement('script');
					s.src = srcMatch[2];
					// 设置编码类型
					if ((charsetMatch = attrs.match(RE_SCRIPT_CHARSET)) && charsetMatch[2]) {
						s.charset = charsetMatch[2];
					}
					s.async = true; // hack gecko
					hd.appendChild(s);
				}
				// 如果是内联脚本
				else if ((text = match[2]) && text.length > 0) {
					self._globalEval(text);
				}
			}
		},
		// 判断当前环境是否是daily环境
		isDaily:function(){
			var self = this;
			if(/daily\.taobao\.net/.test(window.location.hostname)){
				return true;
			}else{
				return false;
			}
		}
		
	});

},{
	requires:[
		'node',
		'sizzle',
		'json',
		'uri'
	]	
});
