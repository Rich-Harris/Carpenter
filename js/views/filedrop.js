/*global app, jQuery */

(function ( app, $ ) {

	'use strict';

	app.views.filedrop = {
		init: function () {
			var self = this, reset;

			this.target = $( '#droptarget' );
			this.input = $( '#fileinput' );

			// when user clicks on target, open file dialog
			this.target.on( 'click', function () {
				self.input.trigger( 'click' );
			});

			// respond to file selections
			this.input.on( 'change', function () {
				app.utils.files.handle( this.files );
			});

			// when user drags files over the target, do nothing
			this.target.on( 'dragenter dragexit dragover', function ( event ) {
				event.preventDefault();
				event.stopPropagation();
			});

			// when user drops file on target, load it
			this.target.on( 'drop', function ( event ) {
				event.preventDefault();
				event.stopPropagation();

				app.utils.files.handle( event.dataTransfer.files );
			});



			// when user pastes in data, clear the file status
			reset = function () {
				app.views.main.content.set({
					uploadError: false,
					uploadStatus: ''
				});
			};

			app.model.observe( 'pastedData', reset );

			// ditto when reset button gets clicked
			app.events.on( 'reset', function () {
				var clone;

				reset();

				// replace input with clone of itself, so change event gets triggered
				// if user opens same file as before
				clone = self.input.clone( true );

				self.input.replaceWith( clone );
				self.input = clone;
			});
		}
	};

}( app, jQuery ));