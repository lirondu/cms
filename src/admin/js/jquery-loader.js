function loadScript(url) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	
	script.src = url;
	head.appendChild(script);
}

// Load jquery if not already loaded
if (typeof jQuery === 'undefined') {
	loadScript('https://code.jquery.com/jquery-1.12.3.min.js');
	// script.src = 'https://code.jquery.com/jquery-1.12.3.min.js';
	// head.appendChild(script);
}

loadScript('https://code.jquery.com/ui/1.11.4/jquery-ui.min.js');
loadScript('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js');
loadScript('//cdn.ckeditor.com/4.5.9/standard/ckeditor.js');
loadScript('/admin/elFinder-2.1.6/js/elfinder.min.js');