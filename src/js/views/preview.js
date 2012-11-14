/*global app, jQuery */

(function ( app, $ ) {

	'use strict';

	app.views.preview = {
		init: function () {
			var self = this;

			this.el = $( '#preview' );

			app.model.observe( 'data', function ( data ) {
				var rendered = app.model.get( 'tableTemplate' ).render({
					header: data[0],
					body: data.slice( 1 ),
					preview: true
				});

				self.el.html( rendered );
			});
		}
	};

}( app, jQuery ));