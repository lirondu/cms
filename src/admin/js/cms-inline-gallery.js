/* global CmsGridManage, CmsCommon, CmsConfig, baguetteBox, CmsParams, CmsGalleryManage */


/* PARAMS */
// var galleryParams = {
// fullSizeFolder: CmsConfig.galleryFullSizeDir,
// thumbFolder: CmsConfig.galleryThumbsDir,
// containerDivClass: 'text-gallery-box',
// imageTitleAttr: 'custom-name',
// showCaptionUnderThumb: true,
// captionElement: 'h5',
// captionElementClass: 'text-gallery-title cms-editable-content',
// useBreakBtn: false,
// usePicsPerRow: false
// };
/******************************************************************/



var CmsGalleryInline = {

	getImageThumbPath: function (imageSrc) {
		var imgFileNameRgx;
		if (CmsParams.gallery.thumbsSeparated) {
			imgFileNameRgx = /^(\/.+\/)(.+)(\/.+\.\w{2,5})$/;
		} else {
			imgFileNameRgx = /^(\/.+)(\/.+\.\w{2,5})$/;
		}

		var match = imageSrc.match(imgFileNameRgx);

		if (!match) {
			var errMsg;
			var origErrorContent = CmsCommon.globalErrorMessageBox.html();
			if (CmsParams.gallery.thumbsSeparated) {
				errMsg = 'Failed adding picture!! Wrong folder structure!! Thumbs must be in a separated folder!!';
				CmsCommon.globalErrorMessageBox.html(errMsg);
			} else {
				errMsg = 'Ooops.. Can\'t understand file path!! Try to rename the file or folders...';
				CmsCommon.globalErrorMessageBox.html(errMsg);
			}

			CmsCommon.globalErrorMessageBox.fadeIn('slow', function () {
				$(this).delay(6000).fadeOut('slow', function () {
					CmsCommon.globalErrorMessageBox.html(origErrorContent);
				});
			});

			return false;
		}

		var ImgMatchGroup = (CmsParams.gallery.thumbsSeparated) ? 3 : 2;
		return match[1] + '/' + CmsParams.gallery.thumbFolder + match[ImgMatchGroup];
	},

	checkInlineGalleryParams: function () {
		$('[cms-inline="gallery"]').each(function () {
			if (!$(this).attr('cms-gallery-item')) {
				throw new Error('CmsGalleryInline: missing attribute "cms-gallery-item"!!');
			} else {
				var itemSelector = $(this).attr('cms-gallery-item');
				if ($(itemSelector).length === 0) {
					throw new Error('CmsGalleryInline: wrong attribute "cms-gallery-item", items not found!!');
				}
			}

			if (!$(this).attr('cms-gallery-row-item')) {
				throw new Error('CmsGalleryInline: missing attribute "cms-gallery-row-item"!!');
			} else {
				var rowItemSelector = $(this).attr('cms-gallery-row-item');
				if ($(rowItemSelector).length === 0) {
					throw new Error('CmsGalleryInline: wrong attribute "cms-gallery-row-item", row item not found!!');
				}
			}

			if (!$(this).attr('cms-gallery-link')) {
				throw new Error('CmsGalleryInline: missing attribute "cms-gallery-link"!!');
			} else {
				var linkSelector = $(this).attr('cms-gallery-link');
				if ($(linkSelector).length === 0) {
					throw new Error('CmsGalleryInline: wrong attribute "cms-gallery-link", "a" not not found!!');
				}
			}
		});
	},

	initializeInlineGalleries: function () {
		$('[cms-inline="gallery"]').each(function () {
			var itemSelector = $(this).attr('cms-gallery-item');
			var rowItemSelector = $(this).attr('cms-gallery-row-item');
			var linkSelector = $(this).attr('cms-gallery-link');
			var table = $(this).attr('cms-table');
			var id = $(this).attr('cms-id');
			var field = $(this).attr('cms-field');
			var useBreak = ($(this).attr('cms-gallery-use-break') === 'true');

			//TODO: move attributes check to function			
			if (table === 'undefined' || table === '' ||
				id === 'undefined' || id === '' ||
				field === 'undefined' || field === '') {
				throw new Error('Can\'t initialize gallery - please check gallery element has the correct 	ttributes:' +
					'\n"cms-table", "cms-id" and "cms-field"');
			}

			var gallery = new CmsGalleryManage(this, itemSelector, rowItemSelector, '', '', '', table, id, field);

			if (useBreak) {
				gallery.useBreakButton = true;
			}

			gallery.handlers.addToGallery = function () {
				var newEl = gallery.addEmptyItemToGallery();
				var imgLink = newEl.find(linkSelector);
				var img = imgLink.find('img');
				if (imgLink.length === 0 || img.length === 0) {
					throw new Error('CmsGallery add failed!! Gallery item must contain "a" element with "img" in it!!');
				}

				CmsConfig.elfinderParams.getFileCallback = function (file) {
					var thumbFile = CmsGalleryInline.getImageThumbPath(file.url);
					if (!thumbFile) {
						gallery.removeFromGallery();
						return false;
					}

					$('#file_manager_modal').modal('hide');
					imgLink.attr('href', file.url);
					img.attr('src', thumbFile);
					gallery.setItemsHeight();
				};

				$('#file_manager_modal').modal('show');
			};

			gallery.init();
		});
	}

};




