<?php

$timeOut = 1200; //20 Min

if (isset($_SESSION['last_activity'])) {
	$inactive = time() - $_SESSION['last_activity'];
	
	if ($inactive > $timeOut) {
		header("Location: /admin/login/logout.php");
	}
}

$_SESSION['last_activity'] = time();