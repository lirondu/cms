/* global CmsConfig, CmsParams, CmsCommon */


var CmsThumbMaker = {
	// Process respone from PHP and show relevant message
	ShowThumbMakerResponse: function (status) {
		if (CmsParams.SHOW_DEBUG_MESSAGES) {
			CmsCommon.DebugPrintObject(status);
		}

		if (status === '1') {
			if ($('#thumbs_progress').attr('custom-on') === 'true') {
				return;
			}

			setTimeout(function () {
				$('#thumbs_progress').addClass('alert-success');
				$('#thumbs_progress').removeClass('alert-warning');

				$('#progress_title').text('Thumbnails created successfully');
			}, 2000);

			setTimeout(function () {
				$('#thumbs_progress').fadeOut(500, function () {
					$('#progress_title').text('Preparing Thumbnails...');
					$('#thumbs_progress').addClass('alert-warning');
					$('#thumbs_progress').removeClass('alert-success');
				});
			}, 6000);
		} else {
			$('#thumbs_progress').attr('custom-on', 'true');
			var filesArray = status.split(';');

			for (var i in filesArray) {
				if (filesArray[i].length === 0) {
					continue;
				}

				$('#thumb_maker_error_modal').find('ul').append('<li><h6>' + filesArray[i] + '</h6></li>');
			}

			$('#progress_title').html('Thumbnails failed!! ' +
				'<a id="show_files" href="javascript:void(0)">Click here</a> for details...');
			$('#thumbs_progress').addClass('alert-danger');
			$('#thumbs_progress').removeClass('alert-warning');

			$('#close_error_handle').fadeIn('fast');


			$('#show_files').click(function () {
				$('#thumb_maker_error_modal').modal('show');
			});
		}
	},

	// elfinder params - with upload event for thumbs (used in other files)
	RegisterFileManagerUploadEvent: function () {
		if (!CmsConfig.elfinderParams.handlers) {
			CmsConfig.elfinderParams.handlers = {};
		}

		CmsConfig.elfinderParams.handlers.upload = function (event) {
			var uploadedFiles = event.data.added;
			if (uploadedFiles.length === 0) {
				return;
			}


			$('#thumbs_progress').fadeIn('slow');

			var allowedMimes = ['image/gif', 'image/jpeg', 'image/png'];
			var filesList = '';

			for (var i in uploadedFiles) {
				var file = uploadedFiles[i];

				if ($.inArray(file.mime, allowedMimes) >= 0) {
					var fullName = window.atob(file.hash.substring(3));

					filesList += fullName;

					if (i !== (uploadedFiles.length - 1)) {
						filesList += ';';
					}

					if (CmsParams.SHOW_DEBUG_MESSAGES) {
						console.log(filesList);
					}
				}
			} //end of uploaded file loop

			$.ajax({
				type: "POST",
				url: "/admin/php/cms-thumb-maker.php",
				data: 'op=create-thumbnails&files=' + filesList,
				success: function (msg) {
					CmsThumbMaker.ShowThumbMakerResponse(msg);
				},
				fail: function (msg) {
					CmsThumbMaker.ShowThumbMakerResponse(msg);
				}
			});

		}; //end upload event
	},

	// Register delete image to delete thumb
	RegisterFileManagerDeleteEvent: function () {
		if (!CmsConfig.elfinderParams.handlers) {
			CmsConfig.elfinderParams.handlers = {};
		}

		CmsConfig.elfinderParams.handlers.remove = function (event) {
			// Some uploades trigger "remove" event - workaround
			if (event.data.added) { return; }
			
			var removedFiles = event.data.removed;
			if (removedFiles.length === 0) {
				return;
			}

			var imgExtentions = ['gif', 'jpg', 'jpeg', 'png'];
			var filesList = '';

			for (var i in removedFiles) {
				var file = removedFiles[i];
				var fullName = window.atob(file.substring(3));
				var fileExtRgx = /(.+\.)(\w{2,5})/;
				var fileExt = fullName.match(fileExtRgx)[2];

				if ($.inArray(fileExt, imgExtentions) >= 0) {
					filesList += fullName;

					if (i !== (removedFiles.length - 1)) {
						filesList += ';';
					}

					if (CmsParams.SHOW_DEBUG_MESSAGES) {
						console.log(filesList);
					}
				}
			} //end of removed file loop

			$.ajax({
				type: "POST",
				url: "/admin/php/cms-thumb-maker.php",
				data: 'op=delete-thumbnails&files=' + filesList,
				success: function (msg) {
					// TODO: if fail - log the undeleted thumb
				},
				fail: function (msg) {
					// TODO: log the undeleted thumb
				}
			});

		}; //end of remove handler
	},

};



$(function () {
	if (!CmsParams.generateThumbs) { return; }

	CmsThumbMaker.RegisterFileManagerUploadEvent();
	CmsThumbMaker.RegisterFileManagerDeleteEvent();

	// Close error box event
	$('#thumbs_progress_close_btn').click(function () {
		$(this).parents('#thumbs_progress').attr('custom-on', 'false');

		$(this).parents('#thumbs_progress').fadeOut('slow', function () {
			$('#thumbs_progress').removeClass('alert-danger');
			$('#thumbs_progress').addClass('alert-warning');
			$('#progress_title').text('Preparing Thumbnails...');
			$('#thumb_maker_error_modal').find('li').remove();
		});
	});
});