<a id="logout_btn" class="btn btn-default" href="/admin/login/logout.php">Logout</a>

<div id="ok-message-box" class="alert alert-success">Saved</div>

<div id="error-message-box" class="alert alert-danger">
	Error!! Something went wrong..<br>The changes are not saved!!
</div>



<!-- BS Modals -->

<!-- Generic Manage Table Modal -->
<div class="modal fade" id="table_manage_modal" tabindex="-1" role="dialog" style="z-index: 1100">
	<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<h4 class="modal-title"></h4>
			</div>

			<div class="modal-body">Loading...</div>

			<div id="table_manage_modal_data" style="display: none">
				<input type="hidden" class="table">
				<input type="hidden" class="year">
				<input type="hidden" class="args">
			</div>

			<div class="modal-footer">
				<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>




<!-- Generic New Entry Modal -->
<div class="modal fade" id="table_manage_add_modal" tabindex="-1" role="dialog" style="z-index: 1150">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<form class="modal-form form-horizontal" id="table_manage_add_form" method="POST" action="javascript:void(0);">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					<h4 class="modal-title">Add New Entry</h4>
				</div>

				<div class="modal-body">
					<div id="new_entry_split_div" class="form-group">
						<input type="hidden" id="new_entry_split_field" name="split_field">
						
						<label id="new_entry_split_label" for="new_entry_split_value" class="col-sm-2 control-label" style="text-transform: capitalize"></label>

						<div class="col-sm-5">
							<input type="text" id="new_entry_split_value" name="split_value" class="form-control" required>
						</div>
					</div>
					
					<div class="form-group">
						<label for="new_entry_name" class="col-sm-2 control-label">Name</label>

						<div class="col-sm-9">
							<input type="text" id="new_entry_name" name="name" class="form-control" required>
						</div>
					</div>
				</div>

				<div style="display: none">
					<input type="hidden" id="new_entry_table" name="table">
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
					<button type="submit" class="btn btn-primary" id="table_manage_add_btn">Add</button>
				</div>

			</form>
		</div>
	</div>
</div>





<!-- Generic Delete Modal -->
<div class="modal fade" id="table_manage_delete_modal" tabindex="-1" role="dialog" overlay="false"
	 style="z-index: 1150; font-size: 1.1em;">
	<div class="modal-dialog modal-sm" role="document">
		<div class="modal-content">
			<!--			<div class="modal-header">
							<h4 class="modal-title"></h4>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
						</div>-->

			<div class="modal-body">
				<p>
					This action is irreversible!!<br>
					Are you sure you want to delete<br>
					<span class="label label-warning"></span> ?<br>
					<br>
					Instead of Delete, you can 'Unpublish', so the item is not visible on the web site.
				</p>

				<input type="hidden" id="table_to_delete_from">
				<input type="hidden" id="id_to_delete">
			</div>

			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
				<button type="button" class="btn btn-danger" id="table_manage_delete_confirm">Delete</button>
			</div>
		</div>
	</div>
</div>


<!-- File Manager Modal -->
<div class="modal fade" id="file_manager_modal" tabindex="-1" role="dialog" style="z-index: 1200;">
	<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<h4 class="modal-title">File Manager</h4>
			</div>

			<div class="modal-body"></div>
		</div>
	</div>
</div>


<!-- Meta Data Modal -->
<div class="modal fade" id="meta_data_modal" tabindex="-1" role="dialog">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<form class="modal-form form-horizontal" id="meta_data_form" method="POST" action="javascript:void(0);">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					<h4 class="modal-title">Edit Meta Data</h4>
				</div>

				<div class="modal-body" style="direction: ltr;">
					<?
					if (!isset($metaData)) {
						?>
						<div class="alert alert-danger">
							<p>Edit meta-data is missing '$metaData' object!!</p>
							<p>Make sure your index initializes it...</p>
						</div>
						<?
					} else {
						?>
						<ul>
							<li>
								<label for="meta_keywords">Keywords</label>
								<textarea id="meta_keywords" name="meta_keywords" class="form-control"
										placeholder="Enter list of keywords. Comma (,) separated" required
										><?= $metaData['keywords'] ?></textarea>
							</li>
						
							<li>
								<label for="meta_description">Description</label>
								<textarea id="meta_description" name="meta_description" class="form-control"
										placeholder="Enter description of the website" rows="5" required
										><?= $metaData['description'] ?></textarea>
							</li>
						</ul>
						<?
					}
					?>
				</div>
				
				<div style="display: none">
					<input type="hidden" name="meta_table" value="meta_info">
				</div>

				<div class="modal-footer"  style="direction: ltr;">
					<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
					<input type="submit" class="btn btn-primary" id="meta_data_submit" value="Save">
				</div>
			</form>
		</div>
	</div>
</div>




<!-- Thumb Maker Progress Info -->
<div id="thumbs_progress" class="alert alert-warning" custom-on="false">
	<button id="thumbs_progress_close_btn" type="button" class="close" aria-label="Close">
		<span aria-hidden="true">&times;</span>
	</button>
	<h5 id="progress_title" class="text-center">Preparing Thumbnails...</h5>
</div>



<!-- Thumb Maker Errors Modal -->
<div class="modal fade" id="thumb_maker_error_modal" tabindex="-1" role="dialog" style="z-index: 2100">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">The creations of thumbnail failed for the following files:</h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
			</div>

			<div class="modal-body">
				<ul></ul>
				<div class="alert alert-warning" style="margin: 35px 0 0;">
					<p>Note: The above files <strong>doesn't have thumbnails</strong>!!</p>
					<p>It's recommended to delete them and reupload after fixing the errors...</p>
				</div>
			</div>

			<div class="modal-footer">
				<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>