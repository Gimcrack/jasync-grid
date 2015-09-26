/**
 *  jApp.class.js - Custom Grid App container
 *
 *
 *  Defines the properties and methods of the
 *  custom app class.
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *  Released under the MIT license
 */

;(function(window) {

	var jApp = function() {

		this.oG = {
			admin : {
				
			}
			// extend this oG object with the individual page grid objects
		};

		this.views = {
			//extend this views object with individual page views
			admin : {

			}
		}

		this.grids = {
			admin : {

			}
		}

		this.activeGrid = {};
	};

	window.jApp = jApp;


})(window);

var jApp = new jApp();