$(function () {
	CmsGalleryInline.checkInlineGalleryParams();
	CmsGalleryInline.initializeInlineGalleries();

	if (typeof baguetteBox !== 'undefined') {
		baguetteBox.destroy();
	}
	
	$(CmsParams.gallery.previewSelector + ' a').has('img').on('click', function (ev) {
		ev.preventDefault();
	});
});









// /* PARAMS */
// var galleryParams = {
// 	galleryPreviewSelector: '#gallery_content',
// 	fullSizeFolder: CmsConfig.galleryFullSizeDir,
// 	thumbFolder: CmsConfig.galleryThumbsDir,
// 	containerDivClass: 'text-gallery-box',
// 	imageTitleAttr: 'custom-name',
// 	showCaptionUnderThumb: true,
// 	captionElement: 'h5',
// 	captionElementClass: 'text-gallery-title cms-editable-content',
// 	useBreakBtn: false,
// 	usePicsPerRow: false
// };
// /******************************************************************/



// /* Globals for gullery functionality */
// var gallPreviewObj;
// var numOfPicsInGallery = 1;

// var newPicPosition;
// var EditPicTitle;
// var galleryFmDialog;
// /**************************************/




// /*####  Functions ####*/
// // /images/thumb-test/64.JPG
// function AddImageToGallery(imgSrc) {
// 	// var imgFileNameRgx = /(.*)(\/.*)/;
// 	// var imgFileNameRgx = /(.*)(galleryParams.fullSizeFolder)(\/.*)/;
// 	var imgFileNameRgx;
// 	if (galleryParams.fullSizeFolder) {
// 		imgFileNameRgx = new RegExp('(.*)(' + galleryParams.fullSizeFolder + ')(\/.*)');
// 	} else {
// 		imgFileNameRgx = new RegExp('(.*)(\/.*)');
// 	}

// 	var match = imgSrc.match(imgFileNameRgx);

// 	if (!match ||
// 			(galleryParams.fullSizeFolder && match.length !== 4) ||
// 			(!galleryParams.fullSizeFolder && match.length !== 3)) {

// 		var fullSizeImageErr = '';
// 		if (galleryParams.fullSizeFolder) {
// 			fullSizeImageErr = '\nFull size images in folder called: "' + galleryParams.fullSizeFolder + '"';
// 		}

