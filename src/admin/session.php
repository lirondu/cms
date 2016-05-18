<?php
if (!isset($_SESSION)) {	
	session_start();
}

class Session {	
	public static function Validate() {
		if (isset($_SESSION['valid_admin']) && $_SESSION['valid_admin']) {
			return true;
		}
		
		return false;
	}
}

if (Session::Validate()) {
	require_once 'login/expire.php';
}