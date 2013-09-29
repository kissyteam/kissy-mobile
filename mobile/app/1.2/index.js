/**
 * @file index.js
 * @brief 
 * @author jayli, bachi@taobao.com
 * @version 
 * @date 2012-12-18
 */

/*jshint smarttabs:true,browser:true,devel:true,sub:true,evil:true */

KISSY.add("mobile/app/1.2/index", function (S,Slide) {

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
		hideURIbar:{
			value:false
		},
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
		errorAlert:{
			// Ajax 出错时是否提示
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
			if(this.APP.isSinglePage()){
				S.Event.on(window,'unload',cb);
			}
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
				if(this.APP.get('page').attr('data-startup') == 'true'){
					cb.call(this.APP);
				}
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
				if(this.APP.get('page').attr('data-ready') == 'true'){
					cb.call(this.APP);
				}
				this.READY[k].push(cb);
			}
		},
		teardown:function(cb){
			if(!MS.APP.slide){
				// cb.call(this.APP);
				S.Event.on(window,'beforeunload',cb);
			}else{
				var k = this.APP.get('viewpath');
				/*
				if(!S.isFunction(this.TEARDOWN[k])){
					this.TEARDOWN[k] = cb;
				}
				*/
				this.TEARDOWN[encodeURIComponent(k)].push(cb);
			}
		},
		// 清空当前view的startup,ready,teardown
		cleanup:function(){
			var k = this.APP.get('viewpath');
			this.STARTUP[k] = [];
			this.READY[k] = [];
			this.TEARDOWN[encodeURIComponent(k)] = [];
		},
		/**
		 * 查询当前视图节点所对应URL中hash参数值或search参数值
		 * 应用场景：
		 * --------不同视图中大部分业务逻辑相同又存在差异性，通常会传入不同的hash key加以区分
		 * @name queryKey
		 * @param name {string} 查询的key值 
		 * @param scope {string} 查询key的范围，可选值有search、hash，分别代表location的search和hash，默认值为search
		 * @returns 返回对应的value
		 * @type string | null
		 * @author 栋寒(zhenn)
		 * @time 2013-04-11
		 */
		queryKey: function(name , scope) {
			scope = ((typeof scope === 'undefined') || (scope !== 'hash')) ? 'search' : 'hash';
			var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)','i'),
				r = location[scope].substr(1).match(reg);
			if (r != null) {
				return unescape(r[2]);
			}
			return null;
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
					easing:'easeBoth',
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
		// 作为单页面引用
		isSinglePage:function(){
			if(this.slide){
				return false;
			} else {
				return true;
			}
		},
		// 作为多页面框架引用
		isMultiplePage:function(){
			return !this.isSinglePage();
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

			// 执行过后就在dom节点上打标记
			self.get('page').attr('data-ready','true');

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

			// 执行过后就在dom节点上打标记
			self.get('page').attr('data-startup','true');

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
				// cb.call(self[location.hash],param) ?不可取
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
			var cb = self.MS.TEARDOWN[encodeURIComponent(path)];
			self.rememberPosition(path);

			if(S.isArray(cb)){
				S.each(cb,function(v,k){
					// setTimeout(function(){
						v.call(self,self);
					// },0);
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
				self.set('viewpath',decodeURIComponent(S.getHash()['viewpath']));
			}

			if(!S.isNull(self.get('initPostData'))){
				self.__post = self.get('initPostData');
			}

			// 进去时，viewpath是未uriencode的
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

			self.set('viewpath',decodeURIComponent(S.getHash()['viewpath']));

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

			self.set('viewpath',decodeURIComponent(S.getHash()['viewpath']));

		},
		// 调用Loading
		loading:function(){
			var self = this;
			var loading = S.one('#MS-loading');
			var loadingMask = S.one('#MS-loading-mask');

			var loadingHtml = [
					'<div id="MS-loading" style="display:none">',
					'<img src="http://img04.taobaocdn.com/tps/i4/T1aIsKXmReXXa679Pe-40-40.gif" />',
					'</div>'
				].join('');

			var loadingMaskHtml = '<div id="MS-loading-mask"></div>';

			loading = loading ? loading:
				S.Node(loadingHtml).appendTo('body');

			loadingMask = loadingMask ? loadingMask:
				S.Node(loadingMaskHtml).appendTo('body');

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
				opacity:0.7,
				'z-index':101
			});
			loadingMask.css({
				'display':'none',
				position:'fixed',
				background:'white',
				opacity:0,
				height:S.DOM.viewportHeight() + 'px',
				width:S.DOM.viewportWidth() + 'px',
				'z-index':100,
				top:'0px'
			});

			// 如果加载太快，少于350毫秒，则不显示loading
			// 加载的慢才显示loading
			self.loadingTimer = setTimeout(function(){
				if(!self.loadingTimer){
					return;
				}
				if(self.closeLoadingTimer){
					clearTimeout(self.closeLoadingTimer);
					self.closeLoadingTimer = null;
				}
				loading.css({
					display:'block'	
				});
				loadingMask.css({
					display:'block'	
				});
				// 超时隐藏菊花
				self.closeLoadingTimer = setTimeout(function(){
					self.closeLoading();
					self.closeLoadingTimer = null;
				},5000);
			},350);

			return self;

		},
		// 关闭 loading 层
		closeLoading:function(){
			var self = this;

			if(self.loadingTimer){
				clearTimeout(self.loadingTimer);
				self.loadingTimer = null;
			}
			
			var loading = S.one('#MS-loading');
			var loadingMask = S.one('#MS-loading-mask');

			if(loading){
				loading.css({
					display:'none'	
				});
				loadingMask.css({
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
		// path一定是未encode的值
		setRouteHash:function(path,param){
			var self = this;

			var path = decodeURIComponent(path);

			self.set('viewpath',(path));

			if(S.isUndefined(param)){
				param = '';
			}

			if(S.isString(param)){
				param = S.unparam(param);
			}

			// hisurl中的viewpath 是encode后的
			var hisurl = self.formatUrlTail(path,S.getHash());

			// TODO !!! setHash有问题，如果设置的是
			// url#viewpath=aadsf?a=3&b=5
			// 就搞不清楚&b=5是谁的了
			var state = {
				level:self.get('signet').level + 1,
				viewpath:path,
				hisurl:S.setHash(hisurl,param),
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
					// 获取slide方向
					var	dir = el.attr('dir');
					if(path === ''){
						return true;
					}
					e.preventDefault();
					// added by 栋寒
					// 增加超链接上定义slide方向
					// 如果dir不是back\forward之一，则执行默认进入操作
					// <a href="url" dir="back"></a>
					// <a href="url" dir="forward"></a>
					// eidt by 栋寒(zhenn) - 2013-4-13
					if (dir === 'back') {
						self.back(path , param);
					} else if (dir === 'forward') {
						self.forward(path , param);	
					} else {
						self.setRouteHash(path , param);
					}
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

			var path = decodeURIComponent(path);

			var olevel = self.get('signet').level;
			// 确保执行formatUriTail时，一定是未uriencode的值
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

			if(self.isMultiplePage() && self.callTeardown(self.get('signet').viewpath) === false){
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

			self.set('viewpath',decodeURIComponent(S.getHash()['viewpath']));

			return this;
		},


		// 前进时需要给定path
		// path 一定是urlendoce之前的
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
			// Android下暂时不考虑，若考虑，开启此句
			if(S.UA.android && S.UA.android < 4.3){
				self._androidHistoryMan();
			}
			*/
			path = encodeURIComponent(path);
			/**
			 * TODO:执行下一帧的动作必须要在hashchange之前，但next中cleanup和callstartup又依赖hashchange
			 * 暂时用next中的延时来实现，待改进
			 */
			self.next.apply(self,[path,param,callback]);

			var state = self.recordSignet(1,path);
			his.pushState(state,"",S.setHash(state.hisurl,param));
			self.set('viewpath',decodeURIComponent(S.getHash()['viewpath']));
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
				if(self.isMultiplePage() && self.callTeardown(self.get('signet').viewpath) === false){
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
					alert(self.slide.animwrap.height());
					// setTimeout(function(){
						self.callReady();
					// },0);
				});
				self.set('page',self.slide.getCurrentPannel());
				// setTimeout(function(){
					self.callStartup();
				// },0);
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
				if(self.isMultiplePage() && self.callTeardown(self.get('signet').viewpath) === false){
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
					//setTimeout(function(){
						self.callReady();
					//},0);
				});
				self.set('page',self.slide.getCurrentPannel());
				//setTimeout(function(){
					self.callStartup();
				//},0);
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
					setTimeout(function(){
						self.MS.cleanup();
						S.execScript(html);
						// TODO: 重新考虑，是否在prev动画执行完成之后调用initPageStorage和callStartup
						// TODO：切换之前作执行，有何风险
						// setTimeout(function(){
							self.initPageStorage();
							self.callStartup();
						// },0);
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
							that.removeLast();
							self.slide.animwrap.css({
								'-webkit-transform':'none'
							});
							setTimeout(function(){
								self.callReady();
							},0);
						});
					},150);
					break;
				case 'next':
					// TODO: 只有异步加载新页面时，才会修正进入view的marginTop
					console.info('next');
					self._fixScrollTopBefore(el,prel);
					self.slide.add(el);
					/**
					 * 增加settimeout的原因：
					 * 		手动forward和back的时候，hashchange是在此处之后才运行
					 * 		而cleanup()和callstartup()都依赖于hashchange后的值
					 * 		因此
					 * 			1，通过hashchange驱动的跳转永远正确
					 * 			2，通过forward和back调用必须等待hashchange后执行cleanup和callstartup
					 * 		等待时间粗设为150ms
					 */
					setTimeout(function(){
						self.MS.cleanup();
						S.execScript(html);
						//setTimeout(function(){
							self.initPageStorage();
							self.callStartup();
						//},0);
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
							if(self.get('containerHeighTimmer')){
								self.slide.addHeightTimmer();
							}
							self._fixScrollTopAfter(el,prel,function(){
								setTimeout(function(){
									self.callReady();
								},0);
							});
							self.slide.animwrap.css({
								'-webkit-transform':'none'
							});
						});
					},150);

					break;
				case 'none':
					self.slide.add(el,self.slide.currentTab);
					self.callDestroy();
					self.MS.cleanup();
					S.execScript(html);
					// setTimeout(function(){
						self.initPageStorage();
					// },0);
					callback.call(self.slide,self.slide);
					self.slide.removeLast();
					// self.slide.next(callback);
					self.slide.animwrap.css({
						'-webkit-transform':'none'
					});
					//setTimeout(function(){
						self.callStartup();
						self.callReady();
					//},0);
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
			console.log('1');

			if(self.__post){
				S.io.post(fullpath,self.__post,handleHTML);
				delete self.__post;
			}else if(self.get('pageCache') && !S.isUndefined(self.MS.PAGECACHE[path])){
				renderPage(self.MS.PAGECACHE[path]);
			}else {
				//S.io.get(fullpath,handleHTML);
				S.io({
					url:fullpath,
					success:handleHTML,
					error:function(){
						if(self.get('errorAlert')){
							alert('页面请求出错！');
						}
						self.closeLoading();
					}
				});
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
		_fixScrollTopAfter: function(el,prel,callback){
			var self = this;
			if(self.get('animWrapperAutoHeightSetting')){
				callback();
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
				});

				if(self.get('containerHeighTimmer')){
					self.slide.addHeightTimmer();
				}
				if(self.get('hideURIbar')){
					self.slide.hideURIbar();
				}
				callback();
			};

			// TODO 2013-05-14 清除transform，才能让positon:fixed起作用
			// 考虑要不要加
			self.slide.animwrap.css({
				'-webkit-transform':'none'
			});

			// Info: 必须将子节点挂载到body下，position:fixed 才起作用,不知道原因
			el.css({
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
		},

		// 配合iScroll使用时，增加一个页面的全尺寸高度的占位
		initPlaceholder:function(){
			var self = this;
			if(!self.slide){
				return;
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

