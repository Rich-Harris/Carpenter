/*global app */

(function ( app ) {

	'use strict';

	// shamelessly stolen from mbostock - https://raw.github.com/mbostock/d3/master/src/dsv/dsv.js
	// ===========================================================================================
	//
	// Copyright (c) 2012, Michael Bostock
	// All rights reserved.

	// Redistribution and use in source and binary forms, with or without
	// modification, are permitted provided that the following conditions are met:

	// * Redistributions of source code must retain the above copyright notice, this
	//   list of conditions and the following disclaimer.

	// * Redistributions in binary form must reproduce the above copyright notice,
	//   this list of conditions and the following disclaimer in the documentation
	//   and/or other materials provided with the distribution.

	// * The name Michael Bostock may not be used to endorse or promote products
	//   derived from this software without specific prior written permission.

	// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	// DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
	// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
	// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
	// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

	app.utils.parseData = function ( text, delimiter ) {
		var reParse = new RegExp("\r\n|[" + delimiter + "\r\n]", "g"), // field separator regex
		delimiterCode = delimiter.charCodeAt(0),

		EOL = {}, // sentinel value for end-of-line
		EOF = {}, // sentinel value for end-of-file
		rows = [], // output rows
		t, // the current token
		eol; // is the current token followed by EOL?

		reParse.lastIndex = 0; // work-around bug in FF 3.6

		function token() {
		if (reParse.lastIndex >= text.length) return EOF; // special case: end of file
		if (eol) { eol = false; return EOL; } // special case: end of line

		// special case: quotes
		var j = reParse.lastIndex;
		if (text.charCodeAt(j) === 34) {
			var i = j;
			while (i++ < text.length) {
				if (text.charCodeAt(i) === 34) {
					if (text.charCodeAt(i + 1) !== 34) break;
					i++;
				}
			}
			reParse.lastIndex = i + 2;
			var c = text.charCodeAt(i + 1);
			if (c === 13) {
				eol = true;
				if (text.charCodeAt(i + 2) === 10) reParse.lastIndex++;
			} else if (c === 10) {
				eol = true;
			}
			return text.substring(j + 1, i).replace(/""/g, "\"");
		}

		// common case
		var m = reParse.exec(text);
		if (m) {
			eol = m[0].charCodeAt(0) !== delimiterCode;
			return text.substring(j, m.index);
		}
		reParse.lastIndex = text.length;
		return text.substring(j);
		}

		while ((t = token()) !== EOF) {
			var a = [];
			while (t !== EOL && t !== EOF) {
				a.push(t);
				t = token();
			}
			rows.push(a);
		}

		return rows;
	};

}( app ));