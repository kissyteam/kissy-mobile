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
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
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
<style>
/*
#iscroll-wrapper {
	position:absolute; 
	z-index:1;
	top:0px;
	width:100%;
	bottom:0px;
}
*/
</style>
<?php
	if((isset($_GET['client_nav']) && $_GET['client_nav'] == 'true') || !isset($_GET['client_nav'])){
		include("include/top-nav.php");
		echo "<style>#iscroll-wrapper {top: 44px;}</style>";
	}
?>
<script>
Host.set_browser_title('AAAA');
Host.set_back();
</script>


<div id="iscroll-wrapper"><!--iscroll包裹器-->
<div id="scroller">

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
					<li class="active"><a href="#">Home</a></li>
					<li><a href="#about">About</a></li>
					<li><a href="#contact">Contact</a></li>
				</ul>
			</div><!--/.nav-collapse -->
		</div>
	</div>
</div>
<style>
	#test {
		top:100px;
		background:yellow;
		width:100%;
	}
	#fixed-wrapper{
		height:20px;
	}
</style>
<div id="fixed-wrapper">
	<div id="test">
		fixed
	</div>
</div>

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




<div class="container-fluid">

	<h1>Hello, world!</h1>
	<p>This is a template for a simple marketing or informational website. It includes a large callout called the hero unit and three supporting pieces of content. Use it as a starting point to create something more unique.</p>
	<p><a class="btn btn-primary btn-large" href="test.php">Learn more &raquo;</a></p>
	<h1>Super awesome marketing speak!</h1>
	<p class="lead">Cras justo odio, dapibus ac facilisis in, egestas eget quam. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
	<a class="btn btn-large btn-success" href="javascript:void(0);" onclick="Host.open('test.php?a=1&b=2',{c:3,d:4})">GoTo Next Page</a>
</div>

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

</div><!--/scroller-->
</div><!--/wrapper-->
<!--页面全尺寸的占位符-->
<div class="J-placeholder"></div>

<script>

	KISSY.use('mobile/app/1.2/,mobile/iscroll/',function(S,AppFramwork,iScroll){

		var widthIscroll = false;


		var t = new S.Uri(window.location.href).getQuery().get('iscroll');
		if(!S.isUndefined(t)){
			widthIscroll = true;
		}


		var initIscroll = function(){

		};

		AppFramwork.includeOnce(function(){
			var app = this;
			if(!widthIscroll){
				return;
			}
			if(app.isSinglePage()){
				return;
			}
			app.resetPageHeight = function(){
				app.get('page').one('.J-placeholder').css({
					height:(S.DOM.viewportHeight() - 44) + 'px'
				});
				app.slide.getCurrentPannel().css({
					height:S.DOM.viewportHeight() + 'px'
				});
			}
			// 用于恢复历史高度
			app.get('storage').set('scrollY','0');
			S.Event.on(window,'resize',app.resetPageHeight);
		});

		AppFramwork.startup(function(){
			if(!widthIscroll){
				return;
			}
			if(widthIscroll){
				if(Host.nav_exist()){
					var top = '44px';
				}else {
					var top = '0px';
				}
				S.one('#iscroll-wrapper').css({
					position:'absolute',
					'z-index':1,
					top:top,
					width:'100%',
					bottom:'0px'
				});
			}

			var app = this;

			if(this.isMultiplePage()){
				this.resetPageHeight();
			}

			// {{
			// 从iscrolldemo中抄过来的代码
			function loaded() {
				if(!S.isUndefined(S.myScroll)){
					S.myScroll.destroy();
				}
				S.myScroll = new iScroll('iscroll-wrapper');
			}

			// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			S.Event.on(document,'touchmove',function(e){
				e.preventDefault();
			});

			S.ready(function(){
				loaded();
				// 恢复历史高度
				S.myScroll.scrollTo(0,Number(app.get('storage').get('scrollY')),0);
			});
			// }}

		});

		AppFramwork.teardown(function(data){
			if(!widthIscroll){
				return;
			}
			S.Event.detach(document,'touchmove');
			// 退出时记录离开时的iscroll高度
			this.get('storage').set('scrollY',String(S.myScroll.y));
		});
	});


</script>
<!--kdk}}-->


</body>
</html>
