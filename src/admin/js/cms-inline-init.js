/* global CKEDITOR, CmsConfig, CmsInlineSubmit, CmsCommon */

/*
 * Attribute cms-inline enables editing - editable types:
 *		- editor: CKEDITOR instance
 *		- text: adds contenteditable to the original element (html5)
 * 	- list: insert select box to the original element with list of options
 *			 list of names and list values selectors should be passed as attributes:
 *			 (each attribute is a comma seperated list)
 *			 'cms-list-names', 'cms-list-values'
 *			 (if selected value needed) pass 'cms-list-selected' attribute
 *		- pic-browse: adds overlay browse button to replace pic
 *			 (if img is not inside a div) pass 'cms-pic-browse-div="true"
 *
 * All types should have the following attributes:
 *	cms-table
 *	cms-id
 *	cms-field
 *
 */


// CKEDITOR global definitions
CKEDITOR.disableAutoInline = true;

CKEDITOR.on('instanceCreated', function (event) {
	var editor = event.editor,
		element = editor.element;

	if (element.is('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7')) {
		editor.on('configLoaded', function () {
			editor.config.removePlugins = 'about,basicstyles,colorbutton,find,flash,font,' +
				'forms,iframe,image,newpage,removeformat,' +
				'scayt,smiley,specialchar,stylescombo,templates,links';

			editor.config.removeButtons = 'Link,Unlink,Anchor,PasteFromWord,Outdent,Indent';

		});
	}
});


var CmsInlineInit = {

	/*##### Initializers #####*/

	InitializeEditableContentElements: function () {
		$('[cms-inline="text"], [cms-inline="editor"]').attr('contenteditable', 'true');
	},

	InitializeEditableListElements: function () {
		$('[cms-inline="list"]').each(function () {
			if (!$(this).attr('cms-list-names') ||
				!$(this).attr('cms-list-names')) {
				CmsCommon.DebugPrintObject(this);
				throw new Error('Cant initialize inline list!! missing attributes "cms-list-names" or "cms-list-values"');
			}

			var table = $(this).attr('cms-table');
			var id = $(this).attr('cms-id');
			var field = $(this).attr('cms-field');
			var listNames = $(this).attr('cms-list-names').split(',');
			var listValues = $(this).attr('cms-list-values').split(',');
			var listSelected = ($(this).hasAttr('cms-list-selected')) ? $(this).attr('cms-list-selected') : -1;

			if (listNames.length !== listValues.length) {
				throw new Error('Cant initialize inline list!! names and values length doesn\'t match');
			}

			var selectList = $('#cms_inline_elements_list').clone();
			selectList.attr('id', '');
			selectList.attr('cms-inline', 'list');
			selectList.attr('cms-table', table);
			selectList.attr('cms-id', id);
			selectList.attr('cms-field', field);

			for (var i in listNames) {
				if (listValues[i] === listSelected) {
					selectList.append($('<option value="' + listValues[i] + '" selected="selected">' + listNames[i] + '</option>'));
				} else {
					selectList.append($('<option value="' + listValues[i] + '">' + listNames[i] + '</option>'));
				}
			}

			$(this).before(selectList);
			$(this).remove();
		});
	},

	InitializeEditableEditorElements: function () {
		$('[cms-inline="editor"]').each(function () {
			var cke = CKEDITOR.inline(this, {
				filebrowserBrowseUrl: CmsConfig.elfinderBrowser
			});

			cke.on('instanceReady', function (ev) {
				ev.editor.setReadOnly(false);
			});
		});
	},

	RegisterPicBrowseAction: function () {
		$('.cms-editable-pic-browse-cont button').click(function () {
			var target = $(this).siblings('img');

			CmsConfig.elfinderParams.getFileCallback = function (file) {
				target.attr('src', file.url);
				$('#file_manager_modal').modal('hide');

				CmsInlineSubmit.SubmitInlineElement(target[0]);
			};

			$('#file_manager_modal').modal('show');
		});
	},

	InitializePicBrowseElements: function () {
		$('[cms-inline="pic-browse"]').each(function () {
			var parentDiv;
			if ($(this).attr('cms-pic-browse-div') === 'true') {
				parentDiv = $('<div>' + $(this).html() + '</div>');
				$(this).before(parentDiv);
				$(this).remove();
			} else {
				parentDiv = $(this).parent('div');
			}

			parentDiv.addClass('cms-editable-pic-browse-cont');
			parentDiv.append($('<button class="cms-editable-pic-browse-btn btn btn-primary">Change pic</button>'));
		});

		CmsInlineInit.RegisterPicBrowseAction();
	},

	InitializeAllEditableElements: function () {
		CmsInlineInit.InitializeEditableContentElements();
		CmsInlineInit.InitializeEditableListElements();
		CmsInlineInit.InitializeEditableEditorElements();
		CmsInlineInit.InitializePicBrowseElements();
	}
};


$(function () {

	// Markup editable content (for bootstrap tooltips)
	$('[cms-inline="text"], [cms-inline="editor"], [cms-inline="list"], [cms-inline="pic-browse"]')
		.attr('data-toggle', 'tooltip');

	$('[cms-inline="text"], [cms-inline="editor"], [cms-inline="list"], [cms-inline="pic-browse"]')
		.each(function () {
			var title = 'Editable content';

			if ($(this).attr('tooltip')) {
				title = $(this).attr('tooltip');
			}

			$(this).attr('title', title);
		});


	// Bootstrap activate tooltip
	$('[data-toggle="tooltip"]').tooltip();


	// Register change events for text and editor
	CmsInlineSubmit.RegisterChangeEvents();

	// Init all inline content
	CmsInlineInit.InitializeAllEditableElements();

	// Register submit actions for all inline elements
	CmsInlineSubmit.RegisterInlineElementsSubmit();

});