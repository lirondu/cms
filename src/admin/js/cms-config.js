
var CmsConfig = {
	
	//imagesBaseDir: '/home7/lirondug/public_html/devsite1/images',

	galleryFullSizeDir: '', // Leave empty - not supported by thumb-maker.php yet
	galleryThumbsDir: 'thumbs',
	elfinderAdminConnector: 'admin/elFinder-2.1.6/php/connector.php',
	elfinderReadOnlyConnector: 'admin/elFinder-2.1.6/php/connector.php?read-only=true',
	elfinderBrowser: 'admin/elFinder-2.1.6/elfinder.php', //read only (opens in pop up)

	elfinderUiOptions: {
		toolbar: [
			['mkdir'],
			['getfile'],
//			['search'],
			['view'],
			['sort'],
			['help']
		],
		tree: {
			// expand current root on init
			openRootOnLoad: true,
			// expand current work directory on open
			openCwdOnOpen: true,
			// auto load current dir parents
			syncTree: true
		},
		navbar: {
			minWidth: 150,
			maxWidth: 500
		},
		cwd: {
			// display parent folder with ".." name :)
			oldSchool: false,
			// file info columns displayed
			listView: {
				columns: ['perm', 'date', 'size', 'kind'],
				columnsCustomName: {}
			}
		}
	}

};


CmsConfig.elfinderParams = {
	url: CmsConfig.elfinderAdminConnector,
	width: '99%',
	height: $(window).height() * 0.8,
	resizable: false,
	uiOptions: CmsConfig.elfinderUiOptions
};