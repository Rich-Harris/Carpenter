/*global app, FileReader */

(function ( app, FileReader ) {

	'use strict';

	app.utils.files = {
		handle: function ( files ) {
			var file;

			if ( !files.length ) {
				return;
			}

			if ( files.length > 1 ) {
				app.views.main.content.set( 'uploadError', 'One file at a time please!' );
				return;
			}

			file = files[0];

			this.load( file );
		},

		load: function ( file ) {
			var reader = new FileReader(), wrongType;

			if ( file.type !== 'text/csv' ) {
				app.views.main.content.set({
					uploadError: 'This doesn\'t look like a CSV file. Things might get weird',
					uploadStatus: ''
				});

				wrongType = true;
			}
 
			// init the reader event handlers
			reader.onload = function ( event ) {
				app.model.set( 'uploadedData', event.target.result );

				if ( !wrongType ) {
					app.views.main.content.set({
						uploadError: false,
						uploadStatus: 'Loaded ' + file.name
					});
				}
			};
			 
			// begin the read operation
			reader.readAsText(file);
		}
	};

}( app, FileReader ));