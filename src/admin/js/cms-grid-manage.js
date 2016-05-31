
//
// Generic Grid Management
// params:
//  gridContainer - the object containing the sortable grid
//  gridItemsSelector - selector for grid items
//  rowItemClone - selector (preferabely id) for empty item to clone on add
//  itemsHandle - selector for handle, optional
//  plusContainer - plus card card container, if empty, using gridItems
//
var CmsGridManage = function (gridContainer, gridItemsSelector, rowItemClone, itemsHandle, plusContainer) {
	if ($(gridContainer).length === 0) {
		throw new Error('Cant initialize grid manager without container element!!');
	}

	if ($(gridItemsSelector).length === 0) {
		throw new Error('Cant initialize grid manager without grid items selector!!');
	}

	if ($(rowItemClone).length === 0) {
		throw new Error('Cant initialize grid manager without row item selector!!');
	}

	this.gridContainer = gridContainer;
	this.gridItemsSelector = gridItemsSelector;
	this.rowItemClone = rowItemClone;
	this.itemsHandle = (itemsHandle) ? itemsHandle : false;
	this.plusContainer = (plusContainer) ? plusContainer : false;
	this.gridCollection = $(this.gridContainer).find(this.gridItemsSelector);

	this.handlers = {
		addToGrid: false,
		deleteFromGrid: false,
		onUpdate: false
	};



	this.setSingleItemPositionRelative = function (item) {
		$(item).css('position', 'relative');
	};

	this.setGridItemsPositionRelative = function () {
		var self = this;
		this.gridCollection.each(function () {
			self.setSingleItemPositionRelative(this);
		});
	};

	this.addClassToItem = function (item) {
		$(item).addClass('cms-grid-item');
	};

	this.addClassToGridItems = function () {
		var self = this;
		$(this.gridContainer).find(this.gridItemsSelector).each(function () {
			self.addClassToItem(this);
		});
	};

	this.addPlusButtonToGrid = function () {
		// var plusEl = this.gridCollection.first().clone(false);
		var plusEl = $(this.rowItemClone).clone(false);
		var plusBtn = $('<a class="cms-grid-manage-add-btn">+</a>');
		plusEl.removeAttr('id');

		if (this.plusContainer) {
			plusEl.find(this.plusContainer).html('');
			plusEl.find(this.plusContainer).append(plusBtn);
			plusEl.find('.cms-grid-manage-del-btn').remove();
		} else {
			plusEl.html('');
			plusEl.append(plusBtn);
		}

		plusEl.appendTo($(this.gridContainer));
		plusEl.show();
	};

	this.registerAddAction = function () {
		var self = this;
		$(this.gridContainer).find('.cms-grid-manage-add-btn').click(function () {
			self.handlers.addToGrid();
		});
	};

	this.addDeleteButtonToSingleItem = function (item) {
		var btn = $('<button class="cms-grid-manage-del-btn btn btn-xs btn-danger">' +
			'<span class="glyphicon glyphicon-remove"></span></button>');

		$(item).append(btn);
	};

	this.addDeleteButtonToGridItems = function () {
		var self = this;
		this.gridCollection.each(function () {
			self.addDeleteButtonToSingleItem(this);
		});
	};

	this.registerDeleteAction = function () {
		var self = this;

		$('.cms-grid-manage-del-btn').click(function () {
			var el = $(this).parent(this.gridItems);
			el.remove();

			if (self.handlers.deleteFromGrid) {
				self.handlers.deleteFromGrid();
			}
		});
	};

	this.registerSingleItemShowButtonsOnHover = function (item) {
		$(item).hover(function () {
			$(this).find('.cms-grid-manage-del-btn').show();
		}, function () {
			$(this).find('.cms-grid-manage-del-btn').hide();
		});
	};

	this.registerGridItemsShowButtonsOnHover = function () {
		var self = this;
		$(this.gridContainer).find(this.gridItemsSelector).each(function () {
			self.registerSingleItemShowButtonsOnHover(this);
		});
	};



	// PUBLIC	
	this.addEmptyItem = function (beforePos) {
		var before;
		var newEl = $(this.rowItemClone).clone(false);
		newEl.removeAttr('id');

		if (!beforePos) {
			before = $(this.gridContainer).find(this.gridItemsSelector + ':last');
		} else {
			before = $(this.gridContainer).find(this.gridItemsSelector + ':nth-child(' + beforePos + ')');
			if (before.length === 0) {
				before = $(this.gridContainer).find(this.gridItemsSelector + ':last');
			}
		}

		before.before(newEl);
		newEl.show();

		this.addDeleteButtonToSingleItem(newEl);
		this.setSingleItemPositionRelative(newEl);
		this.addClassToItem(newEl);
		this.registerDeleteAction();
		this.registerSingleItemShowButtonsOnHover(newEl);

		return newEl;
	};

	this.removeFromGrid = function (pos) {
		var itemToDel;
		if (!pos) {
			itemToDel = $(this.gridContainer).find(this.gridItemsSelector + ':nth-last-child(3)');
		} else {
			itemToDel = $(this.gridContainer).find(this.gridItemsSelector + ':nth-child(' + pos + ')');
		}

		if (itemToDel.length === 0) {
			throw new Error('removeFromGrid failed: element pos doesn\'t exist');
		}

		itemToDel.remove();

		if (this.handlers.removeFromGrid) {
			this.handlers.removeFromGrid();
		}
	};

	this.serialize = function () {
		var data = $(this.gridContainer).clone();
		data.find(this.gridItemsSelector).has('.cms-grid-manage-add-btn').remove();
		return data.html();
	};

	this.init = function () {
		if (!this.handlers.addToGrid) {
			throw new Error('Cant initialize grid manager before "handlers.addToGrid" is defined!!');
		}

		$(this.rowItemClone).hide();
		this.setGridItemsPositionRelative();
		this.addDeleteButtonToGridItems();
		this.registerDeleteAction();
		this.addPlusButtonToGrid();
		this.registerAddAction();
		this.addClassToGridItems();
		this.registerGridItemsShowButtonsOnHover();

		// Initialize jQuery soertable
		$(this.gridContainer).sortable({
			items: this.gridItemsSelector + ':not(:last)',
			handle: this.itemsHandle,
			// cursor: 'move',
			cancel: '',
			tolerance: 'pointer',
			forcePlaceholderSize: true,
			update: this.handlers.onUpdate
		});
	};
};