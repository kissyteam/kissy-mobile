<?php

//url?type=doc&name=app

// 请求类型
$type = $_GET['type'];

// 组件名称
$name = $_GET['name'];

if($type == "doc"){
	header("location: ".getdoc($name));
	die();
}

if($type == "demo"){
	header("location: ".getdemo($name));
	die();
}

function getversion($name){
	$version = '1.0';
	$filename = 'mobile/'.$name.'/abc.json';
	if(file_exists($filename)){
		$R_files[] = file_get_contents($filename);
		$json = json_decode($R_files[0]);
		return $json->version;
	} else {
		return $version;
	}
}

function getdemo($name){
	$version = getversion($name);
	$demofile = "mobile/".$name."/".$version."/demo/";
	return $demofile;
}

function getdoc($name){
	$version = getversion($name);
	$docfile = "mobile/".$name."/".$version."/guide/index.md";
	if(file_exists($docfile)){
		$dirc = "/markdown.php?".$docfile;
	} else {
		$dirc = "/markdown.php?mobile/".$name."/README.md";
	}
	return $dirc;
}


?>
