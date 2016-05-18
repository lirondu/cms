/* global CmsConfig, CmsCommon, CKEDITOR */

var CmsInlineSubmit = {
	submitMode: 0, // 0 - auto inline, 1 - manual serialize
	textChangedFlag: false,
	editorChangedFlag: false,

	// Serialize specific element - by selecter
	SerializeInlineElement: function (selector) {
		var el = $(selector);
		var table = el.attr('cms-table');
		var id = el.attr('cms-id');
		var field = el.attr('cms-field');
		var data = "table=" + table + "&id=" + id + '&field=' + field;

		var type;
		if (el.attr('cms-inline') === 'text') {
			type = 0;
		} else if (el.attr('cms-inline') === 'editor') {
			type = 1;
		} else if (el.attr('cms-inline') === 'list') {
			type = 2;
		} else if (el.attr('cms-inline') === 'pic-browse') {
			type = 3;
		}


		switch (type) {
			case 0:
				data += '&' + $('<textarea name="value">' + el.html() + '</textarea>').serialize()
					.replace(/\'/g, '\\\'');
				break;

			case 1:
				data += '&' + $('<textarea name="value">' + el.html() + '</textarea>').serialize()
					.replace(/\'/g, '\\\'');
				break;

			case 2:
				data += '&' + el.serialize();
				break;

			case 3:
				data += '&value=' + el.attr('src');
				break;

			default:
				return false;
		}

		if (CmsConfig.SHOW_DEBUG_MESSAGES) {
			console.log(data);
		}

		return data;
	},

	// Register submit action
	RegisterInlineElementsSubmit: function () {
		if (CmsInlineSubmit.submitMode === 0) {
			$('[cms-inline="text"]').blur(function () {
				if (CmsInlineSubmit.textChangedFlag) {
					CmsInlineSubmit.SubmitInlineElement(this);
				}
			});

			$('[cms-inline="editor"]').blur(function () {
				if (CmsInlineSubmit.editorChangedFlag) {
					CmsInlineSubmit.SubmitInlineElement(this);
				}
			});

			$('[cms-inline="list"]').change(function () {
				CmsInlineSubmit.SubmitInlineElement(this);
			});
		}
	},

	// Submit specific element - by selector
	SubmitInlineElement: function (selector) {
		var data = CmsInlineSubmit.SerializeInlineElement(selector);
		CmsCommon.DbModifierAjaxPost(data, 'inline-content-update', function (msg) {
			CmsCommon.ShowResponseMessage(msg);

			if (msg === '1') {
				CmsInlineSubmit.textChangedFlag = false;
				CmsInlineSubmit.editorChangedFlag = false;
			}
		});
	},

	// Change event updates flags - so submit happens only if there was a change
	RegisterChangeEvents: function () {
		CKEDITOR.on('instanceCreated', function (event) {
			event.editor.on('change', function () {
				CmsInlineSubmit.editorChangedFlag = true;
			});
		});

		$('[cms-inline="text"]').on('input', function () {
			CmsInlineSubmit.textChangedFlag = true;
		});
	}
};