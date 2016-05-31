<?
if (!Session::Validate()) {
	return ;
}

?>

<!-- Load jquery if not defined -->
<script>
	if (typeof jQuery === 'undefined') {
		document.write('<script src="https://code.jquery.com/jquery-1.12.3.min.js"><\/script>');
	}
</script>

<!-- jquery UI CSS -->
<link rel="stylesheet" href="https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">

<!-- bootstrap CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

<!-- jquery UI JS -->
<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>

<!-- bootstrap JS -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>

<?
// load preview button and logic
require_once 'admin/php/preview.php';

// if preview mode don't load admin components
if (isset($_GET['preview']) && $_GET['preview'] === 'true') {
	return;
}

require_once $_SERVER['DOCUMENT_ROOT'] . '/admin/params/parameters.php';
require_once 'admin/php/cms-inline-elements.php';
require_once 'admin/php/cms-dynamic-elements.php';
require_once 'cms-site-specific/site-specific.php';
?>


<link rel="stylesheet" href="/admin/elFinder-2.1.6/css/elfinder.min.css">
<link rel="stylesheet" href="/admin/css/bootstrap-override.css">
<link rel="stylesheet" href="/admin/css/cms-inline.css">
<link rel="stylesheet" href="/admin/css/cms-thumb-maker.css">
<link rel="stylesheet" href="/admin/css/cms-grid-manage.css">
<link rel="stylesheet" href="/admin/css/cms-gallery-manage.css">
<link rel="stylesheet" href="/cms-site-specific/site-specific.css">

<script src="http://cdn.ckeditor.com/4.5.9/full/ckeditor.js"></script>
<script src="/admin/elFinder-2.1.6/js/elfinder.min.js"></script>

<script src="/admin/params/parameters.js"></script>
<script src="/admin/js/cms-config.js"></script>
<script src="/admin/js/cms-common.js"></script>
<script src="/admin/js/cms-dynamic-elements.js"></script>
<script src="/admin/js/cms-inline-submit.js"></script>
<script src="/admin/js/cms-thumb-maker.js"></script>
<script src="/admin/js/cms-grid-manage.js"></script>
<script src="/admin/js/cms-gallery-manage.js"></script>
<script src="/admin/js/cms-inline-gallery.js"></script>
<script src="/admin/js/cms-inline-init.js"></script>
<script src="/cms-site-specific/site-specific.js"></script>
