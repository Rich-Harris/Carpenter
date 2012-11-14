/*global app, jQuery, Anglebars, setTimeout */

(function ( app, $, Anglebars ) {

	'use strict';

	app.views.main = {
		init: function () {
			var container = $( '#app-container' );

			this.content = new Anglebars({
				el: container[0],
				template: app.model.get( 'template' )
			});


			// when user clicks the red button, trigger a global reset
			$( '#reset-paste' ).on( 'click', function () {
				app.events.fire( 'reset' );
			});


			// wait a moment so the DOM fairies can stop flapping about, then fade in
			setTimeout( function () {
				$( '#loading' ).fadeOut( 'fast', function () {
					$( '#input-row' ).removeClass( 'not-visible' );
				});
			}, 1 );
		}
	};

}( app, jQuery, Anglebars ));