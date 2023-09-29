<?php
// update log data with datetime and ip

$logname = isset($_GET['logname']) ? $_GET['logname'] : 'ip.dat';

$ip = $_SERVER['REMOTE_ADDR'];
$log_flg = false;

/* 
can either not log the ip (mine, for instance) or exit program (not useful with ajax call)
if ($ip == "159.253.143.53" || $ip == "95.65.30.29" || substr($ip,0,9) == "69.58.178") exit;
if ($ip == "74.123.20.27" || $ip == "127.0.0.1") $log_flg = false;
*/


if ($log_flg)
{
	$logdata = date("n-j-y H:i")."    ".$ip."\n";
	file_put_contents($logname, $logdata, FILE_APPEND);
}

?>