// 		var errMsg = 'Wrong folder structure! Can\'t find thumbnail!' +
// 				'\nThe correct structure shoul be' +
// 				fullSizeImageErr +
// 				'\nThumbnails in folder called: "' + galleryParams.thumbFolder + '"';

// 		alert(errMsg);

// 		return false;
// 	}

// 	var ImgMatchGroup = (galleryParams.fullSizeFolder) ? 3 : 2;
// 	var thumbSrc = match[1] + '/' + galleryParams.thumbFolder + match[ImgMatchGroup];

// 	//add DOM elements
// 	var newImgCont = $('<div class="img-cont ' + galleryParams.containerDivClass + '" style="float: left;"></div>');
// 	var newImg = $('<a class="img-link" href="' + imgSrc + '"></a>').appendTo(newImgCont);
// 	$('<img src="' + thumbSrc + '" class="gall-thumb" />').appendTo(newImg);
// 	$('<input type="hidden" class="break-after" value="false" />').appendTo(newImg);

// 	//add buttons
// 	// $('<button class="edit-title"></button>').appendTo(newImgCont);
// 	$('<button class="pic-number" title="Click to change position">' + numOfPicsInGallery + '</button>').appendTo(newImgCont);
// 	$('<button class="delete-pic" title="Click to remove image"></button>').appendTo(newImgCont);

// 	if (galleryParams.useBreakBtn) {
// 		$('<button class="break-new-line"  title="Click to break new line></button>').appendTo(newImgCont);
// 	}

// 	//add caption
// 	if (galleryParams.showCaptionUnderThumb) {
// 		$('<' + galleryParams.captionElement + ' class="' + galleryParams.captionElementClass + '"></' + galleryParams.captionElement + '>').appendTo(newImgCont);
// 	}


// 	//add new image container to gallery preview
// 	newImgCont.appendTo(gallPreviewObj);

// 	//add new pic position to "move pic" dialog
// 	var newSelectOption = $('<option value="' + numOfPicsInGallery + '">' + numOfPicsInGallery + '</option>');
// 	$('div#img-pos-dialog').find('select#new-idx').append(newSelectOption);


// 	numOfPicsInGallery++;

// 	return true;
// }



// function AddMultipleImages(filesStr, delimiter) {
// 	var allFailed = true;
// 	var filesArr = filesStr.split(delimiter);

// 	for (var i = 0; i < filesArr.length - 1; i++) {
// 		var currResult = AddImageToGallery(filesArr[i]);

// 		if (currResult) {
// 			allFailed = false;
// 		}
// 	}

// 	if (!allFailed) {
// 		BindActionsToNewDoms();
// 		HandlePicsPerRow($('input#num-per-row-spinner').val());
// 	}
// }



// function HandlePicsPerRow(num) {
// 	var numPerRow = parseInt(num);
// 	var counter = 0;
// 	var breakBefore = false;

// 	var galleryDivsArr = gallPreviewObj.find('div.' + galleryParams.containerDivClass);

// 	galleryDivsArr.each(function (key) {
// 		if (breakBefore === false) {
// 			$(this).css('clear', '');
// 			$(this).css('float', 'left');
// 		}

// 		if (counter === numPerRow) {
// 			$(this).css('clear', 'both');
// 			counter = 0;
// 		}

// 		if ($(this).find('input.break-after').val() === "true") {
// 			galleryDivsArr.eq(key + 1).css('clear', 'both');
// 			breakBefore = true;
// 			counter = 0;
// 			return true;
// 		} else {
// 			breakBefore = false;
// 		}

// 		counter++;
// 	});
// }



// function RenumberPicsContainers() {
// 	var counter = 1;

// 	gallPreviewObj.find('div.' + galleryParams.containerDivClass).each(function () {
// 		$(this).find('.pic-number').html(counter.toString());
// 		counter++;
// 	});
// }



// function RemoveOptionFromSelectPos(opNumber) {
// 	opNumber = opNumber.toString();

