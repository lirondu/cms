#Prerequisites:
* CMS Admin is a **standalone** system (contained fully in a single folder 'admin')
* The system excpects DB worker at 'db' folder (/db/database.php)
  - Used for the site, regardless to CMS, so not under 'admin' folder
* The system excpects site 'parameters' files (not of the cms) in 'params' folder (/params)
	- parameters.php (including DB info)
* The main site db has dedicated table for **meta data** - single row (id=1) with the fields:
	- `keywords`
	- `description`


###Basic structure example:
		Project_Base
		|-- admin
		|-- db
		    |-- database.php
		|-- params
		    |-- parameters.php
		|-- rest-of-the-project-files


#Usage:
1. Add the following to the **TOP** of the main index file (***must be the first line***):
  `require_once 'admin/session.php';`
2. Add the following at the end of body (can be anywhere, for performance and override, it's better at the end)
  `require_once 'admin/include.php';`
3. Edit `/admin/sidebar/sidebar.php` for the relevant management pages
4. In case specific styling is needed, edit the css file `/admin/css/site-specific.css`.
5. Edit the meta data table name in `/admin/php/cms-dynamic-elements.php`
<br>
<br>
<br>
<br>
<br>
<br>
<br>
#Good luck :)
-------
<br>
