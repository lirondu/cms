<?
require_once '../../../php/db-functions.php';
require_once '../../../php/parameters.php';
global $nonChangeablePages;
global $specialTables;

// DB table name
$tableName = (isset($_POST['table'])) ? $_POST['table'] : die('Wrong table config');

// Is table special
$isTableSpecial = (array_key_exists($tableName, $specialTables));

// If table is special - store the read-only entries
$readOnlyArr = ($isTableSpecial) ? $specialTables[$tableName] : array();

// Thumbnail field
$useMainPic = (isset($_POST['pic']) && $_POST['pic'] === 'true');
$picField = (isset($_POST['pic-field'])) ? $_POST['pic-field'] : die('wrong pic-field config');



// Draw the table/s
$tableYears = GetAllTableYears($tableName);
foreach ($tableYears as $year) {
	?>
	<h5 class="cms-table-year-title"><?= $year ?></h5>
	<table class="table table-bordered table-hover cms-table">
		<thead>
			<tr>
				<th class="col-sm-1">Pos</th>
				<th class="col-sm-6">Name</th>
				<?= ($useMainPic) ? '<th class="col-sm-4">Main Pic</th>' : '' ?>
				<th class="col-sm-1 align-center">Publish</th>
				<th class="col-sm-1 align-center">Delete</th>
			</tr>
		</thead>
		<tbody>
			<?
			$table = GetAllTableYearEntries($tableName, $year);

			foreach ($table as $tableItem) {
				if ($isTableSpecial) {
					$isChangeable = (!in_array($tableItem['id'], $readOnlyArr));
				} else {
					$isChangeable = true;
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
						<?= ($isChangeable) ? '' : '<span class="info">(Non Changeable)</span>' ?>
					</td>

					<?
					if ($useMainPic) {
						$currPic = ($tableItem[$picField] !== '') ? $tableItem[$picField] : '';
						?>
						<td>
							<!--<input type="text" readonly class="main-pic-path">-->
							<img class="main-pic" src="<?= $currPic ?>">
							<button class="main-pic-browse btn btn-default btn-sm">Browse...</button>
						</td>
						<?
					}
					?>

					<td class="align-center">
						<input type="checkbox" class="table-manage-publish-chkbox"
						<?= ($tableItem['published'] === '1') ? 'checked="checked"' : '' ?>
							   <?= ($isChangeable) ? '' : 'disabled="disabled"' ?>>
					</td>

					<td class="align-center">
						<button class="table-manage-delete-btn btn btn-xs glyphicon glyphicon-remove
								<?= ($isChangeable) ? 'btn-danger' : 'btn-default"' ?>""
								<?= ($isChangeable) ? '' : 'disabled="disabled"' ?>></button>
					</td>

					<td style="display: none">
						<input type="hidden" class="table-name" value="<?= $tableName ?>">
						<input type="hidden" class="id" value="<?= $tableItem['id'] ?>">
						<input type="hidden" class="name" value="<?= $tableItem['name'] ?>">
					</td>
				</tr>
				<?
			}
			?>
		</tbody>
	</table>

	<?
}
?>

<div class="text-center" style="margin-top: 15px;">
	<button id="table_manage_plus_btn" class="btn btn-xs btn-default glyphicon glyphicon-plus"></button>
</div>