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
<div class="navbar navbar-inverse">
	<div class="navbar-inner">
		<div class="container">
			<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</a>
			<a class="brand" href="#">Project name</a>
			<div class="nav-collapse collapse">
				<ul class="nav">
					<li class="active"><a href="javascript:void(0);" onclick="Host.back();">上一步</a></li>
					<li><a href="javascript:void(0);" onclick="Host.open('c.php');">下一步</a></li>
				</ul>
			</div><!--/.nav-collapse -->
		</div>
	</div>
</div>

<style>
	.container {
		width:100%;
	}
</style>
<div class="container">
	<div class="row-fluid">
		<span class="span12">
		
		
			<div class="J_MSG" >
				loading
			</div>
			<ul class="nav nav-list">
				<li class="nav-header">操作列表</li>
				<li class="active"><a href="" onclick="Host.back()">Home</a></li>
				<li><a href="javascript:Host.open('c.php');" data-param="aaa=234">进入选项c.html(填写登录信息)</a></li>
				<li><a href="javascript:void(0);" onclick="history.back();">执行history.back()</a></li>
				<li class="nav-header">history.back()有可能返回下一帧，而非上一帧</li>
				<li><a href="http://m.taobao.com" target=_blank>打开新页面m.taobao.com</a></li>
				<li><a href="http://m.taobao.com" target="top">本页刷新打开m.taobao.com</a></li>
				<li><a href="javascript:void(0);" onclick="window.location.reload();">本页强制刷新</a></li>
			</ul>
		
		
		</span>
<?php
//	sleep(1);

var_dump($_POST);
?>



	</div>
</div>
<textarea id="tmp" style="display:none;">
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
<p>增加行数</p>
</textarea>
<script>

	Host.set_browser_title('页面2');
	Host.set_back(true);

	KISSY.use('mobile/app/1.2/',function(S,MS){

		S.one('title').html('本页的title');
		
		MS.startup(function(data){

			var app = this;

			var str = '这里显示下一步的操作结果，请进入下一页面重新操作';

			S.log(app.get('storage').get('aaa'));
			app.get('storage').set('aaa',2);

			if(data){
				str = '姓名：'+ data.name +', 性别：'+ data.gender;
			}

			app.get('page').one('.J_MSG').html(str);

		});

		MS.ready(function(){
			var app = this;
			// app.slide.renderLazyData(S.one('#tmp'));
		});
		
	});

</script>
<!--kdk}}-->
</body>
</html>
