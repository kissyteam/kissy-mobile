<?php
	$path = str_replace('/lottery/h5/', '', $_GET['file']);
	//如果访问manifest文件
	if(stripos($path, '.manifest') > 0){
		echo file_get_contents(str_replace('.manifest', '.vm', $path));
		return;
	}
	//html访问
	echo file_get_contents(str_replace('.html', '.vm', $path));
?>