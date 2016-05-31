<?php

if (!isset($_POST['op'])) {
	die();
}

require_once '../phpThumb-1.7.13/phpthumb.class.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/admin/params/parameters.php';

error_reporting(1);


class ThumbMaker {
	private static $thumbSize = 500;
	private static $imagesBaseDir;
	private static $thumbsDir;
	private static $thumbsDirSeparated;
	private static $imagesDirName;
	private static $filePathRgx = "/((?:(?:\\w:\\\\)|(?:\\/))(?:[\\w-+=#$&!]+[\\\\\/])+)([\\w-+=#$&!]+\\.\\w{2,5})/";
	private static $separateThumbRgx = "/((?:.*[\\/\\\\])+)(?:.+)(?:[\\/\\\\].+)/";
	
	
	// private static $winPathRgx = "/((?:\w:\\\\)(?:[\w-+=#$&]+\\\\)+)([\w-+=#$&]+\.\w+)/";
	// private static $linuxPathRgx	 = "/((?:\/)(?:[\w-+=#$&]+\/)+)([\w-+=#$&]+\.\w+)/";
	
	
	public static function Init($baseDir, $thumbsDir, $thumbsSeparated) {		
		self::$imagesBaseDir      = $baseDir;
		self::$thumbsDir          = $thumbsDir;
		self::$thumbsDirSeparated = $thumbsSeparated;
	}
	
	
	public static function GenerateThumb($file) {
		$fileAbsPath = self::$imagesBaseDir . '/' . $file;
		$imgSize	    = getimagesize($fileAbsPath);
		$sizeParam	 = ($imgSize[0] >= $imgSize[1]) ? 'w' : 'h';
		$folder = '';
		$fileName = '';
		$thumbFullPath = '';
		
		if (preg_match(self::$filePathRgx, $fileAbsPath, $m)) {
			$folder = $m[1];
			$fileName   = $m[2];
		} else {
			return 'Couldn\'t get folder and file names! Try to rename the file/folder...';
		}
		
		if (self::$thumbsDirSeparated) {
			if (preg_match(self::$separateThumbRgx, $file, $match)) {
				$thumbFullPath = self::$imagesBaseDir . '/' . $match[1] . self::$thumbsDir . '/';
			} else {
				return 'Wrong folder structure!! Full images must be in subfolder!!';
			}
		} else {
			$thumbFullPath	 = $folder . self::$thumbsDir . '/';
		}
		
		$output_filename = $thumbFullPath . $fileName;

		if (!file_exists($thumbFullPath)) {
			if (!mkdir($thumbFullPath, 0777, true)) {
				return 'Failed creating folder "' . $thumbFullPath . '"';
			}
		}

		$phpThumb = new phpThumb();

		$phpThumb->setSourceData(file_get_contents($fileAbsPath));
		$phpThumb->setParameter($sizeParam, self::$thumbSize);
		$phpThumb->setParameter('q', 100);

		if ($phpThumb->GenerateThumbnail()) {
			if (!$phpThumb->RenderToFile($output_filename)) {
				return 'Rendering image error';
			}
			$phpThumb->purgeTempFiles();
		} else {
			return 'Generate thumb file error';
		}
		
		return true;
	}
	
	
	public static function DeleteThumb($imgFile){
		$fileAbsPath = self::$imagesBaseDir . '/' . $imgFile;
		$folder = '';
		$fileName = '';
		$thumbFullPath = '';
		
		if (preg_match(self::$filePathRgx, $fileAbsPath, $m)) {
			$folder = $m[1];
			$fileName   = $m[2];
		} else {
			return 'Couldn\'t get folder and file names! Try to rename the file/folder...';
		}
		
		if (self::$thumbsDirSeparated) {
			if (preg_match(self::$separateThumbRgx, $file, $match)) {
				$thumbFullPath = self::$imagesBaseDir . '/' . $match[1] . self::$thumbsDir . '/';
			} else {
				return 'Wrong folder structure!! Full images must be in subfolder!!';
			}
		} else {
			$thumbFullPath	 = $folder . self::$thumbsDir . '/';
		}
		
		$output_filename = $thumbFullPath . $fileName;

		if (file_exists($output_filename)) {
			return unlink($output_filename);
		}
		
		return true;
	}
	
}

// Initialize ThumbMaker statics on load
ThumbMaker::Init(CmsParams::$IMAGES_BASE_DIR, CmsParams::$THUMBS_DIR, CmsParams::$THUMBS_SEPARATED);



// Post Operations

if ($_POST['op'] === 'create-thumbnails') {
	$filesArray	 = explode(';', $_POST['files']);
	$success	    = true;
	$failedFiles = '';

	foreach ($filesArray as $file) {
		if (empty($file)) {
			continue;
		}
		
		$result = ThumbMaker::GenerateThumb($file);
		if ($result !== true) {
			$success = false;
			$failedFiles .= '<span class="label label-danger">' . $file . '</span> - ' . $result . ';';
		}
	}

	echo($success) ? '1' : $failedFiles;
	return;
}


if ($_POST['op'] === 'delete-thumbnails') {
	$filesArray	 = explode(';', $_POST['files']);
	$success	    = true;
	$failedFiles = '';

	foreach ($filesArray as $file) {
		if (empty($file)) {
			continue;
		}
		
		$result = ThumbMaker::DeleteThumb($file);
		if ($result !== true) {
			$success = false;
			$failedFiles .= '<span class="label label-danger">' . $file . '</span> - ' . $result . ';';
		}
	}

	echo($success) ? '1' : $failedFiles;
	return;
}