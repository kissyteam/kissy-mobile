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
</head>
<body>
<!--kdk{{-->
<?php
	//if((isset($_GET['client_type']) && $_GET['client_type'] == 'pc') || !isset($_GET['client_type'])){
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
					<li class="active"><a href="javascript:void(0);" onclick="history.back();">上一步</a></li>
				</ul>
			</div><!--/.nav-collapse -->
		</div>
	</div>
</div>
<style>
	.form-signin {
		max-width: 300px;
		padding: 19px 29px 29px;
		margin: 0 auto 20px;
		background-color: #fff;
		border: 1px solid #e5e5e5;
		-webkit-border-radius: 5px;
		-moz-border-radius: 5px;
		border-radius: 5px;
		-webkit-box-shadow: 0 1px 2px rgba(0,0,0,.05);
		-moz-box-shadow: 0 1px 2px rgba(0,0,0,.05);
		box-shadow: 0 1px 2px rgba(0,0,0,.05);
	}
	.form-signin .form-signin-heading,
	.form-signin .checkbox {
		margin-bottom: 10px;
	}
	.form-signin input[type="text"],
	.form-signin input[type="password"] {
		font-size: 16px;
		height: auto;
		margin-bottom: 15px;
		padding: 7px 9px;
	}
	.container {
		width:100%;
	}

</style>

<div class="container">
	<form class="form-signin">
		<h2 class="form-signin-heading">填写表格</h2>
		<input type="text" class="input-block-level J_name" placeholder="姓名">
		<input type="text" class="input-block-level J_gender" placeholder="性别">
		<label class="checkbox">
			<input type="checkbox" value="remember-me"> Remember me
		</label>
		<button class="btn btn-large btn-primary" type="button">填写完成</button>
	</form>
</div>
<script>
	KISSY.use('mobile/app/1.2/',function(S,MS){
		Host.set_browser_title('页面3');
		Host.set_back(true);

		MS.startup(function(){
			var app = this;

			var form = app.get('page').one('form');

			form.one('button').on('click',function(e){

				e.halt();

				if(S.trim(form.one('.J_name').val()) == ''){
					alert('请填写姓名');
					return false;
				}

				if(S.trim(form.one('.J_gender').val()) == ''){
					alert('请填写性别');
					return false;
				}

				// 单页中不起作用
				app.postback({
					// path:'mb/b.html',
					data:{
						name:form.one('.J_name').val(),
						gender:form.one('.J_gender').val()
					}
				});

				return;
				app.back({
					name:form.one('.J_name').val(),
					gender:form.one('.J_gender').val()
				});
			});
			
			
		});

		MS.teardown(function(){
			var app = this;
		});
		
	});
</script>
<!--kdk}}-->

</body>
</html>
