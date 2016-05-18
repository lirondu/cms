/* global CmsCommon, CmsConfig, CmsParams */

var CmsDynamicElements = {
	RegisterSideBarButtons: function () {
		/* Table manage modals open per button */
		$('.table-manage-open').click(function () {
			var table = $(this).attr('table');
			var title = $(this).attr('title');
			var perYear = ($(this).attr('per-year') === 'true');
			var args = $(this).attr('args');

			CmsDynamicElements.OpenManageTableModal(table, title, perYear, args);
		});
	},
	LoadSideBar: function () {
		$('#admin_sidebar').load('/admin/sidebar/sidebar.php', function () {
			CmsDynamicElements.RegisterSideBarButtons();
		});
	},
	BindActionsOnLoadedManageTable: function () {
		// Publish/Unpublish checkbox
		$('.table-manage-publish-chkbox').change(function () {
			var table = $(this).parents('tr').find('input.table-name').val();
			var id = $(this).parents('tr').find('input.id').val();
			var state = ($(this).is(':checked')) ? '1' : '0';
			var data = 'table=' + table + '&id=' + id + '&state=' + state;

			CmsCommon.DbModifierAjaxPost(data, 'table-manage-publish', function (msg) {
				CmsCommon.ShowResponseMessage(msg);
				CmsDynamicElements.RefreshManageTable();
			});
		});

		// Delete button
		$('.table-manage-delete-btn').click(function () {
			var table = $(this).parents('tr').find('input.table-name').val();
			var id = $(this).parents('tr').find('input.id').val();
			var name = $(this).parents('tr').find('.name').val();

			$('#table_manage_delete_modal .modal-body p span').text(name);
			$('#table_manage_delete_modal #table_to_delete_from').val(table);
			$('#table_manage_delete_modal #id_to_delete').val(id);
			$('#table_manage_delete_modal').modal('show');
		});

		// Add (plus) button
		$('.table_manage_plus_btn').click(function () {
			var table = $('#table_manage_modal_data .table').val();
			var splitFied = ($(this).attr('split-field')) ? $(this).attr('split-field') : false;

			$('#table_manage_add_modal #new_entry_table').val(table);

			if (splitFied) {
				$('#table_manage_add_modal #new_entry_split_label').text(splitFied);
				$('#table_manage_add_modal #new_entry_split_field').val(splitFied);
				$('#new_entry_split_div').show();
				$('#new_entry_split_div input').removeAttr('disabled');
			} else {
				$('#new_entry_split_div').hide();
				$('#new_entry_split_div input').attr('disabled', 'disabled');
			}

			$('#table_manage_add_modal').modal('show');
		});

		// Sortable table initialize
		$('.cms-table').sortable({
			items: 'tr.sortable',
			handle: '.sort-handle',
			cancel: '',
			axis: 'y',
			forcePlaceholderSize: true,
			update: function () {
				var posArray = $(this).sortable('toArray', { attribute: 'entry-id' });
				var table = $('#table_manage_modal_data .table').val();
				var data = 'table=' + table + '&pos_list=' + posArray;

				CmsCommon.DbModifierAjaxPost(data, 'table-manage-position');
			}
		});

		// Main entry select
		$('#table_manage_main_entry_select').change(function () {
			var table = $(this).attr('cms-table');
			var id = $(this).attr('cms-id');
			var field = $(this).attr('cms-field');
			var value = $(this).val();
			var data = 'table=' + table + '&id=' + id + '&field=' + field + '&value=' + value;

			CmsCommon.DbModifierAjaxPost(data, 'inline-content-update', function (msg) {
				CmsCommon.ShowResponseMessage(msg);

				if (msg === '1') {
					CmsDynamicElements.LoadSideBar();

					var main_entry_Rgx = /(.*main-entry-params=)(?:\d+)(,?.*)/;
					var args = $('#table_manage_modal_data .args').val();
					args = args.replace(main_entry_Rgx, "$1" + value + "$2");

					$('#table_manage_modal_data .args').val(args);

					CmsDynamicElements.RefreshManageTable();
				}
			});
		});

		// Thumb browse
		$('.table-manage-thumb-browse').click(function () {
			var table = $('#table_manage_modal_data .table').val();
			var id = $(this).parents('tr').find('input.id').val();
			var field = $(this).attr('cms-field');
			var imgEl = $(this).siblings('.table-manage-thumb');

			CmsConfig.elfinderParams.commandsOptions = {
				getfile: {
					multiple: false
				}
			};

			CmsConfig.elfinderParams.getFileCallback = function (file) {
				$('#file_manager_modal').modal('hide');

				var data = 'table=' + table + '&id=' + id + '&field=' + field + '&value=' + file.url;
				CmsCommon.DbModifierAjaxPost(data, 'inline-content-update', function (msg) {
					if (msg === '1') {
						imgEl.attr('src', file.url);
					} else {
						CmsCommon.ShowResponseMessage(msg);
					}
				});
			};

			$('#file_manager_modal').attr('overlay', 'true');
			$('#file_manager_modal').modal('show');
		});
	},
	LoadManageTable: function (table, perYear, args) {
		var ajaxFile = (perYear) ? '/admin/php/ajax/table-manage-per-year.php' : '/admin/php/ajax/table-manage.php';

		var data = {
			'table': table
		};

		if (args) {
			var argsArr = args.split(';');

			for (var i = 0; i < argsArr.length; i++) {
				var currArgPair = argsArr[i].split('=');

				if (currArgPair.length % 2 !== 0) {
					throw new Error('wrong args list!! check "a" element attr "args"...');
				}

				data[currArgPair[0]] = currArgPair[1];
			}
			if (CmsParams.SHOW_DEBUG_MESSAGES) {
				CmsCommon.DebugPrintObject(data);
			}
		}


		$('#table_manage_modal_data .table').val(table);
		$('#table_manage_modal_data .year').val(perYear);
		$('#table_manage_modal_data .args').val(args);

		$('#table_manage_modal').find('.modal-body').load(ajaxFile, data, function () {
			CmsDynamicElements.BindActionsOnLoadedManageTable();
		});
	},
	RefreshManageTable: function () {
		var table = $('#table_manage_modal_data .table').val();
		var perYear = ($('#table_manage_modal_data .year').val() === 'true');
		var args = $('#table_manage_modal_data .args').val();

		CmsDynamicElements.LoadManageTable(table, perYear, args);
	},
	OpenManageTableModal: function (table, title, perYear, args) {
		$('#table_manage_modal').modal('show');
		$('#table_manage_modal').find('.modal-title').html(title);
		CmsDynamicElements.LoadManageTable(table, perYear, args);
	}

};



