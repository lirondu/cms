<?
class CmsParams {
	public static $IMAGES_BASE_DIR = 'C:\\Users\\Liron\\Documents\\www\\cms-dev\\src\\images';
//	public static $IMAGES_BASE_DIR = 'C:\\Users\\Liron\\Documents\\www\\eauetgazGit\\src\\img\\';
	public static $IMAGES_URL = '/images/';
	public static $THUMBS_DIR = '.thumbs';
	// public static $THUMBS_DIR = 'thumbs/';
	public static $THUMBS_SEPARATED = false; // Affects thumb-maker (thumb location)
	public static $SITE_NAME = 'CMS Test';
	public static $LOGIN_MODE = 0; // 0 - local, 1 - db
	public static $LOCAL_USER = 'admin';
	public static $LOCAL_PWD = '25d55ad283aa400af464c76d713c07ad'; // 1-8
	public static $LOAD_JQUERY = false; // false if the main site already uses jQuery
}
