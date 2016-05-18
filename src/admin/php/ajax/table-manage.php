<?
require_once $_SERVER['DOCUMENT_ROOT'] . '/db/database.php';

// DB table name
$tableName = (isset($_POST['table'])) ? $_POST['table'] : die('Wrong table config');

// Is table restricted
$isTableRestricted = (isset($_POST['restrict']));
if ($isTableRestricted) {
	$restrictedIds = explode(',', $_POST['restrict']);
}

// Table has main entry
$hasMainEntry = isset($_POST['main-entry-params']);
if ($hasMainEntry) {
	$mainEntryParams = explode(',', $_POST['main-entry-params']);

	if (count($mainEntryParams) !== 4) {
		die('Wrong main-entry-params!! must be 4 params');
	}

	$mainEntryCurrent	 = $mainEntryParams[0];
	$mainEntryTable		 = $mainEntryParams[1];
	$mainEntryId		 = $mainEntryParams[2];
	$mainEntryField		 = $mainEntryParams[3];
}

// Table has thumbs
$hasThumb = (isset($_POST['thumb']));
if ($hasThumb) {
	$thumbField = $_POST['thumb'];
}

// Table is splitted
$isTableSplitted = (isset($_POST['split']));
if ($isTableSplitted) {
	$splitField = $_POST['split'];
}


function ProduceTable($table, $currentSplit = null) {
	global $tableName, $isTableRestricted, $restrictedIds, $hasMainEntry, $mainEntryCurrent, $splitField, $hasThumb, $thumbField;
	?>
	<table class="table table-bordered table-hover cms-table">
		<thead>
			<tr>
				<th class="text-center col-sm-1">Pos</th>
				<th class="col-sm-4">Name</th>
				<?= ($hasThumb) ? '<th class="text-center col-sm-2">Thumbnail</th>' : '' ?>
				<th class="text-center col-sm-1">Publish</th>
				<th class="text-center col-sm-1">Delete</th>
			</tr>
		</thead>
		<tbody>
			<?
//		$table = ($isTableSplitted) ? Database::GetTable($tableName, $splitField) : Database::GetTable($tableName);

			foreach ($table as $tableItem) {
				$isChangeable = true;

				if ($isTableRestricted) {
					$isChangeable &= (!in_array($tableItem['id'], $restrictedIds));
				}

				if ($hasMainEntry) {
					$isChangeable &= ($tableItem['id'] !== $mainEntryCurrent);
				}
				?>
				<tr <?= ($isChangeable) ? 'class="sortable"' : '' ?> entry-id="<?= $tableItem['id'] ?>">
					<td>
						<div class="text-center">
							<?
							if ($isChangeable) {
								?>
								<button class="sort-handle btn btn-default btn-xs">
									<span class="glyphicon glyphicon-resize-vertical"></span>
								</button>
								<?
							}
							?>
						</div>
					</td>

					<td>
						<?= $tableItem['name'] ?>
					</td>
					
					<?
					if ($hasThumb) {
						$currthumb = ($tableItem[$thumbField] !== '') ? $tableItem[$thumbField] : '';
						?>
						<td class="text-center">
							<img class="table-manage-thumb" src="<?= $currthumb ?>">
							<button class="table-manage-thumb-browse btn btn-default btn-sm"
								cms-field="<?= $thumbField ?>">Browse...</button>
						</td>
						<?
					}
					?>

					<td class="text-center">
						<input type="checkbox" class="table-manage-publish-chkbox"
						<?= ($tableItem['published'] === '1') ? 'checked="checked"' : '' ?>
							   <?= ($isChangeable) ? '' : 'disabled="disabled"' ?>>
					</td>

					<td class="text-center">
						<button class="table-manage-delete-btn btn btn-xs
						<?= ($isChangeable) ? 'btn-danger' : 'btn-default"' ?>"
								<?= ($isChangeable) ? '' : 'disabled="disabled"' ?>>
							<span class="glyphicon glyphicon-remove"></span>
						</button>
					</td>

					<td style="display: none">
						<input type="hidden" class="table-name" value="<?= $tableName ?>">
						<input type="hidden" class="id" value="<?= $tableItem['id'] ?>">
						<input type="hidden" class="name" value="<?= $tableItem['name'] ?>">

						<!-- Special Inputs (Specific Pages) -->
						<!-- Exhibitions -->
						<?
						if (isset($tableItem['article_id'])) {
							?>
							<input type="hidden" class="article-id" value="<?= $tableItem['article_id'] ?>">
							<?
						}
						?>
					</td>
				</tr>
				<?
			}
			?>
		</tbody>
	</table>
	<?
}


function ProduceAddButton($splitField = null) {
	?>
	<div class="text-center" style="margin: 15px 0;">
		<button class="table_manage_plus_btn btn btn-xs btn-default"
				<?= ($splitField) ? 'split-field="' . $splitField . '" ' : '' ?>>
			<span class="glyphicon glyphicon-plus"></span>
		</button>
	</div>
	<?
}




// Draw the table/s
if ($isTableSplitted) {
	$table			 = Database::GetTable($tableName, $splitField . ' DESC, position');
	$splittedTable	 = array();

	foreach ($table as $tableItem) {
		$splittedTables[$tableItem[$splitField]][] = $tableItem;
	}

	foreach ($splittedTables as $key => $splitTable) {
		?>
		<h5 class="table-manage-split-header label label-primary"><?= $key ?></h5>
		<?
		ProduceTable($splitTable, $key);
	}
	ProduceAddButton($splitField);
} else {
	$table = Database::GetTable($tableName, 'position');
	ProduceTable($table);
	ProduceAddButton();
}


// Add main select if table has main entry
if ($hasMainEntry) {
	$publishedEntries = Database::GetPublishedEntries($tableName);
	?>
	<div style="margin-top: 20px;">
		<label style="margin-right: 10px;">Main Entry</label>
		<select id="table_manage_main_entry_select"
				cms-table="<?= $mainEntryTable ?>"
				cms-id="<?= $mainEntryId ?>"
				cms-field="<?= $mainEntryField ?>"
				name="value">
					<?
					foreach ($publishedEntries as $key => $entry) {
						?>
				<option value="<?= $entry['id'] ?>"
						<?= ($entry['id'] === $mainEntryCurrent) ? 'selected="selected"' : '' ?>>
							<?= $entry['name'] ?>
				</option>
				<?
			}
			?>
		</select>
	</div>
	<?
}
?>
