var CmsParams = {
	SHOW_DEBUG_MESSAGES: true,

	objectToRemoveForLogoutBtn: '', // Selector - Leave empty for left top corner
	objectToRemoveForPreviewBtn: '', // Selector - Leave empty for left top corner

	imagesBaseDir: 'C:\\Users\\Liron\\Documents\\www\\cms-dev\\src\\images',
	// imagesBaseDir: 'C:\\Users\\Liron\\Documents\\www\\eauetgazGit\\src\\img',

	generateThumbs: true,

	gallery: {
		// enable: true,
		// previewSelector: '.gallery-test', // the DOM element must have attr 'cms-table', 'cms-id', 'cms-field'
		// singleItemSelector: 'li',
		// itemLinkSelector: '.gall-link', // Selector for the 'a' element of each gallery item
		// rowCloneSelector: '#empty_gallery_item', // preferabely ID
		thumbFolder: '.thumbs',
		thumbsSeparated: false, // Affects add to gallery (find the thumb location)
		// useBreakBtn: true
	}
};