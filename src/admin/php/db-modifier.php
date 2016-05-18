<?php

require '../../db/database.php';


if (!isset($_POST['mod_data'])) {
	return false;
}



/* ##### INLIE CONTENT UPDATE ##### */
if ($_POST['mod_data'] == 'inline-content-update') {
	$table	 = $_POST['table'];
	$id		 = $_POST['id'];
	$field	 = $_POST['field'];
	$value	 = $_POST['value'];

	$q = Database::UpdateField($table, $id, $field, $value);

	echo ($q) ? '1' : '0';

	return false;
}


/* ##### TABLE MANAGE PUBLISH/UNPUBLISH ##### */
if ($_POST['mod_data'] == 'table-manage-publish') {

	//DEFINE VARS FROM POSTED DATA
	$table	 = $_POST['table'];
	$id		 = $_POST['id'];
	$state	 = $_POST['state'];

	// UPDATE DB
	$q = Database::UpdateField($table, $id, 'published', $state);

	echo ($q) ? '1' : '0';

	return false;
}


/* ##### TABLE MANAGE POSITIONS ##### */
if ($_POST['mod_data'] == 'table-manage-position') {
	$table		 = $_POST['table'];
	$positions	 = $_POST['pos_list'];
	$posArray	 = explode(',', $positions);
	$q			 = true;

	foreach ($posArray as $key => $val) {
		$currPos = $key + 11; // start from 11 - reserve 10 positions for unchangeable
		$q &= Database::UpdateField($table, $val, 'position', $currPos);
	}

	echo ($q) ? '1' : '0';

	return false;
}


/* ##### TABLE MANAGE CREATE ENTRY ##### */
if ($_POST['mod_data'] == 'table-manage-new') {
	$table		 = $_POST['table'];
	$name		 = $_POST['name'];
	$pos		 = Database::GetTableNextPos($table);
	$splitField	 = (isset($_POST['split_field'])) ? $_POST['split_field'] : false;
	$splitValue	 = (isset($_POST['split_value'])) ? $_POST['split_value'] : false;

	$fieldsArr	 = array('name', 'position');
	$valuesArr	 = array($name, $pos);

	if ($splitField) {
		$fieldsArr[] = $splitField;
		$valuesArr[] = $splitValue;
	}

	$q = Database::InsertEntry($table, $fieldsArr, $valuesArr);

	echo ($q) ? '1' : '0';

	return false;
}


/* ##### TABLE MANAGE DELETE ENTRY ##### */
if ($_POST['mod_data'] == 'table-manage-delete') {
	$table	 = $_POST['table'];
	$id		 = $_POST['id'];

	$q = Database::DeleteEntry($table, $id);

	echo ($q) ? '1' : '0';

	return false;
}


/* ##### META DATA UPDATE ##### */
if ($_POST['mod_data'] == 'meta-data-update') {
	$table = $_POST['meta_table'];
	$kwd	 = $_POST['meta_keywords'];
	$desc	 = $_POST['meta_description'];
	
	$q = true;
	$q &= Database::UpdateField($table, '1', 'keywords', $kwd);
	$q &= Database::UpdateField($table, '1', 'description', $desc);
	
	echo ($q) ? '1' : '0';
	
	return false;
}


// /* GENERIC UPDATE POSITIONS */
// if ($_POST['mod_data'] == 'update-positions') {
// 	global $DB_CON;
// 	$table		 = $_POST['table'];
// 	$positions	 = $_POST['pos_array'];
// 	$posArray	 = explode(',', $positions);
// 	$q			 = true;
// 	foreach ($posArray as $key => $val) {
// 		$currPos = $key + 11; // start from 11 - reserved for unchangeable
// 		$q &= mysqli_query($DB_CON, "UPDATE `$table` SET position='$currPos' WHERE id='$val' LIMIT 1");
// 	}
// 	echo ($q) ? '1' : '0';
// 	return false;
// }
// /* DELETE PRODUCT */
// if ($_POST['mod_data'] == 'product-delete') {
// 	global $DB_CON;
// 	$id = $_POST['id'];
// 	$q = mysqli_query($DB_CON, "DELETE FROM products WHERE id='$id' LIMIT 1");
// 	echo ($q) ? '1' : '0';
// 	return false;
// }
// /* NEW PRODUCT */
// if ($_POST['mod_data'] == 'new-product') {
// 	global $DB_CON;
// 	$pos = GetNextTablePosition('products');
// 	$q = mysqli_query($DB_CON, "INSERT INTO products
//         (`position`)
// 		VALUES
//         ('$pos')"
// 	);
// 	$newId = mysqli_insert_id($DB_CON);
// 	echo ($q) ? '1,'. $newId : '0';
// 	return false;
// }


die('db-modifier: Wrong data!!');
