/*global app, jQuery */

(function ( app, $ ) {

	'use strict';

	app.views.paste = {
		init: function () {
			var self = this, reset;

			this.textarea = $( '#paste' );

			this.textarea.on( 'keydown', function ( event ) {
				if ( event.which === 13 ) {
					self.submit();
				}

				else if ( event.which === 86 && ( event.metaKey || event.ctrlKey ) ) {
					self.textarea.one( 'keyup', function () {
						self.submit();
					});
				}
			});

			reset = function () {
				self.textarea.val( '' );
				app.views.main.content.set( 'pasteStatus', '' );
			};

			app.model.observe( 'uploadedData', reset );
			app.events.on( 'reset', reset );
		},

		submit: function () {
			app.model.set( 'pastedData', this.textarea[0].value );
			app.views.main.content.set( 'pasteStatus', 'Pasted ' + app.model.get( 'data.length' ) + ' rows' );
		}
	};

}( app, jQuery ));