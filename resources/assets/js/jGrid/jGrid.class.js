/**
 *  jGrid.class.js - Custom Data Grid JS class
 *
 *  Defines the properties and methods of the
 *  custom grid class. This version asynchronously
 *  keeps the grid updated by receiving JSON data
 *  from the server
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *  Released under the MIT license
 *
 *  Prereqs: 	jQuery, underscore.js,
 *  					jInput, jForm, $.validator
 *  			  	jApp, jUtility
 */

/**
 * jGrid instance constructor
 * @method function
 * @param  {object} options
 * @return /jGrid         	jGrid instance
 */
;module.exports = function(options) {

	'use strict';

	var self = jApp.activeGrid = this;

	/**
	 * Alias handle to the grid
	 * @method function
	 * @return {[type]} [description]
	 */
	this.$ = function() {
		return self.DOM.$grid;
	};

	/**
	 * Declare Options vars
	 * @type {Object}
	 */
		this.options = {
			formDefs : {},
			bind : {},
			events : {},
			fn : {},
			toggles : {},
			bsmsDefaults : {},
			gridHeader : {},
			tableBtns : {},
			rowBtns : {},
			withSelectedBtns : {},
			runtimeParams : options
		}; // end options

	/**
	 * HTML Templates
	 * @type {Object}
	 */
	this.html = {};

	/**
	 * Container for events once they have been delegated to avoid collisions
	 * @type {Array}
	 */
	this.delegatedEvents = [];

	/**
	 * Class Methods
	 * @type {Object}
	 */
	this.fn = {

		/**
		 * init the instance
		 * @method function
		 * @return {[type]} [description]
		 */
		_init : function() {

			jApp.log('1. Setting Options');
			jUtility.setOptions( $.extend(true, {}, jUtility.getDefaultOptions(), { tableBtns : { new : { label : 'New ' + (options.model_display || options.model) }} }, options) );

			jApp.log('2. Setting up html templates');
			jUtility.setupHtmlTemplates();

			jApp.log('3. Setting up initial parameters');
			jUtility.setInitParams();

			jApp.log('0. Get User Permissions');
			jUtility.getPermissions( options.model );

			jApp.log('4. Setting Ajax Defaults');
			jUtility.setAjaxDefaults();

			jApp.log('5. Initializing Template');
			jUtility.initializeTemplate();

			jApp.log('6. Getting grid data');
			jUtility.getGridData();

			jApp.log('7. Setting up intervals');
			//jUtility.setupIntervals();

			jApp.log('8. Building Menus');
			jUtility.buildMenus();

			jApp.log('9. Building Forms');
			jUtility.buildForms();

			jApp.log('10. Setting up bindings');
			jUtility.bind();

			//jApp.log('11. Setting up link tables')
			//jUtility.linkTables();

			// toggle the mine button if needed
			// if ( jUtility.isToggleMine() ) {
			// 	self.fn.toggleMine();
			// }

			jUtility.getCheckedOutRecords();
			jUtility.initScrollbar();
		}, // end fn
	}; // end fn defs

	// add any functions to this.fn
	this.fn = $.extend(true,  this.fn, options.fn );

	// initialize
	this.fn._init();

}; // end fn
