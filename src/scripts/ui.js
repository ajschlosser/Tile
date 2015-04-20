// --------------------------------------------------
// BEGIN UI

var ui = {
	dialog: {
		esc: true,
		buttons: {
			ok: {
				event: 'click',
				text: 'OK',
				action: function(e) {
					ui.dialog.hide();
				}
			}
		}
	}
};

// END UI
// --------------------------------------------------