// 	$('div#img-pos-dialog').find('select#new-idx option').each(function () {
// 		if ($(this).val() === opNumber) {
// 			$(this).remove();
// 			return false;
// 		}
// 	});
// }



// function BindActionsToNewDoms() {

// 	$('.pic-number').addClass('btn btn-sm btn-default');

// 	$('.delete-pic').each(function () {
// 		$(this).addClass('btn btn-sm btn-danger');
// 		if ($(this).find('span').length) {
// 			return;
// 		}

// 		$('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>').appendTo($(this));
// 	});

// 	$('.pic-number').tooltip({
// 		placement: 'right'
// 	});

// 	$('.delete-pic').tooltip({
// 		placement: 'left'
// 	});

// 	CmsInline.InitializeEditableContentElements();
// 	CmsInline.BindInlineEditableToEnableAdminButtons();

// 	//show buttons on hover
// 	$('div.img-cont').hover(function () {
// 		$(this).find('button').fadeIn(50);
// 	}, function () {
// 		$(this).find('button').each(function () {
// 			if ($(this).hasClass('break-new-line')) {
// 				var currState = $(this).parents('div.img-cont').find('input.break-after');

// 				if (currState.val() === "true") {
// 					return;
// 				}
// 			}

// 			$(this).fadeOut(50);
// 		});
// 	});


// 	//init tooltips for titles
// 	gallPreviewObj.tooltip({
// 		items: "a",
// 		position: {my: "center top-0.1"}
// 	});

// 	//Prevent image links on gallery preview
// 	$('a.img-link').click(function () {
// 		//e.stopPropagation();
// 		//e.preventDefault();
// 		return false;
// 	});


// 	//pic position link to change position
// 	$('.pic-number').click(function () {
// 		var currVal = $(this).text();
// 		$('div#img-pos-dialog').find('input#prev-idx').val(currVal);

// 		$('#new-idx').find('option').each(function () {
// 			if ($(this).attr('value') === currVal) {
// 				$(this).attr('selected', 'selected');
// 			} else {
// 				$(this).removeAttr('selected');
// 			}
// 		});

// 		newPicPosition.modal("show");
// 	});

// 	//Break after click
// 	$('button.break-new-line').unbind("click");
// 	$('button.break-new-line').click(function () {
// 		var currState = $(this).parents('div.img-cont').find('input.break-after');

// 		if (currState.val() === "true") {
// 			currState.val("false");
// 			//$(this).show();
// 		} else {
// 			currState.val("true");
// 			//$(this).hide();
// 		}

// 		HandlePicsPerRow($('input#num-per-row-spinner').val());
// 	});

// 	//Handle Break after already clicked - show
// 	$('button.break-new-line').each(function () {
// 		var currState = $(this).parents('div.img-cont').find('input.break-after');

// 		if (currState.val() === "true") {
// 			$(this).show();
// 		} else {
// 			$(this).hide();
// 		}
// 	});

// 	//edit title dialog
// 	$('button.edit-title').click(function () {
// 		var currId = $(this).parents('div.' + galleryParams.containerDivClass).find('.pic-number').text();
// 		var currTitle = $(this).parents('div.' + galleryParams.containerDivClass).find('a.img-link')
// 				.attr(galleryParams.imageTitleAttr);

// 		$('div#img-edit-title-dialog').find('input#img-title').val(currTitle);
// 		$('div#img-edit-title-dialog').find('input#curr-idx').val(currId);

// 		EditPicTitle.dialog("open");
// 	});


// 	//delete pic button
// 	$('button.delete-pic').click(function () {
// 		$('a.img-link').click(function () {
// 			return false;
// 		});

// 		$(this).parents('div.' + galleryParams.containerDivClass).fadeOut(function () {
// 			$(this).remove();
// 			RenumberPicsContainers();
// 			HandlePicsPerRow($('input#num-per-row-spinner').val());
// 			RemoveOptionFromSelectPos(numOfPicsInGallery - 1);
// 			numOfPicsInGallery--;

