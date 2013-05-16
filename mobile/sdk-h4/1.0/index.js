window['S'] = KISSY;

KISSY.config({
	packages:[
		{
			name:"mobile",
			tag:"201112299",
			path:"http://a.tbcdn.cn/s/kissy/mobile",
			// path:"http://a.zoojs.org/jayli/kissy-mobile/mobile",
			ignorePackageNameInUri:true,
			debug:true,
			charset:"utf-8"
		}
	]
});

(function() {

	/*
	 * 给出终端类型
	 * url?client_type=
	 * 		ios|android|pc|h5
	 *
	 * 是否要显示nav
	 * url?client_nav=
	 * 		true|false
	 *
	 **/

	/*
	 * Adaptor for pc/android/ios
	 **/

	/*
	 * Wrapper for Adaptor
	 **/
    
    var M_Client = function() {
        this.init.apply(this, arguments);
    };

    M_Client.prototype = {
        init: function(bridgeName) {
            var that = this;
            that.platform = that.getRequestParam(window.location.search, 'client_type') || 'pc';
			that.client_nav = that.getRequestParam(window.location.search, 'client_nav') || 'true';
			that.client_type = that.platform;
            that.bridgeName = bridgeName || 'Android_Bridge';
            that.bridge = window[that.bridgeName];

            if(that.platform === 'ios') {
                S.ready(function() {
                    that.buildProxy();
                });
            }
        },

        buildProxy: function() {
            var that = this;
            var mClientProxy = document.querySelector("#J_MClientProxy");
            var IFRAME ='<iframe id="J_MClientProxy" class="hidden" style="width:0;height:0;opacity:0;display:none;" src="native://"></iframe>';

            if(mClientProxy) {
                return;
            }
            
            //TODO h4.js放在head里，此时body还未渲染
            mClientProxy = S.one(IFRAME);
            S.one('body').append(mClientProxy);
            that.mClientProxy = mClientProxy;
        },

        pushBack: function(host, data) {
            var that = this;
            var uri = 'native://' + host + '?data=';
            var callbackName;

			if(that.platform === 'pc'){
				that.bridge = that.bridge || window[that.bridgeName];
				that.bridge[host].call(this,data);
				return;
			}

            for(var i in data) {
                if(data.hasOwnProperty(i)) {
                    if(typeof(data[i]) === 'function') {
                        callbackName = 'M_Client_Callbacks_' + host + '_' + new Date().getTime() + '_' + parseInt(Math.random() * 1000000);

                        window[callbackName] = (function(cb, callbackName) {
                            return function() {
                                cb.apply(this, arguments);
                                delete window[callbackName];
                            };
                        })(data[i], callbackName);

                        data[i] = callbackName;
                    }
                }
            }

            if(that.platform === 'android') {
                //alert('回调客户端命令：' + host);
                that.bridge && that.bridge[host] && that.bridge[host](JSON.stringify(data));
                //console.info('回调客户端命令：%s', host);
                //console.info('回传数据：%s', JSON.stringify(data));
                return;
            }

            uri += encodeURIComponent(JSON.stringify(data));
            that.mClientProxy.attr('src', uri);
            //console.info('回调客户端命令：%s', host);
            //console.info('回传数据：%s', JSON.stringify(data));
        },

        getRequestParam: function(uri, param) {
            var value = uri.match(new RegExp('[\?\&]' + param + '=([^\&]*)(\&?)', 'i'));
            return value ? value[1] : value;
        },

		// rewrite function
		// 给H5、H4页面调用的方法
		open: function(url,param,callback){
			var that = this;
			url = that.wrapUrl(url);
			if(that.platform == 'pc'){
				var param_str = S.param(param);
				if(url.indexOf('http://') < 0){
					window.location.href = new S.Uri(App.get('basepath') + url).setFragment(S.param(param));
				}else{
					window.location.href = new S.Uri(url).setFragment(S.param(param));
				}
			}else{
				if(typeof param == 'function'){
					callback = param;
					param = {};
				}
				if(typeof callback == 'undefined'){
					callback = new Function;
				}
				that.pushBack('open',{
					url:url,
					param:param,
					callback:callback
				});
			}
		},
		back: function(callback){
			var that = this;
			if(that.platform == 'pc'){
				window.history.back();
			}else{
				if(typeof callback == 'undefined'){
					callback = new Function;
				}
				that.pushBack('back',{
					callback:callback
				});
			}
		},
		set_browser_title : function(title){
			var that = this;
			if(that.platform == 'pc'){
			    try {
				    document.getElementsByTagName('title')[0].innerHTML = title;
				}catch(e){
				    // for Android 默认浏览器
				}
				if(that.nav_exist()){
					S.one('.J-top-nav').one('span').html(title);
				}
			}else{
				that.pushBack('set_browser_title',{
					title:title	
				});
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
			if(that.platform == 'pc'){
				if(!that.nav_exist()){
					return;
				}
				if(flag === false){
					style = 'hidden';
				} else {
					style = 'visible';
				}
				S.one('.J-top-nav').one('.u-back').css({
					visibility:	style
				});
			} else {
				that.pushBack('set_back',{
					flag: flag	
				});
			}
		},
		// set_icon('a.png',callback)
		set_icon: function(img,callback){
			var that = this;
			if(typeof callback == 'undefined'){
				callback = new Function;
			}

			if(that.platform == 'pc'){
				if(!that.nav_exist()){
					return;
				}
				var ta = S.Node('<a href="javascript:void(0);"><img src="'+img+'" /></a>');
				S.one('.J-top-nav').one('.u-icon').empty().append(ta).css({
					visibility:'visible'	
				});
				ta.on(S.UA.mobile ? 'tap' : 'click' ,callback);
			} else {
				that.pushBack('set_icon',{
					img:img,
					callback:callback
				});
			}
		},


		// Utils
		nav_exist: function(){
			var that = this;
			return !!S.one('.J-top-nav');
		},
		// tap 事件的委托
		// <a target=top>链接不会被委托</a>
		// <a href="javascript:..">不会被委托</a>
		tapDelegate:function(){
			var that = this;
			S.Event.delegate(document,S.UA.mobile ? 'tap' : 'click','a',function(e){
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

    // this.M_Client = M_Client;

	this.Host = new M_Client('Android_Bridge'); // SDK是由h4、andorid、ios实现的一个全局对象

	this.App = {};

	KISSY.use('mobile/app/1.2/',function(S,AppFramwork){
		App = AppFramwork({
			// basepath 取文件所在的根路径
			basepath:(function(path){
				if(/\/$/.test(path)){
					return path;
				} else {
					return path.replace(/\/[^\/]+$/,'')
				}
			})(window.location.href),
			tapTrigger:'.not-available'
		});

		S.ready(function(S){
			Host.tapDelegate();
		});
	});


}).call(this);


