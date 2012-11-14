/*global app, jQuery, ZeroClipboard, document, setTimeout, clearTimeout */

(function ( app, $, ZeroClipboard ) {

	'use strict';

	app.views.output = {
		init: function () {
			var self = this;

			this.textarea = $( '#output' );

			$( '#select-all' ).on( 'click', function () {
				self.textarea.focus().select();
			});

			app.model.observe( 'data', function ( data ) {
				var rendered = app.model.get( 'tableTemplate' ).render({
					header: data[0],
					body: data.slice( 1 ),
					preview: false
				});

				self.textarea.val( rendered );
				self.textarea.focus().select();

				// copy to clipboard functionality
				if ( !self.clipSetup ) {
					self.setupClipboard();
				}

				self.clip.setText( rendered );
			});

			app.events.on( 'reset', function () {
				self.textarea.val( '' );
			});
		},

		setupClipboard: function () {
			var self = this, clip, reselect, timeout;

			this.status = $( '#clipboard-status' );
			app.views.main.content.set( 'clipboardEnabled', true );

			ZeroClipboard.setMoviePath( 'assets/ZeroClipboard.swf' );

			clip = this.clip = new ZeroClipboard.Client();
			clip.glue( document.getElementById( 'copy-to-clipboard' ) );

			reselect = function () {
				self.textarea.focus().select();
			};

			clip.addEventListener( 'onMouseDown', reselect );
			clip.addEventListener( 'onMouseUp', reselect );

			clip.addEventListener( 'onComplete', function () {
				self.status.stop().css( 'opacity', 1 );

				clearTimeout( timeout );

				timeout = setTimeout( function () {
					self.status.fadeTo( 'slow', 0 );
				}, 2000 );

				reselect();
			});

			this.clipSetup = true;
		}
	};

}( app, jQuery, ZeroClipboard ));