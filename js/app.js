/*global jQuery, Supermodel, EventManager, Hogan, setTimeout */

var app;

(function ( $, Supermodel, EventManager, Hogan ) {

	'use strict';

	var deferreds = {}, observer;

	// set up our app
	app = {
		events: new EventManager(),
		model: new Supermodel(),
		views: {},
		utils: {}
	};


	// load our main template
	deferreds.template = $.ajax( 'assets/template.html' ).done( function ( data ) {
		app.model.set( 'template', data );
	});

	// load our table template
	deferreds.tableTemplate = $.ajax( 'assets/table-template.html' ).done( function ( data ) {
		var compiled = Hogan.compile( data );
		app.model.set( 'tableTemplate', compiled );
	});

	// wait for DOM ready
	deferreds.dom = new $.Deferred();
	$(function () {
		deferreds.dom.resolve();
	});


	// gentlemen, start your engines
	$.when( deferreds.template, deferreds.tableTemplate, deferreds.dom ).done( function () {
		app.views.main.init();
		app.views.filedrop.init();
		app.views.paste.init();
		app.views.preview.init();
		app.views.output.init();
	});


	// respond to inputted data
	app.model.observe( 'pastedData', function ( data ) {
		app.model.set( 'data', app.utils.parseData( data, '\t' ) );
	});

	app.model.observe( 'uploadedData', function ( data ) {
		app.model.set( 'data', app.utils.parseData( data, ',' ) );
	});


	// respond to reset event
	app.events.on( 'reset', function () {
		app.model.set({
			pastedData: '',
			uploadedData: ''
		});
	});


	// first time the user inputs data, show the preview and output row
	observer = app.model.observe( 'data', function () {
		setTimeout( function () {
			$( '#output-row' ).removeClass( 'not-visible' );
		}, 1 );
	});

}( jQuery, Supermodel, EventManager, Hogan ));