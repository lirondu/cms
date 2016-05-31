/* global CmsConfig, CmsInlineGallery */

$(function () {
	$('.photoswipe').each(function () {
		var table = 'gall_test';
		var id = '1';
		var field = 'gallery';

		var gallery = new CmsInlineGallery(this, '.img-cont', '#empty_gallery_item', '', '', table, id, field);

		gallery.handlers.addToGallery = function () {
			var newEl = gallery.addEmptyItemToGallery();
			// var newImg = $('<img style="width: 100%; height: 100%;">');

			CmsConfig.elfinderParams.getFileCallback = function (file) {
				$('#file_manager_modal').modal('hide');
				// newImg.attr('src', file.url);
				newEl.find('img').attr('src', file.url);
			};

			$('#file_manager_modal').modal('show');
		};

		gallery.init();
	});
});