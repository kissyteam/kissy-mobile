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
	<script src="h4.js" type="text/javascript"></script><!--H4带上这个，其他不用带-->
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
Host.set_browser_title('AAAA');
Host.set_back();
</script>
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

<script>

	KISSY.config({
		packages:[
			{
				name:"union",
				tag:"201112299",
				path:"http://a.tbcdn.cn/apps/ks/i", 
				debug:true,
				charset:"utf-8"
			}
		]
	});


	KISSY.use('mobile/app/1.0/,union/fixedbar',function(S,AppFramwork,FixedBar){


		AppFramwork.startup(function(){
			/*
			Host.init_navbar(function(){
				Host.show_navbar(true);
				Host.set_browser_title('页面1');
				Host.set_back(false);
			});
			 */
			var app = this;

			S.log(app.get);

			S.log(app.get('storage').get('aaa'));
		
			app.get('storage').set('aaa',1);

			new FixedBar('#test',{
				top:20,
				floor:500
			});
			
		});

		AppFramwork.ready(function(){
			S.log('page ready');	
		});

		AppFramwork.teardown(function(data){
		});
		
	});


</script>
<!--kdk}}-->


</body>
</html>
