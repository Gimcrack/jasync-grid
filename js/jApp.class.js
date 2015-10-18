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

		var self = this;

		this.debug = true;

		if (this.debug) {
			console.warn( 'DEBUG MODE ON ')
			$.jStorage.flush();
		}

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

		/**
		 * Convenience function to access the active grid object
		 * @method function
		 * @return {[type]} [description]
		 */
		this.aG = function() {
			return this.activeGrid;
		}


		/**
		 * Convenience function to access the $grid object
		 * in the active grid
		 * @method function
		 * @return {[type]} [description]
		 */
		this.tbl = function() {
			return this.activeGrid.DOM.$grid;
		}


		/**
		 * Convenience function to access the options
		 * of the active grid
		 * @method function
		 * @return {[type]} [description]
		 */
		this.opts = function() {
			return this.activeGrid.options;
		}

		this.log = function(msg,force) {
			if (!!self.debug || !!self.force) {
				console.log(msg);
			}
		}

	};

	window.jApp = jApp;


})(window);

var jApp = new jApp();