$(function () {

	CmsDynamicElements.LoadSideBar();

	// Table manage confirm delete click
	$('#table_manage_delete_confirm').click(function () {
		var table = $('#table_manage_delete_modal #table_to_delete_from').val();
		var id = $('#table_manage_delete_modal #id_to_delete').val();
		var data = 'table=' + table + '&id=' + id;

		CmsCommon.DbModifierAjaxPost(data, 'table-manage-delete', function () {
			$('#table_manage_delete_modal').modal('hide');

			$('#table_manage_delete_modal .modal-body p span').text('');
			$('#table_manage_delete_modal input').val('');

			CmsDynamicElements.RefreshManageTable();
		});
	});



	// New entry modal - focus on first input
	$('#table_manage_add_modal').on('shown.bs.modal', function () {
		$(this).find('input[type="text"]:visible').first().focus();
	});


	// Create new entry action
	$('#table_manage_add_form').submit(function () {
		var data = $(this).serialize();

		CmsCommon.DbModifierAjaxPost(data, 'table-manage-new', function (msg) {
			CmsCommon.ShowResponseMessage(msg);

			$('#table_manage_add_modal').modal('hide');
			$('#table_manage_add_modal').find('input').val('');

			CmsDynamicElements.RefreshManageTable();
		});
	});


	// New entry modal close - keep modal open class on body (for scrollbar)
	$('#table_manage_add_modal').on('hidden.bs.modal', function () {
		$('body').addClass('modal-open');

		$(this).find('input[type="text"]').val('');
		$(this).find('input[type="hidden"]').val('');
	});


	// Modal over modal - file manager from browse
	$('#file_manager_modal').on('hidden.bs.modal', function () {
		if ($(this).attr('overlay') !== 'true') {
			return;
		}

		$('body').addClass('modal-open');
		$(this).attr('overlay', 'false');
	});


	// Table manage modal close - clear content
	$('#table_manage_modal').on('hidden.bs.modal', function () {
		$(this).find('.modal-body').html('Loading...');
	});


	// Delete entry modal close - keep modal open class on body (for scrollbar)
	$('#table_manage_delete_modal').on('hidden.bs.modal', function () {
		$('body').addClass('modal-open');
	});


	// File manager modal - open event (initialize elfinder)
	$('#file_manager_modal').on('show.bs.modal', function () {
		$('<div id="elfinder_cont"></div>').appendTo('#file_manager_modal .modal-body');
		$('#elfinder_cont').elfinder(CmsConfig.elfinderParams);
	});


	// File manager modal - close event, clear specific parameters from inline gallery
	$('#file_manager_modal').on('hidden.bs.modal', function () {
		CmsConfig.elfinderParams.commandsOptions = '';
		CmsConfig.elfinderParams.getFileCallback = null;
		$('#file_manager_modal #elfinder_cont').remove();
	});


	// Meta data form submit
	$('#meta_data_form').submit(function () {
		var data = $(this).serialize();

		CmsCommon.DbModifierAjaxPost(data, 'meta-data-update');
	});

});
