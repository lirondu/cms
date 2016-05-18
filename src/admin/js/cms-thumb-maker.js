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
	}

};

// ThumbMaker.topBarHeight = $('#header').height();
// ThumbMaker.progressHeight = $('#thumbs_progress').height();
// ThumbMaker.occupiedSpace = ThumbMaker.topBarHeight + ThumbMaker.progressHeight + 15;






$(function () {
	if (!CmsParams.generateThumbs) { return; }

	CmsThumbMaker.RegisterFileManagerUploadEvent();

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
	// $('#close_error_handle').click(function () {
	// 	$(this).parents('#thumbs_progress').attr('custom-on', 'false');
	// 	$(this).parents('#thumbs_progress').fadeOut('slow', function () {
	// 		$('#progress_title').html('Preparing Thumbs...');

	// 		$('#thumbs_progress').removeClass('bg-danger');
	// 		$('#thumbs_progress').addClass('bg-warning');

	// 		$('#thumb_maker_error_modal').find('li').remove();

	// 		$('#close_error_handle').hide();
	// 	});
	// });

});