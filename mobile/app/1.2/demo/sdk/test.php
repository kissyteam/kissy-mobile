<!DOCTYPE HTML>
<!--[if lt IE 7]><html class="no-js ie ie6 lte9 lte8 lte7"> <![endif]-->
<!--[if IE 7]><html class="no-js ie ie7 lte9 lte8 lte7"> <![endif]-->
<!--[if IE 8]><html class="no-js ie ie8 lte9 lte8"> <![endif]-->
<!--[if IE 9]><html class="no-js ie ie9 lte9"> <![endif]-->
<!--[if gt IE 9]><html class="no-js"><![endif]-->
<!--[if !IE]><!--><html><!--<![endif]-->
<head>
	<meta charset="UTF-8">
	<title></title>
	<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
	<script type="text/javascript" src="http://a.tbcdn.cn/s/kissy/1.3.0/kissy.js"></script>
	<meta name="format-detection" content="telephone=no" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<link rel="stylesheet" href="assets/bootstrap.css" />
	<link rel="stylesheet" href="assets/tbh5v0.css" />
	<script src="../../../../sdk-h4/1.0/index.js" type="text/javascript"></script>
	<script>
		// var MC = new M_Client('Android_Bridge');
		// Android 、ios 里带上这一句，单页面带上h4-sdk.js，H5框架带上h5-sdk.js
	</script>
</head>
<body>
<!--kdk{{-->
<?php
	if((isset($_GET['client_nav']) && $_GET['client_nav'] == 'true') || !isset($_GET['client_nav'])){
		include("include/top-nav.php");
	}
?>
<script>
Host.set_browser_title('TEST');
Host.set_back("true");
</script>
<div class="navbar navbar-inverse">
	<p>Demo</p>
	<p>测试</p>
</div>
<style>
	#id {
		-webkit-backface-visibility:hidden;
	}
</style>

<div id="id">
	<p><a class="btn btn-primary" onclick="Host.open('http://www.taobao.com')" href="javascript:void(0)">打开一个外域url(http://www.taobao.com)</a></p>
	<p><a class="btn btn-primary" onclick="Host.open('b.php')" href="javascript:void(0)">打开本域相对路径url(a.php)</a></p>
	<p><a class="btn btn-primary" onclick="Host.open('b.php',{a:1,b:2})" href="javascript:void(0)">打开相对路径Url，带Hash参数</a></p>
	<p><a class="btn btn-primary" onclick="Host.open('b.php',{},function(){alert('ok');})" href="javascript:void(0)">打开url+callback(忽略)</a></p>
	<p><a class="btn btn-primary" onclick="Host.back()" href="javascript:void(0)">回退</a></p>
	<p><a class="btn btn-primary" onclick="Host.back(function(){alert('ok');})" href="javascript:void(0)">回退+callback(忽略)</a></p>
	<p><a class="btn btn-primary" onclick="Host.set_browser_title('ABC')" href="javascript:void(0)">set_browser_title('ABC')</a></p>
	<p><a class="btn btn-primary" onclick="Host.set_back()" href="javascript:void(0)">设置回退按钮 set_back()</a></p>
	<p><a class="btn btn-primary" onclick="Host.set_back(true)" href="javascript:void(0)">设置回退按钮 set_back(true)</a></p>
	<p><a class="btn btn-primary" onclick="Host.set_back(false)" href="javascript:void(0)">隐藏回退按钮 set_back(false)</a></p>
	<p><a class="btn btn-primary" onclick="Host.set_icon('http://img04.taobaocdn.com/tps/i4/T17Qt6XkXXXXXXXXXX-70-30.png',function(){alert('ok');})" href="javascript:void(0)">set_icon(img,callback)</a></p>
	<p><a class="btn btn-primary" onclick="Host.open('test.php?client_nav=false')" href="javascript:void(0)">不显示H5导航</a></p>
	<p><a href="b.php?a=1&b=2">普通链接跳转</a></p>
<p>除了icon之外，其他地方的callback不考虑</p>

<p>
App 给H5 传参数，指定环境:
<pre><code>url?client_type=ios</code></pre>
<pre><code>url?client_type=android</code></pre>
<pre><code>url?client_type=pc</code></pre>
</p>

<p>
App 给H5 传参数，是否显示H5导航，不传参，或client_nav=true，都显示H5导航:
<pre><code>url?client_nav=false</code></pre>
</p>

<p>
Android:
<pre><code>mWebView.addJavascriptInterface(mJSInterface, "Android_Bridge");</code></pre>
</p>

<p>
JavaScript：
<pre><code>
// Host.open()
Host.pushBack('open',{
	url:url,
	param:param,
	callback:callback
});

// Host.back()
Host.pushBack('back',{
	callback:callback
});

// Host.set_browser_title()
Host.pushBack('set_browser_title',{
	title:title
});

// Host.set_back(true)
Host.pushBack('set_back',{
	flag:flag
});

// Host.set_icon()
Host.pushBack('set_icon',{
	img:img,
	callback:callback
});
</code></pre></p>
</div>
<script>

	// 全局默认有一个App，这个App可以是H5-sdk提供的，也可以是native提供的

	KISSY.use('mobile/app/1.2/',function(S,AppFramwork){

		AppFramwork.startup(function(){
			console.info('page startup');	
			/*
			S.one('#id').css({
				height:S.DOM.viewportHeight() + 'px',
				overflow:'hidden'
			});
			 */

			var app = this;

			/*
			S.log(app.get);

			S.log(app.get('storage').get('aaa'));
		
			app.get('storage').set('aaa',1);
			 */
			
		});

		AppFramwork.ready(function(){
			/*
			S.one('#id').css({
				height:'auto'
			});
			 */

		});

		AppFramwork.teardown(function(data){
			console.log('test teardown');
		});
		
	});


</script>
<!--kdk}}-->


</body>
</html>
