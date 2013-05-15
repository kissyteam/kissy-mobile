KISSY.add('mobile/app/1.2/util',function(S){

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
				var hash = url.split('#')[1];
				// Uri.getFragment() 得到的是decode之后的？why?
				// var hash = new S.Uri(url).getFragment();
				if(hash === '')return {};
				try{
					if(hash[hash.length-1] == '&')hash = hash.substr(0, hash.length-1);
					hash = hash.replace(/"/ig,'\'');
					// hash = hash.replace(/=/ig,'":"');
					hash = hash.replace(/=/ig,'":"');
					hash = hash.replace(/&/ig,'","');
					hash += '"';
					hash = "{\""+ hash + "}";
					var o = S.JSON.parse(hash);
				}catch(e){
					var o = S.unparam(hash);
				}
				// S.unparam() 得到的也是decode之后的？why？
				// var o = S.unparam(hash);
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
