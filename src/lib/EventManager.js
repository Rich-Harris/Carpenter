/*global define, module */

(function ( global ) {

	'use strict';

	// Constructor
	// ===========
	//
	// If you want the event manager to store event history, pass in `true` at
	// initialization. This has a memory cost (which in most cases will be
	// insignificant, but depends how you use it), so it's disabled by default.
	var EventManager = function ( storeHistory ) {
		this.handlers = {};
		this.history = {};

		this.storeHistory = storeHistory || false;
	};

	EventManager.prototype = {
		
		// Fire the named event. Any arguments after the event name will be passed
		// to that event's handlers
		fire: function ( eventName ) {
			var handlers, i, args = Array.prototype.slice.call( arguments, 1 );

			handlers = this.handlers[ eventName ] || [];

			for ( i=0; i<handlers.length; i+=1 ) {
				try {
					handlers[i].apply( null, args );
				} catch ( err ) {
					throw err;
				}
			}

			if ( !this.storeHistory ) {
				return;
			}

			if ( !this.history[ eventName ] ) {
				this.history[ eventName ] = [];
			}
			this.history[ eventName ].push( args );
		},

		// Bind an event handler. If `retroactive === true`, the handler will
		// be fired with each set of arguments that were passed in (note that
		// historical arguments are stored by reference, so if the contents of
		// an array or object have changed, the handler will receive the new
		// value)
		//
		// Anonymous handlers are not recommended, as these cannot be removed
		// later.
		on: function ( eventName, handler, retroactive ) {
			var history, i, key;

			// allow multiple handlers to be set in one go
			if ( typeof eventName === 'object' ) {
				retroactive = handler;

				for ( key in eventName ) {
					if ( eventName.hasOwnProperty( key ) ) {
						this.on( key, eventName[ key ], retroactive );
					}
				}
				return;
			}

			// if handler is bound after events have been fired, fire them again
			if ( retroactive ) {
				history = this.history[ eventName ] || [];
				
				for ( i=0; i<history.length; i+=1 ) {
					try {
						handler.apply( null, history[i] );
					} catch ( err ) {
						throw err;
					}
				}
			}

			// add handler to list
			if ( !this.handlers[ eventName ] ) {
				this.handlers[ eventName ] = [];
			}
			this.handlers[ eventName ].push( handler );
		},

		// Remove an event handler
		off: function ( eventName, handler ) {
			var handlers, index;

			handlers = this.handlers[ eventName ];
			if ( !handlers ) {
				return false;
			}

			index = handlers.indexOf( handler );
			if ( index === -1 ) {
				return false;
			}

			handlers.splice( index, 1 );
			return true;
		},

		// Bind a handler that will be executed once all the named events
		// have been fired once. `eventNames` can be an array or (if there
		// is only one event) a string.
		//
		// If `retroactive === true`, handlers bound after the events have
		// fired will be called immediately
		after: function ( eventNames, handler, retroactive ) {
			var self = this, i, remaining, wait;

			if ( typeof eventNames === 'string' ) {
				eventNames = [ eventNames ];
			}

			i = remaining = eventNames.length;

			wait = function ( i ) {
				self._once( eventNames[i], function () {
					if ( --remaining ) {
						return;
					}
					handler();
				}, retroactive );
			};

			while ( i-- ) {
				wait( i );
			}
		},

		// Clear event history
		purgeHistory: function () {
			this.history = {};
		},

		// Internal helper method
		_once: function ( eventName, handler, retroactive ) {
			var suicidalhandler, self = this;

			suicidalhandler = function () {
				handler.apply( null, arguments );
				self.off( eventName, suicidalhandler );
			};

			this.on( eventName, suicidalhandler, retroactive );
		}
	};

	

	// CommonJS - add to exports
	if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = EventManager;
	}

	// AMD - define module
	else if ( typeof define === 'function' && define.amd ) {
		define( function () {
			return EventManager;
		});
	}

	// Browsers - create global variable
	else {
		global.EventManager = EventManager;
	}

}( this ));