// 			return false;
// 		});
// 	});
// }




// function ChangePicPosition(prevId, newId) {
// 	prevId = parseInt(prevId);
// 	newId = parseInt(newId);

// 	var movingFwd = (prevId < newId) ? true : false;
// 	var counter = 1;
// 	var prevCont;


// 	gallPreviewObj.find('div.' + galleryParams.containerDivClass).each(function () {
// 		if (counter === prevId) {
// 			prevCont = $(this);
// 			$(this).remove();
// 			return false;
// 		}

// 		counter++;
// 	});


// 	counter = 1;
// 	gallPreviewObj.find('div.' + galleryParams.containerDivClass).each(function () {
// 		if (movingFwd) {
// 			if (counter === newId - 1) {
// 				$(this).after(prevCont);
// 				return false;
// 			}
// 		} else {
// 			if (counter === newId) {
// 				$(this).before(prevCont);
// 				return false;
// 			}
// 		}

// 		counter++;
// 	});


// 	RenumberPicsContainers();
// 	HandlePicsPerRow($('input#num-per-row-spinner').val());
// 	BindActionsToNewDoms();
// }



// function HandleNumOfPicsForExistGallery() {
// 	gallPreviewObj.find('div.' + galleryParams.containerDivClass).each(function () {
// 		//add new pic position to "move pic" dialog
// 		var newSelectOption = $('<option value="' + numOfPicsInGallery + '">' + numOfPicsInGallery + '</option>');
// 		$('div#img-pos-dialog').find('select#new-idx').append(newSelectOption);

// 		numOfPicsInGallery++;
// 	});
// }






// /*####  PAGE LOAD ####*/
// $(function () {
// 	gallPreviewObj = $(galleryParams.galleryPreviewSelector);

// 	BindActionsToNewDoms();
// 	HandleNumOfPicsForExistGallery();


// 	newPicPosition = $('div#img-pos-dialog').modal({
// 		show: false
// 	});


// 	/*####  Change pic title OK click ####*/
// 	$('#change-pic-title-ok').click(function () {
// 		var currPicIdx = parseInt($(this).siblings('input#curr-idx').val());
// 		var newTitle = $(this).siblings('input#img-title').val();
// 		var counter = 1;

// 		gallPreviewObj.find('div.' + galleryParams.containerDivClass).each(function () {
// 			if (counter === currPicIdx) {
// 				$(this).find('a.img-link').attr('title', newTitle);
// 				$(this).find('a.img-link').attr(galleryParams.imageTitleAttr, newTitle);
// 				EditPicTitle.dialog("close");
// 			}

// 			counter++;
// 		});
// 	});


// 	/*####  Change pic title Cancel click ####*/
// 	$('#change-pic-title-cancel').click(function () {
// 		EditPicTitle.dialog("close");
// 	});



// 	/*####  Change pic position select ####*/
// 	$('select#new-idx').change(function () {
// 		var prevIdx = $('div#img-pos-dialog').find('input#prev-idx').val();

// 		if (prevIdx !== $(this).val()) {
// 			ChangePicPosition(prevIdx, $(this).val());
// 			$(this).val("");
// 			newPicPosition.modal("hide");
// 		}
// 	});



// 	/*####  Add pictures button click ####*/
// 	$('#add-pic').click(function () {
// 		ThumbMaker.elfinderParams.commandsOptions = {
// 			getfile: {
// 				multiple: true
// 			}
// 		};

// 		ThumbMaker.elfinderParams.getFileCallback = function (files) {
// 			var filesStr = '';
// 			for (var i = 0; i < files.length; i++) {
// 				filesStr += files[i].url + ';';
// 			}

// 			AddMultipleImages(filesStr, ';');
// 		};

// 		$('#file_manager_modal').modal('show');
// 	});

// });