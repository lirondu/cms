<?php
if (!isset($_SESSION)) {
	session_start();
}

if (isset($_SESSION['valid_admin']) && $_SESSION['valid_admin']) {
	header('location: /');
}
else if (isset($_SESSION['valid_guest']) && $_SESSION['valid_guest']) {
	header('location: /guest');
}

require_once '../params/parameters.php';
// require_once '../php/db-functions.php';

$loginError = '';

if (isset($_POST['uname']) && isset($_POST['passwd'])) {
	$uname	 = $_POST['uname'];
	$passwd	 = md5($_POST['passwd']);
	
	if (CmsParams::$LOGIN_MODE === 0) {
		if ($uname === CmsParams::$LOCAL_USER && $passwd === CmsParams::$LOCAL_PWD) {
			$_SESSION['valid_admin'] = true;
			$fwdUrl = (isset($_SESSION['LOGIN_FWD_URI'])) ? $_SESSION['LOGIN_FWD_URI'] : '/';
			header('location: ' . $fwdUrl);
		}
		else {
			$loginError = 'Wrong username or password';
		}
	}
	else {
		if (IsValidCmsAdminLogin($uname, $passwd)) {
			$_SESSION['valid_admin'] = true;
			$fwdUrl = (isset($_SESSION['LOGIN_FWD_URI'])) ? $_SESSION['LOGIN_FWD_URI'] : '/';
			header('location: ' . $fwdUrl);
		}
		else {
			$loginError = 'Wrong username or password';
		}
	}
}
?>
<!DOCTYPE html>
<html>
	<head>
        <title>Eau & Gaz CMS Login</title>
        <meta charset="UTF-8" />
		<script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>
		<script type="text/javascript" src="../plugins/jquery-ui-1.11.4.custom/jquery-ui.min.js"></script>
		<link href="../plugins/jquery-ui-1.11.4.custom/jquery-ui.min.css" rel="stylesheet" type="text/css" media="screen" />
    </head>
	<style>
		body {
			font-family: Helvetica, Arial, sans;
			font-size: 16px;
			background-color: #F9F9F9;
			padding-top: 50px;
		}
		#login_form_container {
			width: 300px;
			margin: 0 auto;
		}
		#login_error_div {
			margin-bottom: 10px;
			text-align: center;
			position: relative;
		}
		#login_error_div_close_handler {
			display: inline-block;
			width: 20px;
			height: 20px;
			position: absolute;
			right: 0;
		}
		#login_error_div_close_handler:hover {
			cursor: pointer;
		}
		#login_error_div_close {
			display: inline-block;
			width: 16px;
			height: 16px;
			position: relative;
			top: calc(50% - 8px);
		}
		h3 {
			margin-bottom: 30px;
			text-align: center;
		}
		form {
			background-color: #FFF;
			padding: 15px;
			border-radius: 5px;
			border: 1px solid #CACACA;
		}
		ul {
			list-style: none;
			margin: 0;
			padding: 0;
		}
		li {
			margin-bottom: 20px;
		}
		label {
			display: inline-block;
			width: 100%;
		}
		#error_msg {
			color: #FF3333;
		}
		input {
			border: 1px solid #909090;
			border-radius: 5px;
			width: calc(100% - 10px);
			padding: 4px;
			font-size: inherit;
			font-family: inherit !important;
		}
		input[type=submit] {
			font-size: 0.8em;
			width: 100%;
		}
		input:not([type=submit]):focus {
			border-color: #1392e9;
		}
	</style>
	<body>
		<div id="login_form_container">
			<h3>Sign in to <?= CmsParams::$SITE_NAME ?> CMS:</h3>
			<?
			if ($loginError != '') {
				?>
				<div id="login_error_div" class="ui-state-error ui-corner-all">
					<span id="login_error_div_close_handler">
						<span id="login_error_div_close" class="ui-icon ui-icon-close"></span>
					</span>
					<p><? echo $loginError; ?></p>
				</div>
				<?
			}
			?>
			<form action="index.php" method="POST" id="login_form">
				<ul>
					<li>
						<label for="uname">Username</label>
						<input type="text" id="uname" name="uname">
					</li>
					<li>
						<label for="passwd">Password</label>
						<input type="password" id="passwd" name="passwd">
					</li>
					<li>
						<input type="submit" value="Sign in">
					</li>
				</ul>
			</form>
		</div>
		<script>
			$('input').first().focus();
			$('input[type="submit"]').button();
			$('#login_error_div_close_handler').click(function (){
				$('#login_error_div').fadeOut('slow');
				$('input').first().focus();
			});
		</script>
	</body>
</html>