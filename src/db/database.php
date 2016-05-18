<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/params/parameters.php';

class Database extends MySQLi {

	private static $instance = null;
	private static $host;
	private static $user;
	private static $password;
	private static $database;


	private function __construct() {
		parent::__construct(self::$host, self::$user, self::$password, self::$database);
	}


	private static function getInstance() {
		if (self::$instance == null) {
			self::$instance = new self();

			if (self::$instance->connect_errno) {
				die('Database: DB connection failed!!');
			}

			if (!self::$instance->set_charset("utf8")) {
				die("Database: Error loading character set utf8!!");
			}
		}

		return self::$instance;
	}


	public static function Initialize($host, $user, $password, $database) {
		self::$host		 = $host;
		self::$user		 = $user;
		self::$password	 = $password;
		self::$database	 = $database;

		self::getInstance();
	}


	// public services
	public static function GetTable($tableName, $orderBy = null) {
		$retTable	 = [];
		$order		 = ($orderBy) ? 'ORDER BY ' . $orderBy : '';

		$result = self::$instance->query("SELECT * FROM `$tableName` $order");
		if ($result) {
			while ($row = $result->fetch_assoc()) {
				$retTable[] = $row;
			}

			return $retTable;
		} else {
			die('Database: Wrong GetTable!!');
		}
	}


	public static function GetTableNextPos($tableName) {
		$retTable = [];

		$result = self::$instance->query("SELECT * FROM `$tableName` ORDER BY position DESC LIMIT 1");
		if ($result) {
			$retTable = $result->fetch_assoc();
			return (int) $retTable['position'] + 1;
		} else {
			die('Database: Wrong GetTableNextPos!!');
		}
	}


	public static function GetPublishedEntries($tableName) {
		$result = self::$instance->query("SELECT * FROM `$tableName` WHERE published=1");

		if ($result) {
			while ($row = $result->fetch_assoc()) {
				$table[] = $row;
			}

			return $table;
		} else {
			return false;
		}
	}


	public static function GetEntry($tableName, $entryId) {
		$result = self::$instance->query("SELECT * FROM `$tableName` WHERE id='$entryId' LIMIT 1");
		if ($result) {
			return $result->fetch_assoc();
		} else {
			die('Database: Wrong GetEntry!!');
		}
	}


	public static function UpdateField($table, $id, $field, $value) {
		$result = self::$instance->query("UPDATE `$table` SET `$field`='$value' WHERE id='$id' LIMIT 1");
		if ($result) {
			return true;
		}

		return false;
	}


	public static function InsertEntry($table, $fieldsArr, $valuesArr) {
		if (!is_array($fieldsArr) || !is_array($valuesArr)) {
			die('Database: InsertEntry failed!! "fieldsArr" and "valuesArr" must be arrays');
		}

		if (count($fieldsArr) !== count($valuesArr)) {
			die('Database: InsertEntry failed!! "fieldsArr" and "valuesArr" must be the same size');
		}

		$fieldsStr	 = '';
		$valuesStr	 = '';

		foreach ($fieldsArr as $key => $field) {
			$fieldsStr .= "`" . $field . "`";
			$valuesStr .= "'" . $valuesArr[$key] . "'";

			if ($key < count($fieldsArr) - 1) {
				$fieldsStr .= ',';
				$valuesStr .= ',';
			}
		}

		$result = self::$instance->query("INSERT INTO `$table` ($fieldsStr) VALUES ($valuesStr)");

		return ($result) ? true : false;
	}


	public static function DeleteEntry($table, $id) {
		$result = self::$instance->query("DELETE FROM `$table` WHERE id='$id' LIMIT 1");
		return ($result) ? true : false;
	}

}

// Initialize singleton upon include of file
Database::Initialize(GlobalParams::$DB_HOST, GlobalParams::$DB_USER, GlobalParams::$DB_PWD, GlobalParams::$DB_NAME);
