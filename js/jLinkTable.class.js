/**  **  **  **  **  **  **  **  **  **  **  **  **  **  **  **  **
 *
 *  jLinkTable.class.js - Aysnc Grid LinkTable Class
 *
 *  Matsu Borough IT Dashboard
 *
 *  Defines the properties and methods of the
 *  custom LinkTable Class.
 *
 *  Jeremy Bloomstrom | jeremy.bloomstrom@matsugov.us
 *  Programmer Analyst
 *  Matsu Borough IT
 *
 *  Created: 		5/1/15
 *  Last Updated: 	4/20/15
 *
 *  Prereqs: 	jQuery, jStorage.js
 *
 *  Changelog:
 *   5-1-15		Created the class
 *
 */
// javascript closure
;(function( window, jQuery, $, jInput, jForm, jApp ) {

	'use strict';

	var jLinkTable = function( options ) {
		/**  **  **  **  **  **  **  **  **  **
 		 *   VARS
 		 **  **  **  **  **  **  **  **  **  **/

		// alias this
		var self = this;
		this.store = $.jStorage;
		this.form = {};
		this.linkTable = '';
		this.colParams = [];

		/**  **  **  **  **  **  **  **  **  **
		 *   DEFAULT OPTIONS
		 *
		 *  Set the default options for the
		 *  instance here. Any values specified
		 *  at runtime will overwrite these
		 *  values.
		 **  **  **  **  **  **  **  **  **  **/

		this.options = {

			oFrm : {},

			// the name of the input element
			selectLabel : '',
			selectName : '',

			// the eloquent model name, value column and label column
			model : '',
			valueColumn : '',
			labelColumn: '',

			// whether to allow multiple
			multiple : true,

			// whether the value is required
			required : false,

			// html attributes
			atts : {
				'type' : 'text',
				'class' : 'form-control'
			},

			// external data for tables, etc.
			extData : false,

			// TTL for external data (mins)
			ttl : 60*60000,

			// callback for the completed colParams
			callback : alert,

		}; // end options

		// set the runtime values for the options
		$.extend(true,this.options, options);

		/**  **  **  **  **  **  **  **  **  **
 		 *   FUNCTION DEFS
 		 **  **  **  **  **  **  **  **  **  **/
		this.fn = {

			_init : function() {
				self.colParams = [
						{
							type : 'select',
							name : self.options.selectName,
							multiple : self.options.multiple,
							_label : self.options.selectLabel,
							_optionssource : self.options.model + '.' + self.options.valueColumn,
							_labelssource : self.options.model + '.' + self.options.labelColumn,
							_firstlabel : (!!self.options.multiple) ? false : '--Choose--',
							_firstoption : (!!self.options.multiple) ? false : '0',
							required : (!!self.options.required) ? 'required' : '__OFF__',
							'data-validType' : (!!self.options.required) ? 'select' : '__OFF__',
							'data-fieldset' : 3,
							'data-ordering' : 3
						}
					];


			}, // end fn
		}

		// initialize
		this.fn._init();

		// callback the processed result
		this.options.callback( this.colParams );
	}; // end jInput declaration

	window.jLinkTable = jLinkTable; // add to global scope

})( window, jQuery, $, jInput, jForm, jApp );
