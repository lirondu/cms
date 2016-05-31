/* global CmsCommon, CmsParams, CmsGridManage */

var CmsGalleryManage = function (container, items, rowItem, handle, plusContainer, deleteContainer, table, id, field) {
	if (!container) {
		throw new Error('CmsInlineGallery: Can\'t initialize without "container"');
	}

	if (!items) {
		throw new Error('CmsInlineGallery: Can\'t initialize without "items"');
	}

	if (!rowItem) {
		throw new Error('CmsInlineGallery: Can\'t initialize without "rowItem"');
	}

	if (!table) {
		throw new Error('CmsInlineGallery: Can\'t initialize without "table"');
	}

	if (!id) {
		throw new Error('CmsInlineGallery: Can\'t initialize without "id"');
	}

	if (!field) {
		throw new Error('CmsInlineGallery: Can\'t initialize without "field"');
	}

	this.handlers = {
		addToGallery: false,
		deleteFromGallery: false,
		customInit: false
	};

	this.gridManager = null;
	this.container = container;
	this.items = items;
	this.rowItem = rowItem;
	this.handle = (handle) ? handle : false;
	this.plusContainer = (plusContainer) ? plusContainer : false;
	this.deleteContainer = (deleteContainer) ? deleteContainer : false;
	this.table = table;
	this.id = id;
	this.field = field;
	this.useBreakButton = false;

	this.addSaveButtonToGallery = function () {
		var saveBtn = $('<div class="cms-gallery-save-btn-div"><button class="btn btn-sm btn-primary">Save Gallery</button></div>');
		$(this.container).append(saveBtn);
	};

	this.registerSaveAction = function () {
		var self = this;
		$(this.container).find('.cms-gallery-save-btn-div button').click(function () {
			self.submit();
		});
	};

	this.addDragHandlerToSingleItem = function (item) {
		var dragHandle = $('<button class="cms-gallery-drag-btn btn btn-default btn-xs"><span class="glyphicon glyphicon-move"></span></button>');
		$(item).append(dragHandle);
	};

	this.addDragHandlerToGalleryItems = function () {
		var self = this;
		$(this.container).find(this.items).not(':last').each(function () {
			self.addDragHandlerToSingleItem(this);
		});
	};

	this.addBreakButtonToSingleItem = function (item) {
		var btnClass;
		if ($(item).attr('custom-on') === 'true') {
			btnClass = "btn-success";
		} else {
			btnClass = 'btn-warning display-none';
		}

		var breakBtn = $('<button class="cms-gallery-break-btn btn btn-xs ' + btnClass + '"><span class="glyphicon glyphicon-chevron-down"></span></button>');
		$(item).append(breakBtn);
	};

	this.addBreakButtonToGridItems = function () {
		var self = this;
		$(this.container).find(this.items).not(':last').each(function () {
			self.addBreakButtonToSingleItem(this);
		});
	};

	this.registerBreakAction = function () {
		$('.cms-gallery-break-btn').off('click');
		$('.cms-gallery-break-btn').click(function () {
			var parent = $(this).parent(this.items);
			if (parent.attr('custom-on') === 'true') {
				parent.css('clear', '');
				parent.attr('custom-on', 'false');
				$(this).removeClass('btn-success');
				$(this).addClass('btn-warning');
			} else {
				parent.css('clear', 'both');
				parent.attr('custom-on', 'true');
				$(this).removeClass('btn-warning');
				$(this).addClass('btn-success');
			}
		});
	};

	this.registerShowButtonsOnHover = function () {
		$(this.container).find(this.items).hover(function () {
			$(this).find('.cms-gallery-break-btn').show();
			$(this).find('.cms-gallery-drag-btn').show();
		}, function () {
			$(this).find('.cms-gallery-drag-btn').hide();
			if ($(this).attr('custom-on') !== 'true') {
				$(this).find('.cms-gallery-break-btn').hide();
			}
		});
	};



	// Public

	this.addEmptyItemToGallery = function () {
		var newEl = this.gridManager.addEmptyItem();

		this.addDragHandlerToSingleItem(newEl);		
		this.addBreakButtonToSingleItem(newEl);
		this.registerBreakAction();
		this.registerShowButtonsOnHover();
		this.disableGalleryLinksAction();

		return newEl;
	};

	this.removeFromGallery = function (pos) {
		this.gridManager.removeFromGrid(pos);
	};

	this.setItemsHeight = function () {
		// var tallest = 0;
		// var images = $(this.container).find(this.items + ' img');
		// var items = $(this.container).find(this.items);

		// items.height('');

		// images.each(function () {
		// 	if ($(this).height() > tallest) {
		// 		tallest = $(this).height();
		// 	}
		// });

		// items.height(tallest);
	};

	this.serialize = function () {
		var content = $(this.container).clone();
		content.find('.cms-gallery-save-btn-div').remove();
		content.find(this.items).has('.cms-grid-manage-add-btn').remove();
		content.find('.cms-grid-manage-del-btn').remove();
		content.find('.cms-gallery-drag-btn').remove();
		content.find('.cms-gallery-break-btn').remove();
		content = content.html();
		return $('<textarea name="value">' + content + '</textarea>').serialize();
	};

	this.submit = function () {
		var data = 'table=' + this.table + '&id=' + this.id + '&field=' + this.field;
		data += '&' + this.serialize();
		data = data.replace(/\'/g, '\\\'');

		CmsCommon.DbModifierAjaxPost(data, 'inline-content-update');
	};

	this.disableGalleryLinksAction = function () {
		$(this.container).find('a').has('img').click(function (ev) {
			ev.preventDefault();
			return false;
		});
	};



	this.init = function () {
		if (!this.handlers.addToGallery) {
			throw new Error('Cant initialize gallery before "handlers.addToGrid" is defined!!');
		}

		this.gridManager = new CmsGridManage(
			this.container,
			this.items,
			this.rowItem,
			'.cms-gallery-drag-btn',
			this.plusContainer,
			this.deleteContainer
		);

		this.gridManager.handlers.addToGrid = this.handlers.addToGallery;
		this.gridManager.handlers.deleteFromGrid = this.handlers.deleteFromGallery;

		this.gridManager.init();

		this.setItemsHeight();
		this.addSaveButtonToGallery();
		this.registerSaveAction();
		this.registerShowButtonsOnHover();
		this.disableGalleryLinksAction();
		this.addDragHandlerToGalleryItems();

		if (this.handlers.customInit) {
			this.handlers.customInit();
		}

		if (this.useBreakButton) {
			this.addBreakButtonToGridItems();
			this.registerBreakAction();
		}
	};


};