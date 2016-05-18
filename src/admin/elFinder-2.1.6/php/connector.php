<?php
if (!isset($_SESSION)) {
    session_start();
}

if (!isset($_SESSION['valid_admin']) || !$_SESSION['valid_admin']) {
    die('YOU ARE NOT AUTHORIZED TO VIEW THIS PAGE!!!');
}


require_once $_SERVER['DOCUMENT_ROOT'].'/admin/params/parameters.php';


$permisions = array('read' => true);
if (isset($_GET['read-only']) && $_GET['read-only'] === 'true') {
	$permisions['write'] = false;
} else {
	$permisions['write'] = true;
}



error_reporting(0); // Set E_ALL for debuging

include_once dirname(__FILE__).DIRECTORY_SEPARATOR.'elFinderConnector.class.php';
include_once dirname(__FILE__).DIRECTORY_SEPARATOR.'elFinder.class.php';
include_once dirname(__FILE__).DIRECTORY_SEPARATOR.'elFinderVolumeDriver.class.php';
include_once dirname(__FILE__).DIRECTORY_SEPARATOR.'elFinderVolumeLocalFileSystem.class.php';


function access($attr, $path, $data, $volume) {
	return strpos(basename($path), '.') === 0       // if file/folder begins with '.' (dot)
		? !($attr == 'read' || $attr == 'write')    // set read+write to false, other (locked+hidden) set to true
		:  null;                                    // else elFinder decide it itself
}


$opts = array(
	'roots' => array(
		array(
			'alias'         	=> 'Images',
			'driver'        	=> 'LocalFileSystem',
			'path'				=> CmsParams::$IMAGES_BASE_DIR,
			'URL'          	=> CmsParams::$IMAGES_URL,
			'uploadDeny'   	=> array('all'),
			'uploadAllow'  	=> array('image', 'application/pdf'),
			'uploadOrder'  	=> array('deny', 'allow'),
			'accessControl'	=> 'access',
			'defaults'			=> $permisions
		)
	)
);

// run elFinder
$connector = new elFinderConnector(new elFinder($opts));
$connector->run();

