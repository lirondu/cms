<?php
//###### CREATE SESSION IF DOESN'T EXIST ######
if (!isset($_SESSION)) {
   session_start();
}

if (!isset($_SESSION['valid_admin']) || !$_SESSION['valid_admin']) {
   die('YOU ARE NOT AUTHORIZED TO VIEW THIS PAGE!!!');
}
?>
<!DOCTYPE html>
<html>

<head>
   <meta charset="utf-8">
   <title>elFinder 2.0</title>

   <!-- jQuery and jQuery UI (REQUIRED) -->
   <link rel="stylesheet" type="text/css" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">
   <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
   <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>

   <!-- CmsConfig (for uiOptions) -->
   <script src="../js/cmsConfig.js"></script>

   <!-- elFinder CSS (REQUIRED) -->
   <link rel="stylesheet" type="text/css" href="css/elfinder.min.css">
   <link rel="stylesheet" type="text/css" href="css/theme.css">

   <!-- elFinder JS (REQUIRED) -->
   <script src="js/elfinder.min.js"></script>

   <!-- elFinder translation (OPTIONAL) -->
   <script src="js/i18n/elfinder.de.js"></script>



   <!-- Load CmsConfig for ckeditor popup window -->
   <script src="/admin/js/cms-config.js"></script>




   <!-- elFinder initialization (REQUIRED) -->
   <script type="text/javascript" charset="utf-8">

      function getUrlParam(paramName) {
         var reParam = new RegExp('(?:[\?&]|&amp;)' + paramName + '=([^&]+)', 'i');
         var match = window.location.search.match(reParam);

         return (match && match.length > 1) ? match[1] : '';
      }


      $(document).ready(function() {
         var funcNum = getUrlParam('CKEditorFuncNum');

         $('#elfinder').elfinder({
            url: './php/connector.php?read-only=true',
            width: window.innerWidth - (window.innerWidth * 0.05),
            height: window.innerheight * 0.8,
            resizable: false,
            uiOptions: CmsConfig.elfinderUiOptions,
            commandsOptions: {
               getfile: {
                  multiple: false
               }
            },
            getFileCallback: function(file) {
               window.opener.CKEDITOR.tools.callFunction(funcNum, file.url);
               window.close();
            }
         });

         $('#elfinder').height($(window).innerHeight() - 30);
         $('#elfinder').width($(window).innerWidth() - 30);

         $(window).resize(function() {
            $('#elfinder').height($(window).innerHeight() - 30);
            $('#elfinder').width($(window).innerWidth() - 30);
         });
      });
   </script>

   <link href="./plugins/jquery-ui-1.11.4.custom/jquery-ui.min.css" rel="stylesheet" type="text/css" media="screen" />
   <script src="./plugins/jquery-ui-1.11.4.custom/jquery-ui.min.js"></script>
</head>

<body>

   <!-- Element where elFinder will be created (REQUIRED) -->
   <div id="elfinder"></div>

</body>

</html>