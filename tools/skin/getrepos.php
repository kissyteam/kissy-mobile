<?php

$f = $_SERVER['QUERY_STRING'];

$R_files[] = file_get_contents($f);

echo join("\n",$R_files);

?>
