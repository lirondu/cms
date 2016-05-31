<?
session_start();

$location;
$referer = (isset($_SESSION['LOGIN_FWD_URI'])) ? $_SESSION['LOGIN_FWD_URI'] : '/';

if (isset($_GET['expire'])) {
	$location = '/admin/';
} else {
	$location = $referer;
}

session_destroy();
session_start();

$_SESSION['LOGIN_FWD_URI'] = $referer;

header('Location: ' . $location);
?>