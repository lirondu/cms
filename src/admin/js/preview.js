$(function () {
	$('#preview_btn').click(function () {
		var isOn = ($(this).attr('preview-on') === 'true');
		var cleanLocation = location.pathname;
		var isFirstArg = true;

		if (location.search) {
			var splitArgs = location.search.split('?')[1].split('&');

			for (var i = 0; i < splitArgs.length; i++) {
				if (splitArgs[i].indexOf('preview') !== -1) {
					continue;
				}

				if (isFirstArg) {
					cleanLocation += '?' + splitArgs[i];
					isFirstArg = false;
					continue;
				}

				cleanLocation += '&' + splitArgs[i];
			}
		}

		if (isOn) {
			window.location.href = cleanLocation;
		} else {
			var char = (isFirstArg) ? '?' : '&';
			window.location.href = cleanLocation + char +'preview=true';
		}
	});
});